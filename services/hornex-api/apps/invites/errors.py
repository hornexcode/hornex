from rest_framework.response import Response
from rest_framework import status

invite_not_found = Response(
    {"error": "Not found."},
    status=status.HTTP_404_NOT_FOUND,
)
invite_does_not_belongs_to_you = Response(
    {"error": "This invite does not belongs to you."},
    status=status.HTTP_400_BAD_REQUEST,
)
invite_accepted = Response(
    {"error": "This invite has been accepted."},
    status=status.HTTP_400_BAD_REQUEST,
)
invite_declined = Response(
    {"error": "This invite has been declined."},
    status=status.HTTP_400_BAD_REQUEST,
)
invite_expired = Response(
    {"error": "This invite has expired."},
    status=status.HTTP_400_BAD_REQUEST,
)
