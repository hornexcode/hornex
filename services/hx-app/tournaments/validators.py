from django.core.exceptions import ValidationError


def validate_team_size(value):
    if value < 1:
        raise ValidationError("Team size must be greater than zero.")
