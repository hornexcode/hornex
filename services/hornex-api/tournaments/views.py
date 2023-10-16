from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.response import Response

from tournaments.models import Registration, Tournament, RegistrationError
from tournaments.filters import TournamentListFilter, TournamentListOrdering
from tournaments.serializers import (
    RegistrationSerializer,
    LeagueOfLegendsTournamentSerializer,
    TournamentSerializer,
)
from tournaments.pagination import TournamentPagination
from tournaments.leagueoflegends.models import LeagueOfLegendsTournament

from teams.models import Team, TeamMember


# from tournaments.leagueoflegends.usecases import RegisterTeam

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
    serializer_class = TournamentSerializer
    lookup_field = "id"
    filter_backends = (
        DjangoFilterBackend,
        TournamentListFilter,
        TournamentListOrdering,
    )
    pagination_class = TournamentPagination

    @swagger_auto_schema(
        operation_description="GET /api/v1/tournaments",
        operation_summary="List and filter paginated tournaments",
        manual_parameters=[game_qp, platform_qp],
    )
    def list(self, request, *args, **kwargs):
        if request.query_params.get("game") == "league-of-legends":
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().list(request, *args, **kwargs)


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"

    def retrieve(self, request, *args, **kwargs):
        if kwargs.get("game") == "league-of-legends":
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="POST /api/v1/tournaments/<str:id>/register",
        operation_summary="Register a team to a tournament",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "team": openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "name": openapi.Schema(type=openapi.TYPE_STRING),
                        "captain": openapi.Schema(type=openapi.TYPE_STRING),
                        "players": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(type=openapi.TYPE_STRING),
                        ),
                    },
                )
            },
        ),
    )
    @action(
        detail=True,
        methods=["post"],
    )
    def register(self, request, id):
        # validate request
        params = RegistrationSerializer(
            data={**request.data, "tournament": id},
            context={"request": request},
        )
        if not params.is_valid():
            return Response(params.errors, status=status.HTTP_400_BAD_REQUEST)

        tmt: Tournament = self.get_object()

        try:
            tm = Team.objects.get(id=params.data["team"])
        except Team.DoesNotExist:
            return Response(
                {"error": f"Invalid team: {params.data['team']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        u = TeamMember.objects.filter(user__id=request.user.id, is_admin=True).first()
        if u is None:
            return Response(
                {"error": "You are not a allowed to register a team"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            tmt.register(tm)
        except RegistrationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(status=status.HTTP_201_CREATED)


class TournamentRegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]


class LeagueOfLegendsTournamentReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = LeagueOfLegendsTournament.objects.all()
    serializer_class = LeagueOfLegendsTournamentSerializer
    lookup_field = "id"
    filter_backends = (
        DjangoFilterBackend,
        TournamentListFilter,
        TournamentListOrdering,
    )
    pagination_class = TournamentPagination

    @swagger_auto_schema(
        operation_description="GET /api/v1/tournaments/lol/search",
        operation_summary="List and filter paginated a lol tournaments",
        manual_parameters=[game_qp, platform_qp],
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
