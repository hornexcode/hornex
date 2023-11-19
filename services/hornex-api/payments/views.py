from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from django.http import HttpResponse
from lib.efi.pix import PixPayment
from django.core.files.base import ContentFile


@api_view(["POST"])
def create_order(request):
    """
    Create a new order
    """
    txid = "tx1ODVdv2eZvKYlo2CBvWozvPZ"

    pp = PixPayment()

    try:
        qrcode = pp.charge(txid, request.data)
    except Exception:
        return Response({"error": "Error on creating pix charge"}, status=500)

    return Response(qrcode, status=status.HTTP_201_CREATED)

    # return file of mime type jpg
    # file_to_send = ContentFile(p, name="qrcode.jpg")
    # resp = HttpResponse(file_to_send, content_type="image/jpeg")
    # resp["Content-Disposition"] = "attachment; filename=qrcode.jpg"
    # resp["Content-Length"] = file_to_send.size
    # return resp
