from test.factories import (
    GameIdFactory,
    LeagueOfLegendsTournamentFactory,
    TeamFactory,
    UserFactory,
)
from unittest.mock import patch

import faker
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.leagueoflegends.models import (
    LeagueEntry,
    Tournament,
)
from apps.tournaments import errors
from apps.tournaments.models import Registration
from lib.riot.types import LeagueEntryDTO, SummonerDTO

fake = faker.Faker()


class TestLeagueOfLegendsTournaments(APITestCase):
    def setUp(self) -> None:
        self.user = UserFactory.new()

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

    @patch("lib.riot.client.Client.get_entries_by_summoner_id")
    @patch("lib.riot.client.Client.get_summoner_by_name")
    def test_register_register_201_success(
        self, mock_get_summoner_by_name, mock_get_league_entries
    ):
        mock_get_summoner_by_name.return_value = SummonerDTO(
            id="id",
            account_id="account_id",
            puuid="puuid",
            name="name",
        )
        mock_get_league_entries.return_value = [
            LeagueEntryDTO(
                leagueId="leagueId",
                summonerId="summonerId",
                summonerName="summonerName",
                queueType="queueType",
                tier="BRONZE",
                rank="I",
                leaguePoints=1,
                wins=1,
                losses=1,
                hotStreak=True,
                veteran=True,
                freshBlood=True,
                inactive=True,
            )
        ]

        team = TeamFactory.new(created_by=self.user)
        allowed_league_entries = LeagueEntry.objects.create(
            tier=LeagueEntry.TierOptions.BRONZE, rank=LeagueEntry.RankOptions.I
        )
        GameIdFactory.new(user=self.user)
        team.add_member(self.user)
        for _ in range(0, 4):
            usr = UserFactory.new()
            team.add_member(usr)
            GameIdFactory.new(user=usr)

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, allowed_league_entries=allowed_league_entries
        )

        url = reverse(
            "tournaments:register",
            kwargs={
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {
                "team": team.id,
                "platform": "pc",
                "game": "league-of-legends",
            },
        )

        self.assertEqual(Tournament.objects.count(), 1)
        self.assertEqual(Tournament.objects.count(), 1)

        print(resp.json())
        # response checks
        self.assertEqual(resp.status_code, 201)

        # database checks
        self.assertEqual(Registration.objects.count(), 1)

        regi = Registration.objects.first()
        self.assertEqual(regi.status, Registration.RegistrationStatusType.PENDING)

    def test_register_400_do_not_has_enough_members_error(self):
        team = TeamFactory.new(created_by=self.user)
        allowed_league_entries = LeagueEntry.objects.create(
            tier=LeagueEntry.TierOptions.BRONZE, rank=LeagueEntry.RankOptions.I
        )
        tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, allowed_league_entries=allowed_league_entries
        )

        url = reverse(
            "tournaments:register",
            kwargs={
                "id": tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {
                "team": team.id,
                "platform": "pc",
                "game": "league-of-legends",
            },
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json()["detail"], errors.EnoughMembersError)

    def test_register_400_tournament_is_full_error(self):
        team = TeamFactory.new(created_by=self.user)
        team.add_member(self.user)
        allowed_league_entries = LeagueEntry.objects.create(
            tier=LeagueEntry.TierOptions.BRONZE, rank=LeagueEntry.RankOptions.I
        )

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user,
            allowed_league_entries=allowed_league_entries,
            team_size=1,
            max_teams=1,
        )

        Registration.objects.create(team=team, tournament=self.tournament)

        # -
        user_b = UserFactory.new()
        team_b = TeamFactory.new(created_by=user_b)
        team_b.add_member(user_b)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(user_b)

        # Authenticate the client with the token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

        url = reverse(
            "tournaments:register",
            kwargs={
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {
                "team": team_b.id,
                "platform": "pc",
                "game": "league-of-legends",
            },
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json()["detail"], errors.TournamentFullError)

    def test_register_400_team_already_registered_error(self):
        team = TeamFactory.new(created_by=self.user)
        team.add_member(self.user)
        allowed_league_entries = LeagueEntry.objects.create(
            tier=LeagueEntry.TierOptions.BRONZE, rank=LeagueEntry.RankOptions.I
        )
        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user,
            allowed_league_entries=allowed_league_entries,
            team_size=1,
        )

        url = reverse(
            "tournaments:register",
            kwargs={
                "id": self.tournament.id.__str__(),
            },
        )

        Registration.objects.create(team=team, tournament=self.tournament)

        resp = self.client.post(
            url,
            {
                "team": team.id,
                "platform": "pc",
                "game": "league-of-legends",
            },
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json()["detail"], errors.TeamAlreadyRegisteredError)

    @patch("lib.riot.client.InMemoryClient.get_entries_by_summoner_id")
    @patch("lib.riot.client.InMemoryClient.get_summoner_by_name")
    def test_register_400_team_member_is_not_allowed_to_registrate_error(
        self, mock_get_summoner_by_name, mock_get_league_entries
    ):
        mock_get_summoner_by_name.return_value = SummonerDTO(
            id="id",
            account_id="account_id",
            puuid="puuid",
            name="name",
        )
        mock_get_league_entries.return_value = [
            LeagueEntryDTO(
                leagueId="leagueId",
                summonerId="summonerId",
                summonerName="summonerName",
                queueType="queueType",
                tier="BRONZE",
                rank="I",
                leaguePoints=1,
                wins=1,
                losses=1,
                hotStreak=True,
                veteran=True,
                freshBlood=True,
                inactive=True,
            )
        ]
        team = TeamFactory.new(created_by=self.user)

        classification_silver = LeagueEntry.objects.create(
            tier=LeagueEntry.TierOptions.SILVER, rank=LeagueEntry.RankOptions.I
        )

        team.add_member(self.user)
        GameIdFactory.new(user=self.user)

        for _ in range(0, 4):
            usr = UserFactory.new()

            team.add_member(usr)
            GameIdFactory.new(user=usr)

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user,
            allowed_league_entries=[classification_silver],
        )

        url = reverse(
            "tournaments:register",
            kwargs={
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {
                "team": team.id,
                "platform": "pc",
                "game": "league-of-legends",
            },
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.json()["detail"], errors.TeamMemberIsNotAllowedToRegistrate)
