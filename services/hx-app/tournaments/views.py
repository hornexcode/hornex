from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


from tournaments.models import Tournament, TournamentRegistration
from tournaments.filters import TournamentListFilter, TournamentListOrdering
from tournaments.serializers import (
    TournamentListSerializer,
    TournamentSerializer,
    RegistrationSerializer,
)
from tournaments.services import TournamentManagementService
from tournaments.pagination import TournamentPagination

# from tournaments.leagueoflegends.usecases import RegisterTeam

from lib.hornex.riot import TestApi

game_qp = openapi.Parameter(
    "game",
    openapi.IN_QUERY,
    description="Filter the list by game slug",
    type=openapi.TYPE_STRING,
)
platform_qp = openapi.Parameter(
    "platform",
    openapi.IN_QUERY,
    description="Filter the list by platform slug",
    type=openapi.TYPE_STRING,
)


class TournamentReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentListSerializer
    lookup_field = "id"
    filter_backends = (
        DjangoFilterBackend,
        TournamentListFilter,
        TournamentListOrdering,
    )
    pagination_class = TournamentPagination

    @swagger_auto_schema(
        operation_description="GET /api/v1/tournaments",
        operation_summary="List and filter paginated a tournaments",
        manual_parameters=[game_qp, platform_qp],
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="POST /api/v1/tournaments/:id/register",
        operation_summary="Register team at tournament",
    )
    @action(
        detail=True,
        methods=["post"],
    )
    def register(self, request, id=None):
        """Registers a team for a tournament."""
        # validate request
        params = RegistrationSerializer(
            data={**request.data, "tournament": id},
            context={"request": request},
        )
        if not params.is_valid():
            return Response(params.errors, status=status.HTTP_400_BAD_REQUEST)

        # register team
        svc = TournamentManagementService()
        try:
            svc.register(
                team_id=str(params.validated_data["team"]),
                tournament_id=str(params.validated_data["tournament"]),
                user_id=request.user.id,
            )
        except ObjectDoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        operation_description="DELETE /api/v1/tournaments/:id/register",
        operation_summary="Cancel team's tournament registration",
    )
    @action(
        detail=True,
        methods=["delete"],
    )
    def cancel(self, request, id=None):
        svc = TournamentManagementService()
        try:
            svc.cancel_registration(id, user_id=request.user.id)
        except ObjectDoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @swagger_auto_schema(
        operation_description="DELETE /api/v1/tournaments/:id/unregister",
        operation_summary="Unregister team from tournament",
    )
    @action(
        detail=True,
        methods=["delete"],
    )
    def unregister(self, request, id=None):
        svc = TournamentManagementService()
        try:
            svc.unregister(id, user_id=request.user.id)
        except ObjectDoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)


class TournamentRegistrationViewSet(viewsets.ModelViewSet):
    queryset = TournamentRegistration.objects.all()
    serializer_class = RegistrationSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
