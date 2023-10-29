def extract_game_and_platform(kwargs):
    game = kwargs.get("game")
    platform = kwargs.get("platform")
    return game, platform


def extract_game_and_platform_from_query_params(request):
    game = request.query_params.get("game")
    platform = request.query_params.get("platform")
    return game, platform
