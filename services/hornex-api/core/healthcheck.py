# health check

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.db import connection
from lib.logging import logger


@api_view(["GET"])
def health(request):
    # check database
    is_up = False
    sqlite3_up = False
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            sqlite3_up = cursor.fetchone()
    except Exception as e:
        logger.error(e)

    is_up = sqlite3_up

    return Response(
        {
            "status": "up" if is_up else "down",
            "services": {"sqlite3": "up" if sqlite3_up else "down"},
        },
        status=status.HTTP_200_OK,
    )
