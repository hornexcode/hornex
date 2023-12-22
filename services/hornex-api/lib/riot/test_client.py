from requests import Response
from django.test import TestCase
from unittest.mock import patch, Mock

from lib.riot.client import Client
from lib.riot.types import (
    RegionalRoutingType,
    CreateTournamentCode,
    MapType,
    SpectatorType,
    PickType,
    RegionType,
    UpdateTournamentCode,
)


class ClientTest(TestCase):
    def setUp(self):
        self.riot = Client()

    @patch("requests.post")
    def test_register_tournament_provider_200(self, mock_post):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 200
        mock_response.json.return_value = 7

        mock_post.return_value = mock_response

        providerId = self.riot.register_tournament_provider(
            "https://www.hornex.gg/", RegionType.BR
        )

        self.assertEqual(providerId, 7)

    @patch("requests.post")
    def test_register_tournament_provider_500(self, mock_post):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 500

        mock_post.return_value = mock_response

        try:
            self.riot.register_tournament_provider(
                "https://www.hornex.gg/", RegionType.BR
            )
        except Exception as e:
            msg, json = e.args
            self.assertRaises(Exception)
            self.assertEqual(msg, "Error registering tournament provider")

    @patch("requests.post")
    def test_register_tournament_200(self, mock_post):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 200
        mock_response.json.return_value = 8

        mock_post.return_value = mock_response

        tournamentId = self.riot.register_tournament(
            "Tournament Name", 7, RegionalRoutingType.AMERICAS
        )

        self.assertEqual(tournamentId, 8)

    @patch("requests.post")
    def test_register_tournament_500(self, mock_post):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 500

        mock_post.return_value = mock_response

        try:
            self.riot.register_tournament("Tournament Name", 2)
        except Exception as e:
            msg, json = e.args
            self.assertRaises(Exception)
            self.assertEqual(msg, "Error registering tournament")

    @patch("requests.post")
    def test_create_tournament_code_200(self, mock_post):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 200
        mock_response.json.return_value = ["fake-tournament-code-123"]

        mock_post.return_value = mock_response

        data = self.riot.create_tournament_code(
            CreateTournamentCode(
                tournament_id=7,
                count=1,
                allowedParticipants=[
                    "OxC7Ddyh8gdhnc24FbEaS3UbCCvEvdneOiKpzLeBADyY_aHvkRvt8ZL0e5sfZaoLaJUN0TmmsgvuRA"
                ],
                metadata="test",
                teamSize=5,
                mapType=MapType.SUMMONERS_RIFT,
                pickType=PickType.BLIND_PICK,
                spectatorType=SpectatorType.LOBBYONLY,
                enoughPlayers=True,
            ),
            RegionalRoutingType.AMERICAS,
        )

        self.assertIsNotNone(data[0])

    @patch("requests.post")
    def test_create_tournament_code_500(self, mock_post):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 500

        mock_post.return_value = mock_response

        try:
            self.riot.create_tournament_code(
                CreateTournamentCode(
                    tournament_id=7,
                    count=1,
                    allowedParticipants=[
                        "OxC7Ddyh8gdhnc24FbEaS3UbCCvEvdneOiKpzLeBADyY_aHvkRvt8ZL0e5sfZaoLaJUN0TmmsgvuRA"
                    ],
                    metadata="test",
                    teamSize=5,
                    mapType=MapType.SUMMONERS_RIFT,
                    pickType=PickType.BLIND_PICK,
                    spectatorType=SpectatorType.LOBBYONLY,
                    enoughPlayers=True,
                ),
                RegionalRoutingType.AMERICAS,
            )
        except Exception as e:
            msg, json = e.args
            self.assertRaises(Exception)
            self.assertEqual(msg, "Error creating tournament code")

    @patch("requests.get")
    def test_get_tournament_code_200(self, mock_get):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "code": "test-tournament-code-123",
            "spectators": None,
            "lobbyName": "STUB_LOBBY",
            "metaData": "metadata",
            "password": "f0e70ea8925b9f1296905fd21c55ef",
            "teamSize": 5,
            "providerId": 1,
            "pickType": "DRAFT_MODE",
            "tournamentId": 2,
            "id": 0,
            "region": "STUB",
            "map": "SUMMONERS_RIFT",
            "participants": [None],
        }

        mock_get.return_value = mock_response

        data = self.riot.get_tournament_code("test-tournament-code-123")
        self.assertIsNotNone(data)
        self.assertEqual(data.teamSize, 5)

    @patch("requests.get")
    def test_get_tournament_code_500(self, mock_get):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 500

        mock_get.return_value = mock_response

        try:
            self.riot.get_tournament_code("test-tournament-code-123")
        except Exception as e:
            msg, json = e.args
            self.assertRaises(Exception)
            self.assertEqual(msg, "Error retrieving tournament code DTO")

    @patch("requests.put")
    def test_update_tournament_code_200(self, mock_put):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 200
        mock_response.json.return_value = None

        mock_put.return_value = mock_response

        data = self.riot.update_tournament_code(
            UpdateTournamentCode(
                tournamentCode="test-tournament-code-123",
                allowedParticipants=[
                    "OxC7Ddyh8gdhnc24FbEaS3UbCCvEvdneOiKpzLeBADyY_aHvkRvt8ZL0e5sfZaoLaJUN0TmmsgvuRA"
                ],
                mapType=MapType.HOWLING_ABYSS,
                pickType=PickType.ALL_RANDOM,
                spectatorType=SpectatorType.NONE,
            ),
            RegionalRoutingType.AMERICAS,
        )

        self.assertIsNone(data)

    @patch("requests.put")
    def test_update_tournament_code_500(self, mock_put):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 500

        mock_put.return_value = mock_response

        try:
            self.riot.update_tournament_code(
                UpdateTournamentCode(
                    tournamentCode="test-tournament-code-123",
                    allowedParticipants=[
                        "OxC7Ddyh8gdhnc24FbEaS3UbCCvEvdneOiKpzLeBADyY_aHvkRvt8ZL0e5sfZaoLaJUN0TmmsgvuRA"
                    ],
                    mapType=MapType.HOWLING_ABYSS,
                    pickType=PickType.ALL_RANDOM,
                    spectatorType=SpectatorType.NONE,
                ),
                RegionalRoutingType.AMERICAS,
            )
        except Exception as e:
            msg, json = e.args
            self.assertRaises(Exception)
            self.assertEqual(msg, "Error updating tournament code")

    @patch("requests.get")
    def test_get_games_by_code_200(self, mock_get):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 200
        mock_response.json.return_value = [
            {
                "winningTeam": [{"puuid": "fake-puuid"}],
                "losingTeam": [{"puuid": "fake-puuid"}],
                "shortCode": "fake-tournament-code",
                "metaData": "fake-metadata",
                "gameId": 1,
                "gameName": "fake-game-name",
                "gameType": "fake-game-type",
                "gameMap": "fake-game-map",
                "gameMode": "fake-game-mode",
                "region": "BR",
            },
            {
                "winningTeam": [{"puuid": "fake-puuid"}],
                "losingTeam": [{"puuid": "fake-puuid"}],
                "shortCode": "fake-tournament-code-2",
                "metaData": "fake-metadata-2",
                "gameId": 2,
                "gameName": "fake-game-name-2",
                "gameType": "fake-game-type-2",
                "gameMap": "fake-game-map-2",
                "gameMode": "fake-game-mode-2",
                "region": "BR-2",
            },
        ]

        mock_get.return_value = mock_response

        data = self.riot.get_games_by_code("test-tournament-code-123")
        self.assertIsNotNone(data)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0].gameId, 1)

    @patch("requests.get")
    def test_get_games_by_code_500(self, mock_get):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 500

        mock_get.return_value = mock_response

        try:
            self.riot.get_games_by_code("test-tournament-code-123")
        except Exception as e:
            msg, json = e.args
            self.assertRaises(Exception)
            self.assertEqual(msg, "Error retrieving games")

    @patch("requests.get")
    def test_get_lobby_events_by_code_200(self, mock_get):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "eventList": [
                {
                    "timestamp": "Wed Nov 22 13:55:55 UTC 2023",
                    "eventType": "PracticeGameCreatedEvent",
                    "puuid": None,
                },
                {
                    "timestamp": "Wed Nov 22 13:55:55 UTC 2023",
                    "eventType": "ChampSelectStartedEvent",
                    "puuid": None,
                },
                {
                    "timestamp": "Wed Nov 22 13:55:55 UTC 2023",
                    "eventType": "GameAllocationStartedEvent",
                    "puuid": None,
                },
            ]
        }

        mock_get.return_value = mock_response

        data = self.riot.get_lobby_events_by_code("fake-tournament-code-123")
        self.assertIsNotNone(data)
        self.assertEqual(len(data.eventList), 3)
        self.assertEqual(data.eventList[0].eventType, "PracticeGameCreatedEvent")

    @patch("requests.get")
    def test_get_lobby_events_by_code_500(self, mock_get):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 500

        mock_get.return_value = mock_response

        try:
            self.riot.get_lobby_events_by_code("test-tournament-code-123")
        except Exception as e:
            msg, json = e.args
            self.assertRaises(Exception)
            self.assertEqual(msg, "Error retrieving lobby events")
