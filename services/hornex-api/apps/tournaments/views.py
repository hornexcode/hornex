from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import ValidationError
from django.db import transaction

from apps.tournaments.models import Registration, Tournament
from apps.tournaments.filters import TournamentListFilter, TournamentListOrdering
from apps.tournaments.serializers import (
    RegistrationReadSerializer,
    RegistrationCreateSerializer,
    TournamentSerializer,
)
from apps.tournaments.leagueoflegends.serializers import (
    LeagueOfLegendsTournamentSerializer,
)
from apps.tournaments.pagination import TournamentPagination
from apps.tournaments.leagueoflegends.models import LeagueOfLegendsTournament

from apps.teams.models import Team
from core.route import extract_game_and_platform


# from apps.tournaments.leagueoflegends.usecases import RegisterTeam

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
        game, _ = extract_game_and_platform(kwargs)

        if game == Tournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().list(request, *args, **kwargs)


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"
    # permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]

    def get_object(self, *args, **kwargs):
        game = kwargs.get("game")
        if game == Tournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.select_for_update().all()

        return super().get_object()

    def retrieve(self, request, *args, **kwargs):
        game, _ = extract_game_and_platform(kwargs)

        if game == Tournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().retrieve(request, *args, **kwargs)

class TournamentRegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationCreateSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_object(self, *args, **kwargs):
        game = kwargs.get("game")
        if game == Tournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.select_for_update().all()

        return super().get_object()

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
    @transaction.atomic
    def register(self, request, *args, **kwargs):
        game, _ = extract_game_and_platform(kwargs)
        # validate request
        params = RegistrationCreateSerializer(
            data={**request.data, "tournament": kwargs["id"]},
            context={"request": request},
        )
        if not params.is_valid():
            return Response(params.errors, status=status.HTTP_400_BAD_REQUEST)

        tmt: Tournament = self.get_object(game=game)

        try:
            tm = Team.objects.get(id=params.data["team"])
        except Team.DoesNotExist:
            return Response(
                {"error": f"Invalid team: {params.data['team']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if tm.created_by != request.user:
            return Response(
                {"error": "You are not a allowed to register a team"},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            reg = tmt.register(tm)
        except ValidationError as e:
            return Response({"error": e.detail[0]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": e.args}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            RegistrationReadSerializer(reg).data,
            status=status.HTTP_201_CREATED,
        )


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
