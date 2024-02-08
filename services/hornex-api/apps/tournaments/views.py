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

from apps.leagueoflegends.models import Tournament as LeagueOfLegendsTournament
from apps.leagueoflegends.serializers import (
    LeagueOfLegendsTournamentSerializer,
)
from apps.leagueoflegends.tasks import participant_registered
from apps.teams.models import Membership, Team
from apps.tournaments import errors
from apps.tournaments.filters import TournamentListFilter, TournamentListOrdering
from apps.tournaments.models import Checkin, Registration, Tournament
from apps.tournaments.models import Tournament as BaseTournament
from apps.tournaments.pagination import TournamentPagination
from apps.tournaments.serializers import (
    RegistrationCreateSerializer,
    RegistrationReadSerializer,
    TournamentSerializer,
)
from apps.tournaments.usecases.create_registration import (
    CreateRegistrationUseCase,
    CreateRegistrationUseCaseParams,
)
from core.route import extract_game_and_platform
from jwt_token.authentication import JWTAuthentication

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
        # game = kwargs.get("game")

        # league of legends
        self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().get_object()

    def retrieve(self, request, *args, **kwargs):
        game, _ = extract_game_and_platform(kwargs)

        if game == LeagueOfLegendsTournament.GameType.LEAGUE_OF_LEGENDS:
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().retrieve(request, *args, **kwargs)

    def construct_object(self) -> BaseTournament:
        """
        Returns the tournament object based on the game type
        """
        obj = self.get_object()
        if obj.game == BaseTournament.GameType.LEAGUE_OF_LEGENDS:
            return LeagueOfLegendsTournament.objects.get(id=obj.id)
        return obj


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def team_check_in_status(request, *args, **kwargs):
    if request.method == "GET":
        try:
            tournament = Tournament.objects.get(id=kwargs["tournament"])
            team = Team.objects.get(id=kwargs["team"])

            # check if user belongs to team
            if not Membership.objects.filter(user=request.user, team=team).exists():
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

        return Response(
            {"message": "Checkin successful"},
            status=status.HTTP_200_OK,
        )


class TournamentRegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationReadSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        print(self.request.user)
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

        return Response(
            RegistrationReadSerializer(registration).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["post"],
    )
    def registration(self, request):
        uc = CreateRegistrationUseCase()

        registration = uc.execute(CreateRegistrationUseCaseParams(**request.data))

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
