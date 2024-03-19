from datetime import UTC
from datetime import datetime as dt

from django.core.exceptions import ValidationError
from django_filters import rest_framework as filters
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer
from lib.jwt.authentication import JWTAuthentication


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    lookup_field = "id"
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ["activity"]
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        id = self.request.user.id
        return Notification.objects.filter(recipient_id=id)

    @swagger_auto_schema(
        operation_description="List /api/v1/notifications",
        operation_summary="List notifications",
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="POST /api/v1/notifications",
        operation_summary="Create a notification",
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="PATCH /api/v1/notifications/<id>",
        operation_summary="Update a notification",
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="DELETE /api/v1/notifications/<id>",
        operation_summary="Destroy a notification",
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="PATCH /api/v1/notifications/readings",
        operation_summary="Read notifications",
    )
    def bulk_update(self, request, *args, **kwargs):
        recipient_id = request.user.id
        notifications_ids = request.data

        try:
            notifications = Notification.objects.filter(
                id__in=notifications_ids, recipient_id=recipient_id
            ).update(read_at=dt.now(tz=UTC))
        except ValidationError as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

        return Response(notifications, status=status.HTTP_200_OK)
