from django.contrib import admin

from apps.payments.models import PaymentRegistration


class RegistrationAdmin(admin.ModelAdmin):
    list_display = ("registration", "amount", "created_at", "updated_at")
    search_fields = ("registration__team__name", "registration__team__name")
    list_filter = ("created_at", "updated_at")


admin.site.register(PaymentRegistration, RegistrationAdmin)
