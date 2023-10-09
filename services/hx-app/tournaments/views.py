from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


from tournaments.models import Registration, Tournament
from tournaments.filters import TournamentListFilter, TournamentListOrdering
from tournaments.serializers import (
    RegistrationSerializer,
    LeagueOfLegendsTournamentSerializer,
    TournamentSerializer,
)
from tournaments.pagination import TournamentPagination
from tournaments.leagueoflegends.models import LeagueOfLegendsTournament


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
        print("here here here")
        if request.query_params.get("game") == "league-of-legends":
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().list(request, *args, **kwargs)


class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        if kwargs.get("game") == "league-of-legends":
            self.queryset = LeagueOfLegendsTournament.objects.all()

        return super().retrieve(request, *args, **kwargs)


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
