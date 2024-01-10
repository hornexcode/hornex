import uuid

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils import timezone

from apps.games.models import GameID
from apps.tournaments.models import Tournament
from lib.riot.client import Client


class UserManager(BaseUserManager):
    def _create_user(self, email, password, is_staff, is_superuser, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            is_staff=is_staff,
            is_active=True,
            is_superuser=is_superuser,
            last_login=now,
            date_joined=now,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        return self._create_user(email, password, False, False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        user = self._create_user(email, password, True, True, **extra_fields)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=254, unique=True)
    name = models.CharField(max_length=254, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_absolute_url(self):
        return "/users/%i/" % (self.pk)

    def can_play(self, game: Tournament.GameType, classifications: list[str]) -> bool:
        if game == Tournament.GameType.LEAGUE_OF_LEGENDS:
            active_gid = (
                GameID.objects.filter(is_active=True, user=self).first() or None
            )
            if active_gid is None:
                return False

            riot = Client()

            summoner = riot.get_summoner_by_name(active_gid.nickname)

            if summoner is None:
                return False

            league_entry = riot.get_entries_by_summoner_id(summoner.id)

            if not league_entry:
                return False

            return f"{league_entry[0].tier} {league_entry[0].rank}" in classifications

        return False

    def get_game_id(self, game: str):
        if game == Tournament.GameType.LEAGUE_OF_LEGENDS:
            return self.game_id
        return None
