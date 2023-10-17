from rest_framework.response import Response
from rest_framework import status

not_found = Response(
    {"error": "Not found."},
    status=status.HTTP_404_NOT_FOUND,
)
