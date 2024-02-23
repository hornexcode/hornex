from datetime import datetime

import structlog
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import (
    action,
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.leagueoflegends.serializers import (
    LeagueOfLegendsTournamentSerializer,
)
from apps.leagueoflegends.tasks import participant_registered
from apps.teams.models import Member, Team
from apps.tournaments import errors
from apps.tournaments.filters import (
    TournamentListFilter,
    TournamentListOrdering,
)
from apps.tournaments.models import Checkin, LeagueOfLegendsTournament, Registration, Tournament
from apps.tournaments.pagination import TournamentPagination
from apps.tournaments.requests import TournamentCreateSerializer
from apps.tournaments.serializers import (
    RegistrationReadSerializer,
    TournamentSerializer,
)
from apps.tournaments.usecases.create_registration import (
    CreateRegistrationUseCase,
    CreateRegistrationUseCaseParams,
)
from apps.tournaments.usecases.organizer.create_tournament import (
    CreateTournamentUseCase,
    CreateTournamentUseCaseParams,
)
from core.route import extract_game_and_platform
from jwt_token.authentication import JWTAuthentication
from lib.challonge import Tournament as ChallongeTournamentAPIResource

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


class PublicTournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"
    filter_backends = (
        DjangoFilterBackend,
        TournamentListFilter,
        TournamentListOrdering,
    )
    pagination_class = TournamentPagination

    def get_queryset(self):
        game, _ = extract_game_and_platform(self.kwargs)
        if game == LeagueOfLegendsTournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.all()
        return super().get_queryset()

    def retrieve(self, request, *args, **kwargs):
        game, _ = extract_game_and_platform(kwargs)
        if game == LeagueOfLegendsTournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().retrieve(request, *args, **kwargs)

    def construct_object(self) -> Tournament:
        """
        Returns the tournament object based on the game type
        """
        obj = self.get_object()
        if obj.game == Tournament.GameType.LEAGUE_OF_LEGENDS:
            return LeagueOfLegendsTournament.objects.get(id=obj.id)
        return obj


class OrganizerTournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    presenter_class = TournamentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "id"

    def get_presenter(self):
        return self.presenter_class

    def create(self, request, *args, **kwargs):
        params = TournamentCreateSerializer(data=request.data)
        params.is_valid(raise_exception=True)

        uc = CreateTournamentUseCase()
        tournament = uc.execute(
            CreateTournamentUseCaseParams(
                **{
                    **params,
                    "organizer_id": request.user.id,
                }
            ),
        )

        presenter = self.get_presenter(tournament)

        return Response(
            presenter.data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def start(self, request, *args, **kwargs):
        tournament = self.get_object()
        timestamp = datetime.fromisoformat(request.data.get("now"))
        tournament.start(timestamp=timestamp)

        presenter = self.get_presenter(tournament)
        return Response(
            presenter.data,
            status=status.HTTP_200_OK,
        )

    def get_queryset(self):
        game, _ = extract_game_and_platform(self.kwargs)
        if game == LeagueOfLegendsTournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.filter(organizer=self.request.user)

        return super().get_queryset()


class TournamentRegistrationViewSet(viewsets.ModelViewSet):
    """
    Manage registrations for a tournament
    """

    queryset = Registration.objects.all()
    serializer_class = RegistrationReadSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def register(self, request, **kwargs):
        uc = CreateRegistrationUseCase()

        registration = uc.execute(
            CreateRegistrationUseCaseParams(
                **{
                    **request.data,
                    "tournament": kwargs["id"],
                }
            ),
        )

        return Response(
            RegistrationReadSerializer(registration).data,
            status=status.HTTP_201_CREATED,
        )


class RegistrationViewSet(viewsets.ModelViewSet):
    """
    Manage registrations for a logged user
    """

    queryset = Registration.objects.all()
    serializer_class = RegistrationReadSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def list(self, request):
        teams = Team.objects.filter(members__in=[request.user]).values_list("id", flat=True)
        self.queryset = self.queryset.filter(
            team__in=teams,
            status__in=[
                Registration.RegistrationStatusOptions.PENDING,
                Registration.RegistrationStatusOptions.ACCEPTED,
            ],
        )
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def team_check_in_status(request, *args, **kwargs):
    if request.method == "GET":
        try:
            tournament = Tournament.objects.get(id=kwargs["tournament"])
            team = Team.objects.get(id=kwargs["team"])

            # check if user belongs to team
            if not Member.objects.filter(user=request.user).exists():
                return Response(
                    {"error": errors.UserDoesNotBelongToTeamError},
                    status=status.HTTP_403_FORBIDDEN,
                )

            check_ins = Checkin.objects.filter(
                team=team,
                tournament=tournament,
            )

            return Response(
                {
                    "tournament": tournament.id,
                    "team": team.id,
                    "checked_in": check_ins.filter(user=request.user).exists(),
                    "total": check_ins.count(),
                    "users": check_ins.values_list("user__id", flat=True),
                },
                status=status.HTTP_200_OK,
            )
        except Tournament.DoesNotExist:
            return Response(
                {"error": f"Invalid tournament for id: {kwargs['tournament']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Team.DoesNotExist:
            return Response(
                {"error": f"Invalid team for id: {kwargs['team']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def pariticipant_checked_in(request, *args, **kwargs):
    if request.method == "GET":
        try:
            tournament = Tournament.objects.get(id=kwargs["tournament"])

            checked_in = Checkin.objects.filter(
                tournament=tournament,
                user=request.user,
            ).exists()

            return Response(
                {"checked_in": checked_in},
                status=status.HTTP_200_OK,
            )
        except Tournament.DoesNotExist:
            return Response(
                {"error": f"Invalid tournament for id: {kwargs['tournament']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def check_in(request, *args, **kwargs):
    if request.method == "POST":
        try:
            tournament = Tournament.objects.get(id=kwargs["tournament"])
            team = Team.objects.get(id=kwargs["team"])
        except Tournament.DoesNotExist:
            return Response(
                {"error": f"Invalid tournament for id: {kwargs['tournament']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Team.DoesNotExist:
            return Response(
                {"error": f"Invalid team for id: {kwargs['team']}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not tournament.is_checkin_open():
            raise ValidationError({"error": errors.CheckinNotOpenError})

        user = request.user
        if user not in team.members.all():
            raise ValidationError({"error": errors.UserDoesNotBelongToTeamError})
        if tournament.teams.filter(id=team.id).count() == 0:
            raise ValidationError({"error": errors.TeamNotRegisteredError})
        if Checkin.objects.filter(tournament=tournament, team=team, user=user).exists():
            raise ValidationError({"error": errors.UserAlreadyCheckedInError})

        Checkin.objects.create(tournament=tournament, team=team, user=user)

        participant_registered(
            tournament_id=tournament.id,
            team_id=team.id,
            user_id=user.id,
        )

        if Checkin.objects.filter(tournament=tournament, team=team).count() == 2:
            ChallongeTournamentAPIResource.checkin_team(
                tournament.challonge_tournament_id,
            )

        return Response(
            {"message": "Checkin successful"},
            status=status.HTTP_200_OK,
        )


@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def tournaments_controller(request):
    if request.method == "POST":
        tournament = CreateTournamentUseCase().execute(
            CreateTournamentUseCaseParams(**{**request.data, "organizer_id": request.user.id})
        )
        return Response({"id": tournament.id}, status=status.HTTP_201_CREATED)
    if request.method == "GET":
        user = request.user
        tournaments = LeagueOfLegendsTournament.objects.filter(organizer=user).all()

        return Response(
            LeagueOfLegendsTournamentSerializer(tournaments, many=True).data,
            status=status.HTTP_200_OK,
        )
