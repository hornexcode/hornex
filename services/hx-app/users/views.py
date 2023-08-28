from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from users.models import User
from users.serializers import UserSerializer


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
