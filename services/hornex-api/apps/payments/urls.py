from django.urls import path

from apps.payments.views import create_payment_registration

urlpatterns = [
    path(
        "/registration",
        create_payment_registration,
        name="create-payment-registration",
    ),
]
