from django.contrib import admin

from apps.games.models import Game, GameAccountRiot

admin.site.register([Game, GameAccountRiot])
