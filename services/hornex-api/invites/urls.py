from django.urls import path
from invites.views import get_invites, accept_invite, decline_invite, get_invites_count


urlpatterns = [
    path("", get_invites, name="invite-list"),
    path("/count", get_invites_count, name="invites_count"),
    path("/accept", accept_invite, name="invite-accept"),
    path("/decline", decline_invite, name="invite-decline"),
]
