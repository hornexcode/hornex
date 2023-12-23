from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from apps.users.filters import UserFilter
from apps.users.models import User
from apps.users.serializers import (
    LoggedInUserSerializerReadOnly,
    UserSerializer,
    serialize_user,
)


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "id"
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
    # TODO: create a read only serializer for this
    user = get_object_or_404(User, pk=request.user.id)
    serializer = LoggedInUserSerializerReadOnly(user)
    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def search_user(request):
    users = [serialize_user(user) for user in User.objects.filter()]
    return Response(users, status=status.HTTP_200_OK)
