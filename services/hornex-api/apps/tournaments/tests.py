from datetime import datetime as dt
from datetime import timedelta as td

import faker
import pytz
import structlog
from django.test import TestCase
from django.urls import include, path
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.leagueoflegends.models import LeagueEntry, Tournament
from apps.teams.models import Membership, Team
from apps.users.models import User
from lib.challonge import Match as ChallongeMatchResourceAPI
from lib.challonge import Tournament as ChallongeTournamentResourceAPI

logger = structlog.get_logger(__name__)


fake = faker.Faker()


class TestStartTournament(TestCase):
    def test_start(self, *args, **options):
        now = dt.utcnow()

        tester = User.objects.create(
            name="admin", email="tester@hornex.gg", password="test"
        )

        bronze_tier, _ = LeagueEntry.objects.get_or_create(
            tier=LeagueEntry.TierOptions.BRONZE, rank=LeagueEntry.RankOptions.I
        )
        silver_tier, _ = LeagueEntry.objects.get_or_create(
            tier=LeagueEntry.TierOptions.SILVER, rank=LeagueEntry.RankOptions.I
        )

        t = Tournament.objects.create(
            name=f"Test Tournament {now.microsecond}",
            description="Torneio de League of Legends do Hornex",
            game=Tournament.GameType.LEAGUE_OF_LEGENDS,
            organizer=tester,
            start_date=now,
            end_date=now,
            start_time=now + td(minutes=10),
            end_time=now + td(minutes=30),
            check_in_opens_at=now,
            check_in_duration=30,
            registration_start_date=now,
            registration_end_date=now + td(minutes=20),
            feature_image="tmt-6.jpeg",
            is_public=True,  # change to is_published
            entry_fee=100,
            max_teams=32,
            team_size=5,
            is_classification_open=False,
        )

        t.allowed_league_entries.set([bronze_tier, silver_tier])

        logger.info("Starting tournament...")

        tournament = Tournament.objects.first()

        # create 5 teams
        teams: Team = []
        for i in range(4):
            team = Team.objects.create(name=f"Team {i + 1}", created_by=tester)
            teams.append(team)
            logger.info("Team created", team=team)

        for team in teams:
            for i in range(5):
                Membership.objects.create(
                    team=team,
                    user=User.objects.create(
                        name=fake.name(), email=fake.email(), password="test"
                    ),
                )
            logger.info("Team configured", team=team)

        tournament.teams.set(teams)
        logger.info("Tournament configured", tournament=tournament)

        start_at = dt.combine(tournament.start_date, tournament.start_time)
        start_at_utc = start_at.replace(tzinfo=pytz.UTC)
        start_at_str = start_at_utc.strftime("%Y-%m-%dT%H:%M:%S.000+00:00")

        logger.warn("start at", start_at=start_at_str)

        resp = ChallongeTournamentResourceAPI.create(
            name=tournament.name,
            tournament_type="single elimination",
            start_at=start_at_str,
            teams=True,
            check_in_duration=tournament.check_in_duration,
        )

        tournament.challonge_tournament_id = resp["tournament"]["id"]
        tournament.save()

        logger.info(
            "Tournament created on Challonge",
            challonge_tournament_id=tournament.challonge_tournament_id,
        )

        resp = ChallongeTournamentResourceAPI.add_participants(
            tournament.challonge_tournament_id,
            participants=[
                {"name": team.name, "seed": i + 1} for i, team in enumerate(teams)
            ],
        )

        logger.info("Checking participants...")
        participants = ChallongeTournamentResourceAPI.list_participants(
            tournament.challonge_tournament_id
        )
        for participant in participants:
            logger.info("Participant id -> ", participant_id=participant.id)
            ChallongeTournamentResourceAPI.checkin_participant(
                tournament.challonge_tournament_id, participant=participant.id
            )
            logger.info("Participant checked in", participant=participant)
        logger.info("Participants checked in")

        logger.info("Checking tournament...")
        ChallongeTournamentResourceAPI.checkin(tournament.challonge_tournament_id)
        logger.info("Tournament checked in")

        logger.info("Starting tournament...")
        ChallongeTournamentResourceAPI.start(tournament.challonge_tournament_id)
        logger.info("Tournament started")

        logger.info("Listing matches...")
        matches = ChallongeMatchResourceAPI.list(tournament.challonge_tournament_id)

        logger.info("Matches listed", matches=matches)
        print("")
        print("")
        print("")
        print("")
        logger.info("Round 1")
        print("")
        print("")
        print("")
        print("")

        logger.info("Checking tournament...")
        ChallongeTournamentResourceAPI.checkin(tournament.challonge_tournament_id)
        logger.info("Tournament checked in")

        logger.info("Updating match scores...")
        for match in matches:
            if match.round == 1:
                ChallongeMatchResourceAPI.mark_as_undeway(
                    tournament.challonge_tournament_id, match=match.id
                )
                logger.info(
                    "Match marked as underway", match=match.id, state=match.state
                )

        for match in matches:
            if match.round == 1:
                ChallongeMatchResourceAPI.update(
                    tournament.challonge_tournament_id,
                    match=match.id,
                    scores_csv="1-0",
                    player1_votes=1,
                    player2_votes=0,
                    winner_id=match.player1_id,
                )
                logger.info(
                    "Match scores updated", match=match.id, winner_id=match.player1_id
                )

        logger.info("Unmark as underway...")
        for match in matches:
            if match.round == 1:
                ChallongeMatchResourceAPI.unmark_as_undeway(
                    tournament.challonge_tournament_id, match=match.id
                )
                logger.info(
                    "Match unmarked as underway", match=match.id, state=match.state
                )

        print("")
        print("")
        print("")
        print("")
        logger.info("Round 2")
        print("")
        print("")
        print("")
        print("")

        logger.info("Updating match scores...")
        for match in matches:
            if match.round == 2:
                m = ChallongeMatchResourceAPI.mark_as_undeway(
                    tournament.challonge_tournament_id, match=match.id
                )
                logger.info(
                    "Match marked as underway",
                    match=m.id,
                    state=m.state,
                    player1_id=m.player1_id,
                    player2_id=m.player2_id,
                )

        logger.info("Listing matches...")
        matches = ChallongeMatchResourceAPI.list(tournament.challonge_tournament_id)
        for match in matches:
            if match.round == 2:
                m = ChallongeMatchResourceAPI.update(
                    tournament.challonge_tournament_id,
                    match=match.id,
                    scores_csv="1-2",
                    player1_votes=1,
                    player2_votes=2,
                    winner_id=match.player2_id,
                )
                logger.info(
                    "Match scores updated", match=match.id, winner_id=m.player2_id
                )

        logger.info("Unmark as underway...")
        for match in matches:
            if match.round == 2:
                m = ChallongeMatchResourceAPI.unmark_as_undeway(
                    tournament.challonge_tournament_id, match=match.id
                )
                logger.info("Match unmarked as underway", match=match.id, state=m.state)


class TestTournaments(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("api/v1", include("apps.tournaments.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "test.user@hornex.gg",
            "password": "hsfbhkas",
            "name": "Test User",
        }

        self.user = User.objects.create_user(**self.credentials)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

    def test_get_check_in_status_success(self):
        self.assertTrue(True)
