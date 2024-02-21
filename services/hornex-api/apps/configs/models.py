from collections.abc import Iterable

from django.db import models


class Config(models.Model):
    class ConfigType(models.TextChoices):
        STRING = "STRING", "String"
        INTEGER = "INTEGER", "Integer"
        BOOLEAN = "BOOLEAN", "Boolean"

    name = models.CharField(max_length=255, unique=True)
    value = models.CharField(max_length=255)
    type = models.CharField(max_length=10, choices=ConfigType.choices, default=ConfigType.STRING)

    def __str__(self):
        return self.name

    def save(
        self,
        force_insert: bool = ...,
        force_update: bool = ...,
        using: str | None = ...,
        update_fields: Iterable[str] | None = ...,
    ) -> None:
        if self.type == self.ConfigType.BOOLEAN:
            if self.value not in ["0", "1"]:
                raise ValueError("Boolean config value must be 0 or 1")
        elif self.type == self.ConfigType.INTEGER:
            try:
                int(self.value)
            except ValueError:
                raise ValueError("Integer config value must be an integer")

        return super().save(force_insert, force_update, using, update_fields)

    def set_boolean(self, value: bool):
        self.value = str("1" if value else "0")
        self.type = self.ConfigType.BOOLEAN
        self.save()

    def set_integer(self, value: int):
        self.value = str(value)
        self.type = self.ConfigType.INTEGER
        self.save()

    def set_string(self, value: str):
        self.value = value
        self.type = self.ConfigType.STRING
        self.save()

    def get_value(self):
        if self.type == self.ConfigType.BOOLEAN:
            return self.value == "1"
        if self.type == self.ConfigType.INTEGER:
            return int(self.value)
        return self.value
