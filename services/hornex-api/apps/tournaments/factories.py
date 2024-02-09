from apps.leagueoflegends.models import Tournament as LeagueOfLegendsTournament
from apps.tournaments.models import Tournament


def tournament_factory(game: str) -> "Tournament":
    if game == "league-of-legends":
        return LeagueOfLegendsTournament
    return Tournament
