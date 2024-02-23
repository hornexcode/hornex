from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from apps.configs.models import Config
from apps.configs.serializers import ConfigSerializer
from jwt_token.authentication import JWTAuthentication


class ConfigViewSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    authentication_classes = []
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [JWTAuthentication]
    serializer_class = ConfigSerializer
    lookup_field = "name"

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
