from django.urls import path

from apps.webhooks.views import efi_controller, stripe_controller

urlpatterns = [
    # IMPORTANT: this path is used by efi to send callbacks
    # when a pix charge is paid, Efi will send a request to the callback
    # !!! The suffix /pix is required by efi, DO NOT REMOVE IT
    path(
        "/efi/pix",
        efi_controller,
        name="efi-callback",
    ),
    path(
        "/stripe",
        stripe_controller,
        name="stripe-webhook",
    ),
]
