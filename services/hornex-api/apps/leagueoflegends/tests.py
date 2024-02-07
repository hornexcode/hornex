from test.factories import (
    # LeagueOfLegendsAccountFactory,
    GameIdFactory,
    LeagueOfLegendsTournamentFactory,
    TeamFactory,
    UserFactory,
)
from unittest.mock import patch

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.leagueoflegends.models import (
    LeagueEntry,
    Tournament,
)
from apps.teams.models import Membership
from apps.tournaments import errors
from apps.tournaments.models import Registration
from lib.riot.types import LeagueEntryDTO, SummonerDTO


class TestLeagueOfLegendsTournament(APITestCase):
    def setUp(self) -> None:
        self.user = UserFactory.new()

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

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
        Membership.objects.create(team=team, user=self.user)
        GameIdFactory.new(user=self.user)
        for _ in range(0, 4):
            usr = UserFactory.new()
            Membership.objects.create(team=team, user=usr)
            GameIdFactory.new(user=usr)

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, allowed_league_entries=allowed_league_entries
        )

        url = reverse(
            "tournaments:register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(Tournament.objects.count(), 1)
        self.assertEqual(Tournament.objects.count(), 1)

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
                "platform": "pc",
                "game": "league-of-legends",
                "id": tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.EnoughMembersError)

    def test_register_400_tournament_is_full_error(self):
        team = TeamFactory.new(created_by=self.user)
        Membership.objects.create(team=team, user=self.user)
        allowed_league_entries = LeagueEntry.objects.create(
            tier=LeagueEntry.TierOptions.BRONZE, rank=LeagueEntry.RankOptions.I
        )

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user,
            allowed_league_entries=allowed_league_entries,
            team_size=1,
            max_teams=1,
        )

        url = reverse(
            "tournaments:register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        Registration.objects.create(team=team, tournament=self.tournament)

        # -
        user_b = UserFactory.new()
        team_b = TeamFactory.new(created_by=user_b)
        Membership.objects.create(team=team_b, user=user_b)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(user_b)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

        url = reverse(
            "tournaments:register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team_b.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.TournamentFullError)

    def test_register_400_team_already_registered_error(self):
        team = TeamFactory.new(created_by=self.user)
        Membership.objects.create(team=team, user=self.user)
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
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        Registration.objects.create(team=team, tournament=self.tournament)

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.TeamAlreadyRegisteredError)

    @patch("lib.riot.client.Client.get_entries_by_summoner_id")
    @patch("lib.riot.client.Client.get_summoner_by_name")
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

        Membership.objects.create(team=team, user=self.user)
        GameIdFactory.new(user=self.user)

        for _ in range(0, 4):
            usr = UserFactory.new()

            Membership.objects.create(team=team, user=usr)
            GameIdFactory.new(user=usr)

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user,
            allowed_league_entries=[classification_silver],
        )

        url = reverse(
            "tournaments:register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        print(resp.json())

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.TeamMemberIsNotAllowedToRegistrate)
