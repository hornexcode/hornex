from rest_framework import viewsets
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from users.models import User
from users.serializers import UserSerializer, LoggedInUserSerializerReadOnly
from django.shortcuts import get_object_or_404


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
    # TODO: create a read only serializer for this
    user = get_object_or_404(User, pk=request.user.id)
    serializer = LoggedInUserSerializerReadOnly(user)
    return Response(serializer.data)
