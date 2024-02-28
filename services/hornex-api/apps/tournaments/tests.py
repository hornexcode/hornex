from test.factories import GameIdFactory, UserFactory

import faker
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

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
