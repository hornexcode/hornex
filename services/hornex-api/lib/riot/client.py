import os
from abc import ABC, abstractmethod

import requests
from django.conf import settings

from lib.logging import logger
from lib.riot.types import (
    AccessTokenDTO,
    AccountDTO,
    CreateTournamentCode,
    LeagueEntryDTO,
    LobbyEventV5DTOWrapper,
    PlatformRoutingType,
    RegionalRoutingType,
    RegionType,
    SummonerDTO,
    TournamentCodeV5DTO,
    TournamentGamesV5,
    UpdateTournamentCode,
)


class Clientable(ABC):
    @abstractmethod
    def register_tournament_provider(
        self,
        url: str,
        region: RegionType,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        """
        Register the tournament provider

        POST /lol/tournament/v5/providers
        {
            "url": "https://example.com",
            "region": "NA"
        }
        """
        raise NotImplementedError

    @abstractmethod
    def register_tournament(
        self,
        name: str,
        provider_id: int,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        """
        Register the tournament and returns its id

        POST /lol/tournament/v5/tournaments
        {
            "name": "Example Tournament",
            "providerId": 0
        }
        """
        raise NotImplementedError

    @abstractmethod
    def create_tournament_code(
        self,
        params: CreateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> list[str]:
        """
        Returns tournament codes

        POST /lol/tournament/v4/codes
        {
            "allowedSummonerIds": [
                "string-puuid"
            ],
            "metadata": "",
            "teamSize": 0
            "pickType": "",
            "mapType": "",
            "spectatorType": "",
            "enoughPlayers: true,
        }
        """
        raise NotImplementedError

    @abstractmethod
    def get_tournament_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> TournamentCodeV5DTO:
        """
        Returns the tournament code DTO associated with a tournament code string

        GET /lol/tournament/v5/codes/{tournamentCode}
        """
        raise NotImplementedError

    @abstractmethod
    def update_tournament_code(
        self,
        params: UpdateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> None:
        """
        Update the pick type, map, spectator type, or allowed puuids for a code.

        PUT /lol/tournament/v5/codes/{tournamentCode}
        {
            "allowedSummonerIds": [
                "string-puuid"
            ],
            "pickType": "",
            "mapType": "",
            "spectatorType": "",
        }
        """
        raise NotImplementedError

    @abstractmethod
    def get_games_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> list[TournamentGamesV5]:
        """
        Get games details

        GET /lol/tournament/v5/games/by-code/{tournamentCode}

        IMPLEMENTATION NOTES
        """
        raise NotImplementedError

    @abstractmethod
    def get_lobby_events_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> LobbyEventV5DTOWrapper:
        """
        Gets a list of lobby events by tournament code.

        GET /lol/tournament/v5/lobby-events/by-code/{tournamentCode}
        """
        raise NotImplementedError

    @abstractmethod
    def get_entries_by_summoner_id(
        self,
        tournamentCode: str,
        platform_routing: PlatformRoutingType = PlatformRoutingType.BR1,
    ) -> LobbyEventV5DTOWrapper:
        """
        Get league entries in all queues for a given summoner ID.

        GET /lol/league/v4/entries/by-summoner/{encryptedSummonerId}
        """
        raise NotImplementedError


class Client(Clientable):
    def __init__(self):
        self.api_key = os.getenv("RIOT_API_KEY", "")

    def register_tournament_provider(
        self,
        url: str,
        region: RegionType,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        endpoint = (
            f"https://{regional_routing.value}/lol/tournament/v5/providers?api_key={self.api_key}"
        )
        response = requests.post(endpoint, json={"url": url, "region": region.value})

        if response.status_code != 200:
            logger.warning("Error registering tournament provider", response.json())
            raise Exception("Error registering tournament provider", response.json())

        return response.json()

    def register_tournament(
        self,
        name: str,
        provider_id: int,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        endpoint = (
            f"https://{regional_routing.value}/lol/tournament/v5/tournaments?api_key={self.api_key}"
        )
        response = requests.post(endpoint, json={"name": name, "providerId": provider_id})

        if response.status_code != 200:
            logger.warning("Error registering tournament", response.json())
            raise Exception("Error registering tournament", response.json())

        return response.json()

    def create_tournament_code(
        self,
        params: CreateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> list[str]:
        url = f"https://{regional_routing.value}/lol/tournament/v5/codes?api_key={self.api_key}&tournamentId={params.tournament_id}&count={params.count}"

        response = requests.post(
            url,
            json={
                "allowedParticipants": params.allowedParticipants,
                "metadata": params.metadata,
                "teamSize": params.teamSize,
                "pickType": params.pickType.value,
                "mapType": params.mapType.value,
                "spectatorType": params.spectatorType.value,
                "enoughPlayers": params.enoughPlayers,
            },
        )

        if response.status_code != 200:
            logger.warning("Error creating tournament code", response.json())
            raise Exception("Error creating tournament code", response.json())

        return response.json()

    def get_tournament_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> TournamentCodeV5DTO:
        url = f"https://{regional_routing.value}/lol/tournament/v5/codes/{tournamentCode}?api_key={self.api_key}"
        response = requests.get(url)

        if response.status_code != 200:
            logger.warning("Error retrieving tournament code DTO", response.json())
            raise Exception("Error retrieving tournament code DTO", response.json())

        data = response.json()

        tournamentCodeDTO = TournamentCodeV5DTO.from_api_response(data)

        return tournamentCodeDTO

    def update_tournament_code(
        self,
        params: UpdateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> None:
        url = f"https://{regional_routing.value}/lol/tournament/v5/codes/{params.tournamentCode}?api_key={self.api_key}"

        response = requests.put(
            url,
            json={
                "allowedParticipants": params.allowedParticipants,
                "mapType": params.mapType.value,
                "pickType": params.pickType.value,
                "spectatorType": params.spectatorType.value,
            },
        )

        if response.status_code != 200:
            logger.warning("Error updating tournament code", response.json())
            raise Exception("Error updating tournament code", response.json())

        return response.json()

    def get_games_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> list[TournamentGamesV5]:
        url = f"https://{regional_routing.value}/lol/tournament/v5/games/by-code/{tournamentCode}?api_key={self.api_key}"
        response = requests.get(url)

        if response.status_code != 200:
            logger.warning("Error retrieving games", response.json())
            raise Exception("Error retrieving games", response.json())

        data = response.json()

        tournament_games: list[TournamentGamesV5] = []
        for tournament_game in data:
            tournament_games.append(TournamentGamesV5.from_api_response(tournament_game))

        return tournament_games

    def get_lobby_events_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> LobbyEventV5DTOWrapper:
        url = f"https://{regional_routing.value}/lol/tournament/v5/lobby-events/by-code/{tournamentCode}?api_key={self.api_key}"
        response = requests.get(url)

        if response.status_code != 200:
            logger.warning("Error retrieving lobby events", response.json())
            raise Exception("Error retrieving lobby events", response.json())

        data = response.json()

        lobby_events = LobbyEventV5DTOWrapper.from_api_response(data)

        return lobby_events

    def get_entries_by_summoner_id(
        self,
        encryptedSummonerId: str,
        platform_routing: PlatformRoutingType = PlatformRoutingType.BR1,
    ) -> list[LeagueEntryDTO]:
        url = f"https://{platform_routing.value}.api.riotgames.com/lol/league/v4/entries/by-summoner/{encryptedSummonerId}?api_key={self.api_key}"
        response = requests.get(url)

        if response.status_code != 200:
            logger.warning("Error retrieving entries", response.json())
            raise Exception("Error retrieving entries", response.json())

        data = response.json()

        league_entries = LeagueEntryDTO.from_api_response_list(data)

        return league_entries

    def get_summoner_by_name(self, summoner_name: str) -> SummonerDTO | None:
        url = f"https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}?api_key={self.api_key}"

        try:
            resp = requests.get(url)
            if not resp.ok:
                return None

            data = resp.json()

            summoner = SummonerDTO(
                id=data["id"],
                account_id=data["accountId"],
                puuid=data["puuid"],
                name=data["name"],
            )
            return summoner
        except Exception as e:
            raise Exception("Error parsing summoner") from e

    def get_summoner_entries_by_summoner_id(self, id: str) -> list[LeagueEntryDTO]:
        url = f"https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/{id}?api_key={self.api_key}"
        resp = requests.get(url)

        if resp.status_code != 200:
            logger.warning("Error retrieving summoner entries", resp.json())
            raise Exception("Error retrieving summoner entries", resp.json())

        data = resp.json()

        league_entries = LeagueEntryDTO.from_api_response_list(data)

        return league_entries

    def get_oauth_token(self, access_code: str):
        client_id = os.getenv("RIOT_RSO_CLIENT_ID", "")
        client_secret = os.getenv("RIOT_RSO_CLIENT_SECRET", "")
        app_url = os.getenv("APP_URL", "")
        appCallbackUrl = f"{app_url}/oauth/riot/login"
        provider = "https://auth.riotgames.com"
        tokenUrl = provider + "/token"
        form = {
            "grant_type": "authorization_code",
            "code": access_code,
            "redirect_uri": appCallbackUrl,
        }

        resp = requests.post(
            tokenUrl,
            data=form,
            auth=(client_id, client_secret),
        )
        if not resp.ok:
            return None
        return AccessTokenDTO(**resp.json())

    def get_account_me(self, access_token: str):
        # TODO: implement riot get account client method
        resp = requests.get(
            "https://americas.api.riotgames.com/riot/account/v1/accounts/me",
            headers={"Authorization": "Bearer " + access_token},
        )
        if not resp.ok:
            # add logger
            return None

        data = resp.json()
        return AccountDTO(
            puuid=data["puuid"],
            game_name=data["gameName"],
            tag_line=data["tagLine"],
        )


class InMemoryClient(Clientable):
    def register_tournament_provider(
        self,
        url: str,
        region: RegionType,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        return 0

    def register_tournament(
        self,
        name: str,
        provider_id: int,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        return 0

    def create_tournament_code(
        self,
        params: CreateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> list[str]:
        return []

    def get_tournament_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> TournamentCodeV5DTO:
        return TournamentCodeV5DTO()

    def update_tournament_code(
        self,
        params: UpdateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> None:
        pass

    def get_games_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> list[TournamentGamesV5]:
        return []

    def get_lobby_events_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> LobbyEventV5DTOWrapper:
        return LobbyEventV5DTOWrapper()

    def get_entries_by_summoner_id(
        self,
        tournamentCode: str,
        platform_routing: PlatformRoutingType = PlatformRoutingType.BR1,
    ) -> LobbyEventV5DTOWrapper:
        return LobbyEventV5DTOWrapper()


client = Client() if not settings.TESTING else InMemoryClient()
