from datetime import timedelta as td
from test.factories import (
    # LeagueOfLegendsAccountFactory,
    LeagueOfLegendsTournamentFactory,
    TeamFactory,
    UserFactory,
)

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.leagueoflegends.models import (
    Classification,
    Tournament,
)
from apps.teams.models import Membership
from apps.tournaments import errors
from apps.tournaments.models import Registration


class TestLeagueOfLegendsTournament(APITestCase):
    def setUp(self) -> None:
        self.user = UserFactory.new()

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

    def test_register_register_201_success(self):
        team = TeamFactory.new(created_by=self.user)
        classification = Classification.objects.create(
            tier=Classification.Tier.BRONZE, rank=Classification.Rank.I
        )
        Membership.objects.create(team=team, user=self.user)
        # LeagueOfLegendsAccountFactory.new(user=self.user, classification=classification)
        for _ in range(0, 4):
            usr = UserFactory.new()
            # LeagueOfLegendsAccountFactory.new(user=usr, classification=classification)
            Membership.objects.create(team=team, user=usr)

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, classification=classification
        )

        url = reverse(
            "tournament-register",
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
        classification = Classification.objects.create(
            tier=Classification.Tier.BRONZE, rank=Classification.Rank.I
        )
        tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, classification=classification
        )

        url = reverse(
            "tournament-register",
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
        classification = Classification.objects.create(
            tier=Classification.Tier.BRONZE, rank=Classification.Rank.I
        )
        # LeagueOfLegendsAccountFactory.new(user=self.user, classification=classification)
        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, classification=classification, team_size=1, max_teams=1
        )

        url = reverse(
            "tournament-register",
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

        self.assertEqual(resp.status_code, 201)

        # -
        user_b = UserFactory.new()
        team_b = TeamFactory.new(created_by=user_b)
        Membership.objects.create(team=team_b, user=user_b)
        # LeagueOfLegendsAccountFactory.new(user=user_b, classification=classification)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(user_b)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

        url = reverse(
            "tournament-register",
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

        # fake registration has expired in 2 hours
        regi = Registration.objects.first()
        regi.created_at = regi.created_at - td(hours=2, seconds=1)
        regi.save()

        resp = self.client.post(
            url,
            {"team": team_b.id},
        )

        self.assertEqual(resp.status_code, 201)

    def test_register_400_team_already_registered_error(self):
        team = TeamFactory.new(created_by=self.user)
        Membership.objects.create(team=team, user=self.user)
        classification = Classification.objects.create(
            tier=Classification.Tier.BRONZE, rank=Classification.Rank.I
        )
        # LeagueOfLegendsAccountFactory.new(user=self.user, classification=classification)
        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, classification=classification, team_size=1
        )

        url = reverse(
            "tournament-register",
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

        self.assertEqual(resp.status_code, 201)

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.TeamAlreadyRegisteredError)

    def test_register_400_team_member_is_not_allowed_to_registrate_error(
        self,
    ):
        team = TeamFactory.new(created_by=self.user)
        classification_gold = Classification.objects.create(
            tier=Classification.Tier.GOLD, rank=Classification.Rank.I
        )
        classification_bronze = Classification.objects.create(
            tier=Classification.Tier.BRONZE, rank=Classification.Rank.I
        )
        classification_silver = Classification.objects.create(
            tier=Classification.Tier.SILVER, rank=Classification.Rank.I
        )

        Membership.objects.create(team=team, user=self.user)
        # LeagueOfLegendsAccountFactory.new(
        #     user=self.user, classification=classification_gold
        # )
        for _ in range(0, 4):
            usr = UserFactory.new()
            # LeagueOfLegendsAccountFactory.new(
            #     user=usr, classification=classification_bronze
            # )
            Membership.objects.create(team=team, user=usr)

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user,
            classification=[classification_bronze, classification_silver],
        )

        url = reverse(
            "tournament-register",
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

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.TeamMemberIsNotAllowedToRegistrate)
