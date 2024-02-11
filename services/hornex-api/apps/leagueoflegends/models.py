import os

import structlog
from django.db import models
from rest_framework.exceptions import ValidationError

from apps.accounts.models import GameID
from apps.tournaments.models import Checkin
from apps.tournaments.models import Tournament as BaseTournament
from lib.challonge import Tournament as ChallongeTournamentResourceAPI
from lib.riot import (
    Provider as RiotProviderResourceAPI,
)
from lib.riot import (
    Tournament as RiotTournamentResourceAPI,
)

logger = structlog.get_logger(__name__)

MINIMUM_PARTICIPANTS = 0


class LeagueEntry(models.Model):
    class TierOptions(models.TextChoices):
        IRON = "IRON"
        BRONZE = "BRONZE"
        SILVER = "SILVER"
        GOLD = "GOLD"
        PLATINUM = "PLATINUM"
        EMERALD = "EMERALD"
        DIAMOND = "DIAMOND"
        MASTER = "MASTER"
        GRANDMASTER = "GRANDMASTER"
        CHALLENGER = "CHALLENGER"

    tier = models.CharField(max_length=25, choices=TierOptions.choices)

    class RankOptions(models.TextChoices):
        I = "I"  # noqa
        II = "II"
        III = "III"
        IV = "IV"

    rank = models.CharField(max_length=25, choices=RankOptions.choices)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["tier", "rank"]
        ordering = ["tier", "rank"]

    def __str__(self) -> str:
        return f"{self.tier} {self.rank}"


class Summoner(models.Model):
    id = models.CharField(max_length=500, primary_key=True, editable=True)
    game_id = models.ForeignKey(GameID, on_delete=models.CASCADE)
    puuid = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    league_entry = models.ForeignKey(LeagueEntry, on_delete=models.CASCADE, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class Provider(models.Model):
    class RegionType(models.TextChoices):
        BR = "BR"
        EUNE = "EUNE"
        EUW = "EUW"
        JP = "JP"
        KR = "KR"
        LAN = "LAN"
        LAS = "LAS"
        NA = "NA"
        OCE = "OCE"
        TR = "TR"
        RU = "RU"

    id = models.IntegerField(primary_key=True, editable=False)
    region = models.CharField(max_length=10, choices=RegionType.choices, default=RegionType.BR)
    url = models.URLField(
        editable=True,
        null=False,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"League of Legends Provider ({self.id})"


class Tournament(BaseTournament):
    class PickType(models.TextChoices):
        BLIND_PICK = "BLIND_PICK"
        DRAFT_MODE = "DRAFT_MODE"
        ALL_RANDOM = "ALL_RANDOM"
        TOURNAMENT_DRAFT = "TOURNAMENT_DRAFT"

    class MapType(models.TextChoices):
        SUMMONERS_RIFT = "SUMMONERS_RIFT"
        TWISTED_TREELINE = "TWISTED_TREELINE"
        HOWLING_ABYSS = "HOWLING_ABYSS"

    class SpectatorType(models.TextChoices):
        NONE = "NONE"
        LOBBYONLY = "LOBBYONLY"
        ALL = "ALL"

    provider = models.ForeignKey(
        Provider,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
    )
    riot_id = models.IntegerField(null=True, blank=True)
    pick = models.CharField(max_length=50, choices=PickType.choices, default=PickType.BLIND_PICK)
    map = models.CharField(max_length=50, choices=MapType.choices, default=MapType.SUMMONERS_RIFT)
    spectator = models.CharField(
        max_length=50,
        choices=SpectatorType.choices,
        default=SpectatorType.LOBBYONLY,
    )
    allowed_league_entries = models.ManyToManyField(LeagueEntry)
    riot_tournament_id = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def get_classifications(self) -> list[str]:
        return [f"{entry.tier} {entry.rank}" for entry in self.allowed_league_entries.all()]

    def checkin(self):
        def has_enough_participants():
            participants_total = 0
            for team in self.teams.all():
                for _ in team.members.all():
                    participants_total += 1

            return self.teams.count() >= MINIMUM_PARTICIPANTS

        def add_participants_to_challonge_tournament(tournament: str):
            try:
                ChallongeTournamentResourceAPI.add_participants(
                    tournament=tournament,
                    participants=[
                        {
                            "name": "Team 1",
                            "seed": 1,
                        },
                        {
                            "name": "Team 2",
                            "seed": 2,
                        },
                        {
                            "name": "Team 3",
                            "seed": 3,
                        },
                        {
                            "name": "Team 4",
                            "seed": 4,
                        },
                        {
                            "name": "Team 5",
                            "seed": 5,
                        },
                        {
                            "name": "Team 6",
                            "seed": 6,
                        },
                        {
                            "name": "Team 7",
                            "seed": 7,
                        },
                        {
                            "name": "Team 8",
                            "seed": 8,
                        },
                        {
                            "name": "Team 9",
                            "seed": 9,
                        },
                        {
                            "name": "Team 10",
                            "seed": 10,
                        },
                        {
                            "name": "Team 11",
                            "seed": 11,
                        },
                        {
                            "name": "Team 12",
                            "seed": 12,
                        },
                        {
                            "name": "Team 13",
                            "seed": 13,
                        },
                        {
                            "name": "Team 14",
                            "seed": 14,
                        },
                        {
                            "name": "Team 15",
                            "seed": 15,
                        },
                        {
                            "name": "Team 16",
                            "seed": 16,
                        },
                    ],
                )
            except Exception as e:
                logger.error("ChallongeTournamentResourceAPI.add_participants", error=e)
                raise ValidationError({"error": "Failed to create participants in Challonge"})

        def create_challonge_tournament():
            try:
                chllng_trnmnt: ChallongeTournamentResourceAPI = (
                    ChallongeTournamentResourceAPI.create(
                        name=self.name[:60],
                        description=self.description,
                        tournament_type="single elimination",
                        start_at=self.registration_start_date.isoformat(),
                        check_in_duration=15,
                        participants_total=self.max_teams,
                        teams=True,
                    )
                )
                self.challonge_tournament_id = chllng_trnmnt.id
                self.challonge_tournament_url = chllng_trnmnt.full_challonge_url
                self.save()

                return chllng_trnmnt
            except Exception as e:
                logger.error("ChallongeTournamentResourceAPI.create", error=e)
                raise ValidationError({"error": "Failed to create tournament in Challonge"})

        def register_leagueoflegends_tournament():
            try:
                riot_provider_id = Provider.objects.get(region=Provider.RegionType.BR).id
                logger.info("Provider.objects.get successfully")
            except Provider.DoesNotExist:
                riot_provider_id = RiotProviderResourceAPI.create(
                    region=Provider.RegionType.BR,
                    url=os.getenv("HORNEX_API_BASE_URL"),
                )
                logger.info(
                    "RiotProviderResourceAPI.create",
                    riot_provider_id=riot_provider_id,
                )
                Provider.objects.create(
                    id=riot_provider_id,
                    region=Provider.RegionType.BR,
                )
                logger.info("Provider.objects.create successfully")
            except Exception as e:
                logger.error("Provider.objects.get", error=e)
                raise ValidationError({"error": "Failed to retrieve and create provider"})

            try:
                # 4. create tournament in riot
                riot_tournament_id = RiotTournamentResourceAPI.create(
                    name=self.name[:60],
                    provider_id=riot_provider_id,
                )

            except Exception as e:
                logger.error("RiotTournamentResourceAPI.create", error=e)
                raise ValidationError({"error": "Failed to create tournament in Riot"})

            self.riot_tournament_id = riot_tournament_id
            self.save()

        # -
        if not has_enough_participants():
            raise ValidationError({"error": "Minimum number of participants not reached"})

        chllng_trnmnt = create_challonge_tournament()
        add_participants_to_challonge_tournament(chllng_trnmnt.id)
        register_leagueoflegends_tournament()

    def member_checkin(self, user, team) -> Checkin:
        try:
            checkin = Checkin.objects.get(user=user, team=team, tournament=self)
            print("Already checked in")
            if checkin:
                raise ValidationError("Already checked in")

        except Checkin.DoesNotExist:
            return Checkin.objects.create(user=user, team=team, tournament=self)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class Code(models.Model):
    code = models.CharField(max_length=30, primary_key=True, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    match = models.ForeignKey("tournaments.Match", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.code} ({self.tournament.name})"


class Session(models.Model):
    game_id = models.ForeignKey(GameID, on_delete=models.CASCADE)
    scope = models.TextField()
    token_type = models.CharField(max_length=50)
    refresh_token = models.TextField()
    id_token = models.TextField()
    sub_id = models.TextField()
    access_token = models.TextField()
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.game_id.nickname}'s Session"
