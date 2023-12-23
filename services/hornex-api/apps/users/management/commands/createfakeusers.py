import faker
from django.core.management.base import BaseCommand

from apps.users.models import User

fake = faker.Faker()


class Command(BaseCommand):
    def handle(self, *args, **options):
        for _ in range(20):
            u = User.objects.create(
                name=f"{fake.first_name()} {fake.last_name()}",
                email=f"{fake.email()}",
            )
            u.set_password("test")
            u.save()
