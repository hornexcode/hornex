from django.contrib import admin

from apps.games.models import Game, GameID

admin.site.register([Game, GameID])
