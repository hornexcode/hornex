from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from lib.efi.pix import PixPayment


@api_view(["POST", "GET"])
def create_order(request):
    """
    Create a new order
    """
    txid = "tx1ODVdv2eZvKYlo2CBvWozvHZ"

    pp = PixPayment()

    if request.method == "POST":
        try:
            qrcode = pp.charge(txid, request.data)
        except Exception:
            return Response({"error": "Error on creating pix charge"}, status=500)

        return Response(qrcode, status=status.HTTP_201_CREATED)

    orders = pp.list()
    print(orders)
    return Response(orders, status=status.HTTP_200_OK)
