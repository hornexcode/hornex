# health check

from django.db import connection
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from lib.logging import logger


@api_view(["GET"])
def health(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except Exception as e:
        logger.error(f"DB Health Check Failed: {e}")
        return Response(
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    return Response(
        status=status.HTTP_200_OK,
    )
