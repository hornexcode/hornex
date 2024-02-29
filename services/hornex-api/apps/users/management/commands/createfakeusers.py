import faker
from django.core.management.base import BaseCommand

from apps.accounts.models import GameID
from apps.users.models import User

fake = faker.Faker()


class Command(BaseCommand):
    def handle(self, *args, **options):
        for _ in range(5):
            u = User.objects.create(
                name=f"{fake.first_name()} {fake.last_name()}",
                email=f"{fake.email()}".split("@")[0] + "@hornex.gg",
            )
            u.set_password("test")
            u.save()

            GameID.objects.create(
                user=u, game=GameID.GameOptions.LEAGUE_OF_LEGENDS, nickname=fake.user_name()
            )
