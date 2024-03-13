import uuid
from test.factories import (
    GameIdFactory,
    LeagueOfLegendsSummonerFactory,
    LeagueOfLegendsTournamentFactory,
    MatchFactory,
    RegistrationFactory,
    TeamFactory,
    UserFactory,
)
from unittest.mock import patch

import faker
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.teams.models import Team
from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Match, Rank
from apps.users.models import User
from lib.challonge import Match as ChMatch
from lib.challonge import Participant

fake = faker.Faker()


class TestLeagueOfLegendsTournaments(APITestCase):
    def setUp(self) -> None:
        self.user = UserFactory.new()

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

        self.game_id = GameIdFactory.new(user=self.user)
        # @patch("lib.riot.client.Client.get_entries_by_summoner_id")
        # @patch("lib.riot.client.Client.get_summoner_by_name")
        # def test_register_201_success(self, mock_get_summoner_by_name, mock_get_league_entries):
        #     mock_get_summoner_by_name.return_value = SummonerDTO(
        #         id="id",
        #         account_id="account_id",
        #         puuid="puuid",
        #         name="name",
        #     )
        #     mock_get_league_entries.return_value = [
        #         LeagueOfLegendsLeagueDTO(
        #             leagueId="leagueId",
        #             summonerId="summonerId",
        #             summonerName="summonerName",
        #             queueType="queueType",
        #             tier="BRONZE",
        #             rank="I",
        #             leaguePoints=1,
        #             wins=1,
        #             losses=1,
        #             hotStreak=True,
        #             veteran=True,
        #             freshBlood=True,
        #             inactive=True,
        #         )
        #     ]

        #     team = TeamFactory.new(created_by=self.user)
        #     allowed_league_entries = LeagueOfLegendsLeague.objects.create(
        #         tier=LeagueOfLegendsLeague.TierOptions.BRONZE,
        # rank = LeagueOfLegendsLeague.RankOptions.I

    #     )
    #     GameIdFactory.new(user=self.user)
    #     team.add_member(self.user)
    #     for _ in range(0, 4):
    #         usr = UserFactory.new()
    #         team.add_member(usr)
    #         GameIdFactory.new(user=usr)

    #     self.tournament = LeagueOfLegendsTournamentFactory.new(
    #         organizer=self.user, classifications=allowed_league_entries
    #     )

    #     url = reverse(
    #         "tournaments:register",
    #         kwargs={
    #             "id": self.tournament.id.__str__(),
    #         },
    #     )

    #     resp = self.client.post(
    #         url,
    #         {
    #             "team": team.id,
    #             "platform": "pc",
    #             "game": "league-of-legends",
    #         },
    #     )

    #     self.assertEqual(Tournament.objects.count(), 1)

    #     print(resp.json())
    #     # response checks
    #     self.assertEqual(resp.status_code, 201)

    #     # database checks
    #     self.assertEqual(Registration.objects.count(), 1)

    #     regi = Registration.objects.first()
    #     self.assertEqual(regi.status, Registration.RegistrationStatusOptions.PENDING)

    # def test_register_team_invalid_email(self):
    #     team = TeamFactory.new(created_by=self.user)
    #     tournament = LeagueOfLegendsTournamentFactory.new(organizer=self.user)

    #     url = reverse(
    #         "tournaments:register",
    #         kwargs={
    #             "id": tournament.id.__str__(),
    #         },
    #     )

    #     users = [[game_id.email, game_id.nickname] for game_id in team.members.all()]
    #     users.append(["fake_email.com", "Denzel"])

    #     resp = self.client.post(
    #         url,
    #         {
    #             "team": team.id,
    #             "users": users,
    #         },
    #     )

    #     self.assertEqual(resp.status_code, 400)
    #     self.assertEqual(resp.json().get("error"), "One or more users has an invalid email.")

    # def test_register_team(self):
    #     team = TeamFactory.new(created_by=self.user)
    #     tournament = LeagueOfLegendsTournamentFactory.new(organizer=self.user)

    #     url = reverse(
    #         "tournaments:register",
    #         kwargs={
    #             "id": tournament.id.__str__(),
    #         },
    #     )

    #     resp = self.client.post(
    #         url,
    #         {
    #             "team": team.id,
    #             "users": [[game_id.email, game_id.nickname] for game_id in team.members.all()],
    #         },
    #     )

    #     self.assertEqual(resp.status_code, 201)


# def test_register_400_do_not_has_enough_members_error(self):
#     team = TeamFactory.new(created_by=self.user)
#     allowed_league_entries = LeagueOfLegendsLeague.objects.create(
#         tier=LeagueOfLegendsLeague.TierOptions.BRONZE, rank=LeagueOfLegendsLeague.RankOptions.I
#     )
#     tournament = LeagueOfLegendsTournamentFactory.new(
#         organizer=self.user, allowed_league_entries=[allowed_league_entries]
#     )

#     url = reverse(
#         "tournaments:register",
#         kwargs={
#             "id": tournament.id.__str__(),
#         },
#     )

#     resp = self.client.post(
#         url,
#         {
#             "team": team.id,
#             "platform": "pc",
#             "game": "league-of-legends",
#         },
#     )

#     self.assertEqual(resp.status_code, 400)
#     self.assertEqual(resp.json()["detail"], errors.EnoughMembersError)

# Need to comment
# def test_register_400_tournament_is_full_error(self):
#     team = TeamFactory.new(user=self.user)
#     team.add_member(self.game_id)
#     allowed_league_entries = LeagueOfLegendsLeague.objects.create(
#         tier=LeagueOfLegendsLeague.TierOptions.BRONZE, rank=LeagueOfLegendsLeague.RankOptions.I
#     )

#     self.tournament = LeagueOfLegendsTournamentFactory.new(
#         organizer=self.user,
#         allowed_league_entries=[allowed_league_entries],
#         team_size=1,
#         max_teams=1,
#     )

#     Registration.objects.create(team=team, tournament=self.tournament)

#     # -
#     user_b = UserFactory.new()
#     team_b = TeamFactory.new(created_by=user_b)
#     game_id_b = GameIdFactory.new(user=user_b)
#     team_b.add_member(game_id_b)

#     # Generating a JWT token for the test user
#     self.refresh = RefreshToken.for_user(user_b)

#     # Authenticate the client with the token
#     self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

#     url = reverse(
#         "tournaments:register",
#         kwargs={
#             "id": self.tournament.id.__str__(),
#         },
#     )

#     resp = self.client.post(
#         url,
#         {
#             "team": team_b.id,
#             "users": [[user.email, user.nickname] for user in team_b.members.all()],
#         },
#     )

#     self.assertEqual(resp.status_code, 400)
#     self.assertEqual(resp.json()["detail"], errors.TournamentFullError)

# def test_register_400_team_already_registered_error(self):
#     team = TeamFactory.new(created_by=self.user)
#     team.add_member(self.user)
#     allowed_league_entries = LeagueOfLegendsLeague.objects.create(
#         tier=LeagueOfLegendsLeague.TierOptions.BRONZE, rank=LeagueOfLegendsLeague.RankOptions.I
#     )
#     self.tournament = LeagueOfLegendsTournamentFactory.new(
#         organizer=self.user,
#         allowed_league_entries=[allowed_league_entries],
#         team_size=1,
#     )

#     url = reverse(
#         "tournaments:register",
#         kwargs={
#             "id": self.tournament.id.__str__(),
#         },
#     )

#     Registration.objects.create(team=team, tournament=self.tournament)

#     resp = self.client.post(
#         url,
#         {
#             "team": team.id,
#             "platform": "pc",
#             "game": "league-of-legends",
#         },
#     )

#     self.assertEqual(resp.status_code, 400)
#     self.assertEqual(resp.json()["detail"], errors.TeamAlreadyRegisteredError)

# @patch("lib.riot.client.InMemoryClient.get_entries_by_summoner_id")
# @patch("lib.riot.client.InMemoryClient.get_summoner_by_name")
# def test_register_400_team_member_is_not_allowed_to_registrate_error(
#     self, mock_get_summoner_by_name, mock_get_league_entries
# ):
#     mock_get_summoner_by_name.return_value = SummonerDTO(
#         id="id",
#         account_id="account_id",
#         puuid="puuid",
#         name="name",
#     )
#     mock_get_league_entries.return_value = [
#         LeagueOfLegendsLeagueDTO(
#             leagueId="leagueId",
#             summonerId="summonerId",
#             summonerName="summonerName",
#             queueType="queueType",
#             tier="BRONZE",
#             rank="I",
#             leaguePoints=1,
#             wins=1,
#             losses=1,
#             hotStreak=True,
#             veteran=True,
#             freshBlood=True,
#             inactive=True,
#         )
#     ]
#     team = TeamFactory.new(created_by=self.user)

#     classification_silver = LeagueOfLegendsLeague.objects.create(
#         tier=LeagueOfLegendsLeague.TierOptions.SILVER, rank=LeagueOfLegendsLeague.RankOptions.I # noqa: E501
#     )

#     team.add_member(self.user)
#     GameIdFactory.new(user=self.user)

#     for _ in range(0, 4):
#         usr = UserFactory.new()

#         team.add_member(usr)
#         GameIdFactory.new(user=usr)

#     self.tournament = LeagueOfLegendsTournamentFactory.new(
#         organizer=self.user,
#         allowed_league_entries=[classification_silver],
#     )

#     url = reverse(
#         "tournaments:register",
#         kwargs={
#             "id": self.tournament.id.__str__(),
#         },
#     )

#     resp = self.client.post(
#         url,
#         {
#             "team": team.id,
#             "platform": "pc",
#             "game": "league-of-legends",
#         },
#     )

#     self.assertEqual(resp.status_code, 400)
#     self.assertEqual(resp.json()["detail"], errors.TeamMemberIsNotAllowedToRegistrate)


class CreateAndRegisterTeamIntoTournamentTest(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("/tournaments", include("apps.tournaments.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.refresh = RefreshToken.for_user(self.user)

        self.game_id = GameIdFactory.new(user=self.user, email=self.user.email)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

        self.tournament = LeagueOfLegendsTournamentFactory.new(organizer=self.user)

    @patch("lib.challonge.Tournament.add_team")
    def test_create_and_register_team_into_tournament(self, mock_add_team):
        participant = Participant()
        participant.id = 123
        mock_add_team.return_value = participant

        self.tournament.challonge_tournament_id = 123
        self.tournament.save()
        self.tournament.refresh_from_db()

        users = [UserFactory.new() for i in range(4)]
        [GameIdFactory.new(user=user, email=user.email) for user in users]
        name = "Drakx"
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}

        url = reverse("tournaments:create_and_register_team", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {"name": name, **users_payload},
        )

        team = resp.json()

        mock_add_team.assert_called_once()
        self.assertIn(Team.objects.get(id=team.get("id")), self.tournament.registered_teams.all())

    def test_create_and_register_team_into_tournament_user_not_found_into_tournament(self):
        name = "Drakx"
        users = [UserFactory.new() for i in range(3)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        [GameIdFactory.new(user=user, email=user.email) for user in users]
        users_payload["member_4_email"] = "fake@email.com"

        url = reverse("tournaments:create_and_register_team", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {"name": name, **users_payload},
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(data.get("error"), "User not found for fake@email.com")

    def test_create_and_register_team_into_tournament_user_does_not_have_game_id_into_tournament(
        self,
    ):
        name = "Drakx"
        users = [UserFactory.new() for i in range(4)]
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}
        user = users.pop()
        [GameIdFactory.new(user=user, email=user.email) for user in users]

        url = reverse("tournaments:create_and_register_team", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {"name": name, **users_payload},
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            data.get("error"),
            f"User {user.email} does not connected its account with League Of Legends",
        )

    @patch("lib.challonge.Tournament.add_team")
    def test_failed_to_add_challonge_participant(self, mock_add_team):
        mock_add_team.side_effect = Exception("Internal Server Error")

        self.tournament.challonge_tournament_id = 123
        self.tournament.save()
        self.tournament.refresh_from_db()

        users = [UserFactory.new() for i in range(4)]
        [GameIdFactory.new(user=user, email=user.email) for user in users]
        name = "Drakx"
        users_payload = {f"member_{i+1}_email": user.email for i, user in enumerate(users)}

        url = reverse("tournaments:create_and_register_team", kwargs={"id": self.tournament.id})

        try:
            self.client.post(
                url,
                {"name": name, **users_payload},
            )
        except Exception as e:
            self.assertEqual(str(e), "Failed to add participant at challonge")
            self.assertEqual(len(self.tournament.registered_teams.all()), 0)


class RegisterTeamIntoTournamentTest(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("/tournaments", include("apps.tournaments.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.refresh = RefreshToken.for_user(self.user)

        self.game_id = GameIdFactory.new(user=self.user, email=self.user.email)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

        self.tournament = LeagueOfLegendsTournamentFactory.new(organizer=self.user)

    @patch("lib.challonge.Tournament.add_team")
    def test_register_team_into_tournament(self, mock_add_team):
        participant = Participant()
        participant.id = 123
        mock_add_team.return_value = participant

        self.tournament.challonge_tournament_id = 123
        self.tournament.save()
        self.tournament.refresh_from_db()

        users = [UserFactory.new() for i in range(4)]
        game_ids = [GameIdFactory.new(user=user, email=user.email) for user in users]
        name = "Drakx"
        team = TeamFactory.new(name=name, created_by=self.user)
        [team.add_member(game_id=game_id) for game_id in [*game_ids, self.game_id]]

        url = reverse("tournaments:register_team", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {
                "team_id": team.id,
            },
        )

        team = resp.json()

        mock_add_team.assert_called_once()
        self.assertIn(Team.objects.get(id=team.get("id")), self.tournament.registered_teams.all())

    def test_register_team_tournament_not_found(self):
        url = reverse("tournaments:register_team", kwargs={"id": uuid.uuid4()})

        resp = self.client.post(
            url,
            {
                "team_id": uuid.uuid4(),
            },
        )

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.json()["detail"], "Not found.")

    def test_register_team_team_not_found(self):
        url = reverse("tournaments:register_team", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {
                "team_id": uuid.uuid4(),
            },
        )

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(resp.json()["detail"], "Not found.")

    def test_register_team_team_does_not_have_enough_members(self):
        users = [UserFactory.new() for i in range(3)]
        game_ids = [GameIdFactory.new(user=user, email=user.email) for user in users]
        name = "Drakx"
        team = TeamFactory.new(name=name, created_by=self.user)
        [team.add_member(game_id=game_id) for game_id in [*game_ids, self.game_id]]
        url = reverse("tournaments:register_team", kwargs={"id": self.tournament.id})

        resp = self.client.post(
            url,
            {
                "team_id": team.id,
            },
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(data.get("error"), "Team does not have enough members")

    def test_register_team_team_member_has_no_active_lol_account_connected(self):
        users = [UserFactory.new() for i in range(4)]
        game_ids = [GameIdFactory.new(user=user, email=user.email) for user in users]
        name = "Drakx"
        team = TeamFactory.new(name=name, created_by=self.user)
        [team.add_member(game_id=game_id) for game_id in [*game_ids, self.game_id]]
        url = reverse("tournaments:register_team", kwargs={"id": self.tournament.id})

        self.game_id.is_active = False
        self.game_id.save()

        resp = self.client.post(
            url,
            {
                "team_id": team.id,
            },
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            data.get("error"),
            f"Player {self.game_id.user.name} ({self.game_id.user.email}) has no active League Of "
            "Legend account connected",
        )

    @patch("lib.challonge.Tournament.add_team")
    def test_failed_to_add_challonge_participant(self, mock_add_team):
        mock_add_team.side_effect = Exception("Internal Server Error")

        self.tournament.challonge_tournament_id = 123
        self.tournament.save()
        self.tournament.refresh_from_db()

        users = [UserFactory.new() for i in range(4)]
        game_ids = [GameIdFactory.new(user=user, email=user.email) for user in users]
        name = "Drakx"
        team = TeamFactory.new(name=name, created_by=self.user)
        [team.add_member(game_id=game_id) for game_id in [*game_ids, self.game_id]]

        url = reverse("tournaments:register_team", kwargs={"id": self.tournament.id})

        try:
            self.client.post(
                url,
                {
                    "team_id": team.id,
                },
            )
        except Exception as e:
            mock_add_team.assert_called_once()
            self.assertEqual(str(e), "Failed to add participant at challonge")
            self.assertEqual(len(self.tournament.registered_teams.all()), 0)


class FinishMatchTest(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("", include("apps.tournaments.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.refresh = RefreshToken.for_user(self.user)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

        self.player_1 = UserFactory.new()
        self.player_2 = UserFactory.new()
        self.game_id_1 = GameIdFactory.new(user=self.player_1)
        self.game_id_2 = GameIdFactory.new(user=self.player_2)
        self.team_1 = TeamFactory.new(created_by=self.player_1)
        self.team_2 = TeamFactory.new(created_by=self.player_2)

        self.tournament = LeagueOfLegendsTournamentFactory.new(organizer=self.user)
        self.registration_1 = RegistrationFactory.new(
            team=self.team_1, tournament=self.tournament, challonge_participant_id=1
        )
        self.registration_2 = RegistrationFactory.new(
            team=self.team_2, tournament=self.tournament, challonge_participant_id=2
        )
        self.match = MatchFactory.new(
            tournament=self.tournament, team_a=self.team_1, team_b=self.team_2
        )

        for team in self.tournament.registered_teams.all():
            Rank.objects.create(
                tournament=self.tournament,
                team=team,
                score=0,
            )

        self.match.team_a_score = 0
        self.match.team_b_score = 1
        self.match.save()

    @patch("lib.challonge.Match.list")
    @patch("lib.challonge.Match.update")
    def test_finish_match(self, mock_match_update, mock_list_match):
        ch_match = ChMatch()
        ch_match.state = "complete"
        ch_match.winner_id = self.registration_2.challonge_participant_id
        mock_match_update.return_value = ch_match

        mock_list_match.return_value = []

        url = reverse(
            "tournaments:end-match",
            kwargs={"id": self.tournament.id, "match_id": self.match.id},
        )

        resp = self.client.patch(
            url,
            {
                "winner_id": self.team_2.id,
            },
        )

        mock_match_update.assert_called_once()
        self.assertEqual(resp.status_code, 200)
        self.match.refresh_from_db()
        self.assertEqual(self.match.status, Match.StatusType.ENDED)
        self.assertIsNotNone(self.match.winner)
        self.assertIsNotNone(self.match.loser)

    def test_finish_match_error_not_organizer(self):
        self.tournament.organizer = self.player_1
        self.tournament.save()

        url = reverse(
            "tournaments:end-match",
            kwargs={"id": self.tournament.id, "match_id": self.match.id},
        )

        resp = self.client.patch(
            url,
            {
                "winner_id": self.team_2.id,
            },
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 403)
        self.assertEqual(data.get("error"), "You are not this tournament's Organizer")

    @patch("lib.challonge.Match.update")
    def test_failed_fish_challonge_match(self, mock_match_update):
        mock_match_update.side_effect = Exception("Internal Server Error")

        url = reverse(
            "tournaments:end-match",
            kwargs={"id": self.tournament.id, "match_id": self.match.id},
        )

        try:
            self.client.patch(
                url,
                {
                    "winner_id": self.team_2.id,
                },
            )
        except Exception as e:
            mock_match_update.assert_called_once()
            self.assertNotEqual(self.match.status, Match.StatusType.ENDED)
            self.assertEqual(str(e), "Failed finish match at Challonge")
            self.match.refresh_from_db()
            self.assertIsNone(self.match.winner)
            self.assertIsNone(self.match.loser)

    @patch("lib.challonge.Match.list")
    @patch("lib.challonge.Match.update")
    def test_failed_fish_challonge_match_no_exception(self, mock_match_update, mock_list_match):
        ch_match = ChMatch()
        ch_match.state = "underway"
        ch_match.winner_id = self.registration_2.challonge_participant_id
        mock_match_update.return_value = ch_match
        mock_list_match.return_value = []

        url = reverse(
            "tournaments:end-match",
            kwargs={"id": self.tournament.id, "match_id": self.match.id},
        )

        try:
            self.client.patch(
                url,
                {
                    "winner_id": self.team_2.id,
                },
            )
        except Exception as e:
            mock_match_update.assert_called_once()
            self.assertNotEqual(self.match.status, Match.StatusType.ENDED)
            self.assertEqual(str(e), "We couldn't finish the match")
            self.match.refresh_from_db()
            self.assertIsNone(self.match.winner)
            self.assertIsNone(self.match.loser)


class StartMatchTest(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("", include("apps.tournaments.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.refresh = RefreshToken.for_user(self.user)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

        self.player_1 = UserFactory.new()
        self.player_2 = UserFactory.new()
        self.game_id_1 = GameIdFactory.new(user=self.player_1)
        self.game_id_2 = GameIdFactory.new(user=self.player_2)
        self.team_1 = TeamFactory.new(created_by=self.player_1)
        self.team_2 = TeamFactory.new(created_by=self.player_2)
        self.team_1.add_member(self.game_id_1)
        self.team_2.add_member(self.game_id_2)
        self.summoner_1 = LeagueOfLegendsSummonerFactory.new(game_id=self.game_id_1)
        self.summoner_2 = LeagueOfLegendsSummonerFactory.new(game_id=self.game_id_2)

        self.tournament = LeagueOfLegendsTournamentFactory.new(organizer=self.user)
        self.registration_1 = RegistrationFactory.new(
            team=self.team_1, tournament=self.tournament, challonge_participant_id=1
        )
        self.registration_2 = RegistrationFactory.new(
            team=self.team_2, tournament=self.tournament, challonge_participant_id=2
        )
        self.match = MatchFactory.new(
            tournament=self.tournament, team_a=self.team_1, team_b=self.team_2
        )

    @patch("lib.riot.Tournament.create_tournament_codes")
    @patch("lib.challonge.Match.mark_as_underway")
    def test_start_match(self, mock_mark_as_underway, mock_create_tour_code):
        ch_match = ChMatch()
        ch_match.state = "complete"
        mock_mark_as_underway.return_value = ch_match

        mock_create_tour_code.return_value = ["fake-match-code"]

        url = reverse(
            "tournaments:start-match",
            kwargs={"id": self.tournament.id, "match_id": self.match.id},
        )

        resp = self.client.patch(
            url,
        )

        mock_mark_as_underway.assert_called_once()
        mock_create_tour_code.assert_called_once()
        self.assertEqual(resp.status_code, 200)
        self.match.refresh_from_db()
        self.assertEqual(self.match.status, Match.StatusType.UNDERWAY)
        self.assertIsNotNone(self.match.riot_match_code)

    def test_start_match_error_not_organizer(self):
        self.tournament.organizer = self.player_1
        self.tournament.save()

        url = reverse(
            "tournaments:start-match",
            kwargs={"id": self.tournament.id, "match_id": self.match.id},
        )

        resp = self.client.patch(
            url,
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 403)
        self.assertEqual(data.get("error"), "You are not this tournament's Organizer")

    @patch("lib.challonge.Match.mark_as_underway")
    def test_failed_fish_challonge_match(self, mock_mark_as_underway):
        mock_mark_as_underway.side_effect = Exception("Internal Server Error")

        url = reverse(
            "tournaments:start-match",
            kwargs={"id": self.tournament.id, "match_id": self.match.id},
        )

        try:
            self.client.patch(url)
        except Exception as e:
            mock_mark_as_underway.assert_called_once()
            self.match.refresh_from_db()
            self.assertNotEqual(self.match.status, Match.StatusType.UNDERWAY)
            self.assertEqual(str(e), "Failed mark match as under_way at Challonge")

    @patch("lib.riot.Tournament.create_tournament_codes")
    @patch("lib.challonge.Match.mark_as_underway")
    def test_failed_to_create_codes(self, mock_mark_as_underway, mock_create_tour_code):
        ch_match = ChMatch()
        ch_match.state = "complete"
        mock_mark_as_underway.return_value = ch_match

        mock_create_tour_code.side_effect = Exception(
            "Temporary error, could not create the league of legends match code"
        )

        url = reverse(
            "tournaments:start-match",
            kwargs={"id": self.tournament.id, "match_id": self.match.id},
        )

        try:
            self.client.patch(
                url,
            )
        except Exception as e:
            mock_mark_as_underway.assert_called_once()
            mock_create_tour_code.assert_called_once()
            self.match.refresh_from_db()
            self.assertNotEqual(self.match.status, Match.StatusType.UNDERWAY)
            self.assertEqual(self.match.riot_match_code, "")
            self.assertEqual(
                str(e), "Temporary error, could not create the league of legends match code"
            )


class EndTournamentTest(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("", include("apps.tournaments.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.refresh = RefreshToken.for_user(self.user)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

        self.tournament = LeagueOfLegendsTournamentFactory.new(organizer=self.user)

        [self.tournament.add_team(TeamFactory.new(organizer=self.user)) for _ in range(2)]

        teams = self.tournament.registered_teams.all()

        for team in teams:
            Rank.objects.create(
                tournament=self.tournament,
                team=team,
                score=0,
            )

        self.match = MatchFactory.new(team_a=teams[0], team_b=teams[1], tournament=self.tournament)

        self.match.set_winner(teams[0])

        self.tournament.current_round = 1
        self.tournament.save()

    @patch("lib.challonge.Tournament.finalize")
    def test_end_tournament(self, mock_finalize):
        mock_finalize.return_value = {}
        self.tournament.status = Tournament.StatusOptions.RUNNING
        self.tournament.save()

        url = reverse(
            "tournaments:end-tournament",
            kwargs={
                "id": self.tournament.id,
            },
        )

        resp = self.client.patch(
            url,
        )

        mock_finalize.assert_called_once()
        self.assertEqual(resp.status_code, 200)
        self.tournament.refresh_from_db()
        self.assertEqual(self.tournament.status, Tournament.StatusOptions.ENDED)
        self.assertIsNotNone(self.tournament.ended_at)

    def test_end_error_not_organizer(self):
        self.tournament.organizer = UserFactory.new()
        self.tournament.save()

        url = reverse(
            "tournaments:end-tournament",
            kwargs={"id": self.tournament.id},
        )

        resp = self.client.patch(
            url,
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 403)
        self.assertEqual(data.get("error"), "You are not this tournament's Organizer")

    def test_end_tournament_not_running(self):
        url = reverse(
            "tournaments:end-tournament",
            kwargs={
                "id": self.tournament.id,
            },
        )

        resp = self.client.patch(
            url,
        )

        data = resp.json()

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(data.get("error"), "You can not end a tournament which are not running")
        self.assertNotEqual(self.tournament.status, Tournament.StatusOptions.ENDED)
        self.assertIsNone(self.tournament.ended_at)

    @patch("lib.challonge.Tournament.finalize")
    def test_failed_ending_challonge_match(self, mock_finalize):
        mock_finalize.side_effect = Exception("Internal Server Error")
        self.tournament.status = Tournament.StatusOptions.RUNNING
        self.tournament.save()

        url = reverse(
            "tournaments:end-tournament",
            kwargs={"id": self.tournament.id},
        )

        try:
            self.client.patch(
                url,
            )
        except Exception as e:
            mock_finalize.assert_called_once()
            self.tournament.refresh_from_db()
            self.assertNotEqual(self.tournament.status, Tournament.StatusOptions.ENDED)
            self.assertEqual(str(e), "Failed end tournament at Challonge")
