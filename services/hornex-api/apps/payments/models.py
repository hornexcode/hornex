import uuid

from django.db import models

from apps.tournaments.models import Registration


class PaymentRegistration(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending"
        PAID = "paid"
        REFUNDED = "refunded"
        CANCELLED = "cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    registration = models.ForeignKey(
        Registration, on_delete=models.CASCADE, related_name="payments"
    )
    status = models.CharField(
        choices=Status.choices, max_length=12, default=Status.PENDING
    )
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.registration.team.name} ({self.id})"

    def get_total_amount(self):
        return float(self.amount / 100)

    def confirm_payment(self):
        self.status = self.Status.PAID
        self.save()

    def is_paid(self):
        return self.status == self.Status.PAID
