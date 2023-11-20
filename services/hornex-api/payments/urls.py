from django.urls import path
from .views import create_order

urlpatterns = [
    path("/pix", create_order, name="payment-pix"),
]
