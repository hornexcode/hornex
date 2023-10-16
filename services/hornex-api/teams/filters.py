from rest_framework import filters


class TeamFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        user = request.user if request.user else None

        if user:
            queryset = queryset.filter(teammember__user_id=user.id)

        gslug = request.query_params.get("game")
        pslug = request.query_params.get("platform")

        queryset = queryset.filter(game__slug=gslug, platform__slug=pslug)

        return queryset
