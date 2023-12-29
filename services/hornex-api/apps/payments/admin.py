from django.contrib import admin

from apps.payments.models import PixTransaction, RegistrationPayment


class PixTransactionAdmin(admin.ModelAdmin):
    list_display = ("txid", "registration_payment", "created_at", "updated_at")
    search_fields = ("txid", "registration_payment__registration__team__name")
    list_filter = ("created_at", "updated_at")


class RegistrationAdmin(admin.ModelAdmin):
    list_display = ("registration", "amount", "created_at", "updated_at")
    search_fields = ("registration__team__name", "registration__team__name")
    list_filter = ("created_at", "updated_at")


admin.site.register(PixTransaction, PixTransactionAdmin)
admin.site.register(RegistrationPayment, RegistrationAdmin)
