from rest_framework import filters


class TournamentListFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        gslug = request.query_params.get("game")
        pslug = request.query_params.get("platform")

        if gslug:
            queryset = queryset.filter(game__slug=gslug)
        if pslug:
            queryset = queryset.filter(game__platforms__slug=pslug)

        return queryset
