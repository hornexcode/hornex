from abc import ABC, abstractmethod

from apps.tournaments.models import Registration


class RegistrationRepository(ABC):
    class Meta:
        abstract = True

    @abstractmethod
    def create(self, tournament):
        pass


class PostgresqlRegistrationRepository(RegistrationRepository):
    model: Registration

    def create(self, tournament):
        self.model.create(tournament)
