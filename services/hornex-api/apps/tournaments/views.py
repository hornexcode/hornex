import resend
import structlog
from django.db import transaction
from django.template import Context, Template
from django.template.loader import render_to_string
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.leagueoflegends.models import Provider
from apps.leagueoflegends.models import Tournament as LeagueOfLegendsTournament
from apps.leagueoflegends.serializers import (
    LeagueOfLegendsTournamentSerializer,
)
from apps.teams.models import Membership, Team
from apps.tournaments.filters import TournamentListFilter, TournamentListOrdering
from apps.tournaments.models import Registration
from apps.tournaments.models import Tournament as BaseTournament
from apps.tournaments.pagination import TournamentPagination
from apps.tournaments.serializers import (
    RegistrationCreateSerializer,
    RegistrationReadSerializer,
    TournamentSerializer,
)
from core.route import extract_game_and_platform
from lib.challonge import Tournament as ChallongeTournament
from lib.riot import Tournament as RiotTournament

logger = structlog.get_logger(__name__)
# from apps.leagueoflegends.usecases import RegisterTeam

MINIMUM_PARTICIPANTS = 20

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
    queryset = LeagueOfLegendsTournament.objects.all()
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

        if game == LeagueOfLegendsTournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().list(request, *args, **kwargs)


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = BaseTournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"

    def get_object(self, *args, **kwargs):
        game = kwargs.get("game")

        # league of legends
        self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().get_object()

    def retrieve(self, request, *args, **kwargs):
        game, _ = extract_game_and_platform(kwargs)

        if game == LeagueOfLegendsTournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().retrieve(request, *args, **kwargs)

    @action(
        detail=True,
        methods=["get"],
    )
    def checkin(self, request, *args, **kwargs):
        # Need to call this method in order to get the
        # tournament object with the correct type
        tournament = self.construct_object()
        tournament.checkin()
        return Response(
            {"message": "Checkin successful"},
            status=status.HTTP_200_OK,
        )

    def construct_object(self) -> BaseTournament:
        """
        Returns the tournament object based on the game type
        """
        obj = self.get_object()
        if obj.game == BaseTournament.GameType.LEAGUE_OF_LEGENDS:
            return LeagueOfLegendsTournament.objects.get(id=obj.id)
        return obj


class TournamentRegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationReadSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        members = Membership.objects.filter(user=self.request.user)
        teams = [member.team for member in members]

        self.queryset = Registration.objects.filter(team__in=teams)
        status = self.request.GET.get("status", "")
        if (
            "status" in self.request.GET
            and status in Registration.RegistrationStatusType.values
        ):
            self.queryset = self.queryset.filter(status=status)
        return self.queryset

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
        params = RegistrationCreateSerializer(
            data={**request.data, "tournament": kwargs["id"]},
            context={"request": request},
        )
        if not params.is_valid():
            return Response(params.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            tournament = LeagueOfLegendsTournament.objects.get(
                id=params.data.get("tournament")
            )
        except LeagueOfLegendsTournament.DoesNotExist:
            return Response(
                {"error": f"Tournament not found for id: {params.data['tournament']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            team = Team.objects.get(id=params.data["team"])
        except Team.DoesNotExist:
            return Response(
                {"error": f"Invalid team for id: {params.data['team']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            registration = tournament.register(team)
        except ValidationError as e:
            return Response({"error": e.detail[0]}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": e.args}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Create a mailer interface to do this
        # t = Template(render_to_string("registration-success.html"))
        # resend.Emails.send(
        #     {
        #         "from": "onboarding@resend.dev",
        #         "to": "pedro357bm@gmail.com",
        #         "subject": "Tournament registration",
        #         "html": t.render(Context({"tournament": tournament})),
        #     }
        # )

        return Response(
            RegistrationReadSerializer(registration).data,
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
