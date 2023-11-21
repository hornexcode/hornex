from django.test import TestCase


class ClientTest(TestCase):
    def setUp(self):
        pass


# This will be transformed in real tests using mocked responses
# shell testing scripts

from lib.riot.client import (
    Client,
    RegionalRoutingType,
    CreateTournamentCode,
    MapType,
    SpectatorType,
    PickType,
)

riot = Client()

# 1

data = riot.register_tournament_provider("https://www.hornex.gg/", "BR")

# 2

data = riot.register_tournament("Tournament Name", 1, RegionalRoutingType.AMERICAS)

# 3
data = riot.create_tournament_code(
    CreateTournamentCode(
        tournament_id=data,
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


data = riot.get_tournament_code(data[0])
