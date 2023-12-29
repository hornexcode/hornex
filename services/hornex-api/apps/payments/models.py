import uuid

from django.db import models

from apps.tournaments.models import Registration
from apps.users.models import User


class RegistrationPayment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending"
        PAID = "paid"
        REFUNDED = "refunded"
        CANCELLED = "cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    registration = models.ForeignKey(
        Registration, on_delete=models.DO_NOTHING, related_name="payments"
    )
    status = (
        models.CharField(choices=Status.choices, max_length=12, default=Status.PENDING),
    )
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def confirm_payment(self):
        self.status = self.Status.PAID
        self.save()
