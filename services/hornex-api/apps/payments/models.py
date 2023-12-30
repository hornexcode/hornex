import uuid
from collections.abc import Iterable

from django.db import models

from apps.tournaments.models import Registration


class RegistrationPayment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending"
        PAID = "paid"
        REFUNDED = "refunded"
        CANCELLED = "cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    registration = models.ForeignKey(
        Registration, on_delete=models.CASCADE, related_name="payments"
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


class PixTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    txid = models.CharField(unique=True, editable=False, max_length=35)
    registration_payment = models.ForeignKey(
        RegistrationPayment,
        on_delete=models.CASCADE,
        related_name="pix_transactions",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kargs) -> None:
        if not self.txid:
            self.txid = uuid.uuid4().hex
        return super().save(*args, **kargs)
