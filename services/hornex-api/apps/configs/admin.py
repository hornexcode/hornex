from django.contrib.admin import ModelAdmin, register

from apps.configs.models import Config


@register(Config)
class ConfigAdmin(ModelAdmin):
    list_display = ["name", "value", "type"]
    search_fields = ["name"]
    list_filter = ["type"]
    ordering = ["name"]
    list_per_page = 25

    class Meta:
        model = Config
