from apps.tournaments.models import LeagueOfLegendsTournament, Tournament


def tournament_factory(game: str) -> "Tournament":
    if game == "league-of-legends":
        return LeagueOfLegendsTournament
    return Tournament
