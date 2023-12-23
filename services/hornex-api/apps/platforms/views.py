from rest_framework import viewsets

from apps.platforms.models import Platform
from apps.platforms.serializers import PlatformSerializer


class PlatformViewSet(viewsets.ModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    lookup_field = "id"
