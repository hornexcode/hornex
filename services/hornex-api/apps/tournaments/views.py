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

from apps.accounts.models import GameID
from apps.leagueoflegends.tasks import participant_registered
from apps.teams.models import Member, Team
from apps.teams.serializers import (
    TeamSerializer,
)
from apps.tournaments import errors
from apps.tournaments.filters import (
    TournamentListFilter,
    TournamentListOrdering,
)
from apps.tournaments.models import (
    Checkin,
    LeagueOfLegendsTournament,
    Match,
    Registration,
    Tournament,
)
from apps.tournaments.pagination import TournamentPagination
from apps.tournaments.requests import (
    CheckInTournamentParams,
    CreateAndRegisterTeamIntoTournamentParams,
    EndTournamentParams,
    FinishMatchParams,
    RegisterSerializer,
    RegisterTeamIntoTournamentParams,
    StartMatchParams,
    TournamentCreateSerializer,
)
from apps.tournaments.serializers import (
    LeagueOfLegendsTournamentSerializer,
    MatchSerializer,
    ParticipantSerializer,
    PrizeSerializer,
    RegistrationSerializer,
    StandingSerializer,
    TournamentSerializer,
)
from apps.tournaments.usecases import (
    CreateAndRegisterTeamIntoTournamentInput,
    CreateAndRegisterTeamIntoTournamentUseCase,
    ListRegisteredTeamsParams,
    ListRegisteredTeamsUseCase,
    RegisterParams,
    RegisterTeamIntoTournamentInput,
    RegisterTeamIntoTournamentUseCase,
    RegisterUseCase,
    StartTournamentUseCase,
    StartTournamentUseCaseParams,
)
from apps.tournaments.usecases.organizer import (
    CheckInTournamentInput,
    CheckInTournamentUseCase,
    CreateTournamentUseCase,
    CreateTournamentUseCaseParams,
    EndMatchInput,
    EndMatchUseCase,
    EndTournamentInput,
    EndTournamentUseCase,
    StartMatchInput,
    StartMatchUseCase,
)
from core.route import extract_game_and_platform
from jwt_token.authentication import JWTAuthentication
from lib.challonge import Tournament as ChallongeTournamentAPIResource

logger = structlog.get_logger(__name__)

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
            self.serializer_class = LeagueOfLegendsTournamentSerializer
        return super().get_queryset()

    @action(detail=True, methods=["get"])
    def teams(self, request, *args, **kwargs):
        uc = ListRegisteredTeamsUseCase()
        teams = uc.execute(params=ListRegisteredTeamsParams(tournament_id=kwargs["id"]))

        data = []
        for team, participants in teams.items():
            item = {}
            item["name"] = team
            item["participants"] = []
            for participant in participants:
                item["participants"].append(
                    {
                        "id": participant["id"],
                        "nickname": participant["nickname"],
                    }
                )
            data.append(item)
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def participants(self, request, *args, **kwargs):
        tournament = self.get_object()
        participants = tournament.participants.all()
        serializer = ParticipantSerializer(participants, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def prizes(self, request, *args, **kwargs):
        tournament = self.get_object()
        prizes = tournament.prizes.all()
        serializer = PrizeSerializer(prizes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def standings(self, request, *args, **kwargs):
        tournament = self.get_object()
        ranks = tournament.ranks.all()
        serializer = StandingSerializer(ranks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrganizerTournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "id"

    def create(self, request, *args, **kwargs):
        params = TournamentCreateSerializer(data=request.data)
        params.is_valid(raise_exception=True)

        uc = CreateTournamentUseCase()
        tournament = uc.execute(
            CreateTournamentUseCaseParams(
                organizer_id=request.user.id,
                game=params.validated_data["game"],
                name=params.validated_data["name"],
                description=params.validated_data["description"],
                registration_start_date=params.validated_data["registration_start_date"],
                start_date=params.validated_data["start_date"],
                start_time=params.validated_data["start_time"],
                is_entry_free=params.validated_data["is_entry_free"],
                prize_pool_enabled=params.validated_data["prize_pool_enabled"],
                open_classification=params.validated_data["open_classification"],
                size=params.validated_data["size"],
                team_size=params.validated_data["team_size"],
                prizes=params.validated_data["prizes"],
                map=params.validated_data["map"],
                terms=params.validated_data["terms"],
                entry_fee=params.validated_data.get("entry_fee"),
                feature_image=params.validated_data.get("feature_image"),
            ),
        )

        serializer = self.serializer_class(instance=tournament)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.organizer != request.user:
            return Response(
                {"error": "You are not authorized to perform this action"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def start(self, request, *args, **kwargs):
        try:
            uc = StartTournamentUseCase()
            tournament = uc.execute(StartTournamentUseCaseParams(id=kwargs["id"]))
            serializer = self.serializer_class(instance=tournament)
            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

    @action(detail=True, methods=["get"])
    def registered_teams(self, request, *args, **kwargs):
        tournament = self.get_object()
        if tournament.organizer != request.user:
            return Response(
                {"error": "You are not authorized to perform this action"},
                status=status.HTTP_403_FORBIDDEN,
            )

        registrations = Registration.objects.filter(tournament=tournament)
        teams = [registration.team for registration in registrations]
        serializer = TeamSerializer(teams, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["get"])
    def registrations(self, request, *args, **kwargs):
        tournament = self.get_object()
        if tournament.organizer != request.user:
            return Response(
                {"error": "You are not authorized to perform this action"},
                status=status.HTTP_403_FORBIDDEN,
            )

        registrations = Registration.objects.filter(tournament=tournament)
        serializer = RegistrationSerializer(registrations, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def start_match(self, request, *args, **kwargs):
        params = StartMatchParams(
            data={
                "tournament_id": kwargs.get("id"),
                "match_id": kwargs.get("match_id"),
                "user_id": request.user.id,
            }
        )
        params.is_valid(raise_exception=True)
        uc = StartMatchUseCase()
        match = uc.execute(StartMatchInput(**params.validated_data))
        serializer = MatchSerializer(instance=match)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def end_match(self, request, *args, **kwargs):
        params = FinishMatchParams(
            data={
                "tournament_id": kwargs.get("id"),
                "match_id": kwargs.get("match_id"),
                "user_id": request.user.id,
            }
        )
        params.is_valid(raise_exception=True)
        match = EndMatchUseCase().execute(EndMatchInput(**params.validated_data))
        serializer = MatchSerializer(instance=match)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def matches(self, request, *args, **kwargs):
        tournament = self.get_object()
        matches = Match.objects.filter(tournament=tournament, round=tournament.current_round)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def end_round(self, request, *args, **kwargs):
        tournament: Tournament = self.get_object()
        if tournament.organizer != request.user:
            return Response(
                {"error": "You are not authorized to perform this action"},
                status=status.HTTP_403_FORBIDDEN,
            )

        ended_matches_count = tournament.matches.filter(
            round=tournament.current_round, status=Match.StatusType.ENDED
        ).count()
        all_matches_count = tournament.matches.filter(round=tournament.current_round).count()

        if ended_matches_count != all_matches_count:
            return Response(
                {"error": "Not all matches have ended yet"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tournament.current_round += 1
        tournament.save()

        return Response({"success": True}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["patch"])
    def end_tournament(self, request, *args, **kwargs):
        params = EndTournamentParams(
            data={"user_id": request.user.id, "tournament_id": kwargs.get("id")}
        )
        params.is_valid(raise_exception=True)

        tournament = EndTournamentUseCase().execute(EndTournamentInput(**params.validated_data))
        serializer = self.serializer_class(instance=tournament)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def results(self, request, *args, **kwargs):
        tournament = self.get_object()
        prizes = tournament.prizes.all().count()
        ranks = tournament.ranks.all()[:prizes]
        serializer = StandingSerializer(ranks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_queryset(self):
        game, _ = extract_game_and_platform(self.kwargs)
        if game == LeagueOfLegendsTournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.filter(organizer=self.request.user)

        return super().get_queryset()


class OrganizerMatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "id"


class OrganizerRegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    lookup_field = "id"


class TournamentRegistrationViewSet(viewsets.ModelViewSet):
    """
    Manage registrations for a tournament
    """

    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    @action(detail=True, methods=["post"])
    @transaction.atomic
    def register(self, request, **kwargs):
        params = RegisterSerializer(data=request.data)
        params.is_valid(raise_exception=True)
        uc = RegisterUseCase()
        uc.execute(
            RegisterParams(**{**params.validated_data, "tournament_id": kwargs["id"]}),
        )

        return Response({"message": "success"}, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        tournament = Tournament.objects.get(id=kwargs["id"])
        self.queryset = self.queryset.filter(
            tournament=tournament,
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


class RegistrationViewSet(viewsets.ModelViewSet):
    """
    Manage registrations for a logged user
    """

    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        gameids = GameID.objects.filter(user=self.request.user).values_list("id", flat=True)
        teams = Team.objects.filter(members__in=gameids).values_list("id", flat=True)
        return super().get_queryset().filter(team__in=teams)


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
            if not Member.objects.filter(game_id=request.user.game_id).exists():
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
def participant_checked_in(request, *args, **kwargs):
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
            TournamentSerializer(tournaments, many=True).data,
            status=status.HTTP_200_OK,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
@swagger_auto_schema(
    operation_description="POST /api/v1/tournaments/[tournamentId]/register-team",
    operation_summary="Register a team into tournament",
)
def register_team(request, id):
    params = RegisterTeamIntoTournamentParams(data={**request.data, "tournament_id": id})
    params.is_valid(raise_exception=True)

    uc = RegisterTeamIntoTournamentUseCase()

    output = uc.execute(RegisterTeamIntoTournamentInput(**params.validated_data))

    return Response(TeamSerializer(output.team).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def create_and_register_team(request, id):
    params = CreateAndRegisterTeamIntoTournamentParams(
        data={**request.data, "user_id": request.user.id, "tournament_id": id}
    )
    params.is_valid(raise_exception=True)

    uc = CreateAndRegisterTeamIntoTournamentUseCase()

    output = uc.execute(CreateAndRegisterTeamIntoTournamentInput(**params.validated_data))

    return Response(TeamSerializer(output.team).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def check_in_tournament(request, id):
    params = CheckInTournamentParams(data={"organizer_id": request.user.id, "tournament_id": id})
    params.is_valid(raise_exception=True)

    CheckInTournamentUseCase().execute(CheckInTournamentInput(**params.validated_data))

    return Response(None, status=status.HTTP_204_NO_CONTENT)
