from django.contrib import admin
from games.models import Game, GameAccountRiot

admin.site.register([Game, GameAccountRiot])
