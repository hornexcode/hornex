from rest_framework import filters


class TournamentListFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        game = request.query_params.get("game")
        platform = request.query_params.get("platform")

        if game:
            queryset = queryset.filter(game=game)
        if platform:
            queryset = queryset.filter(platform=platform)

        return queryset


class TournamentListOrdering(filters.OrderingFilter):
    ordering_fields = "__all__"
