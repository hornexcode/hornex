import logging
from dataclasses import dataclass

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger("django")


@dataclass
class Pix:
    endToEndId: str
    txid: str
    chave: str
    valor: str
    horario: str
    infoPagador: str


@api_view(["POST", "GET", "PUT", "PATCH", "DELETE"])
def efi_controller(request):
    # implement background task here
    logger.debug(request.data)
    print(request.data)
    # {'pix': [{'endToEndId': 'E09089356202312282053APIfbf50a6b', 'txid': '6889f71d2e84368839c3f07e0e0ec285a62', 'chave': '5f0d0e75-dde2-473e-ab2f-d9d140f68e62', 'valor': '2.32', 'horario': '2023-12-28T20:53:32.000Z', 'infoPagador': 'Teste de pagamento em ambiente sandbox'}]}
    print(request.headers)
    print(request.GET)
    return Response({"status": "ok"}, status=status.HTTP_200_OK)
