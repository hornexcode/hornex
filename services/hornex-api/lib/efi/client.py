import os
from dataclasses import dataclass

import structlog

from apps.payments.dto import RegistrationPaymentDTO
from apps.payments.gateway import PaymentGateway
from lib.efi.http import EfiDial

logger = structlog.get_logger(__name__)


@dataclass
class OAuthToken:
    access_token: str
    token_type: str
    scope: str
    expires_in: int


class Clientable(PaymentGateway):
    ...


class Efi(Clientable):
    instance: "Efi" = None
    client: EfiDial = None

    def __new__(cls):
        if cls.instance is None:
            cls.instance = super().__new__(cls)
            cls.instance.client = EfiDial()
        return cls.instance

    def charge(self, payment_registration: RegistrationPaymentDTO):
        payload = CreatePixChargeData.new(
            payment_registration.name,
            payment_registration.cpf,
            payment_registration.amount,
        ).to_dict()

        order = self.client.create_order_with_transaction_id(
            payment_registration.id, payload
        )
        qrcode = self.client.create_qrcode(order.get("loc").get("id"))
        return qrcode


class Mock(Clientable):
    def charge(self, _: RegistrationPaymentDTO):
        return {
            "imagemQrcode": "test-imagemQrCode",
            "qrcode": "test-qrcode",
            "linkVisualizacao": "test-linkVisualizacao",
        }


@dataclass
class CreatePixChargeData:
    calendario: dict
    devedor: dict
    valor: dict
    chave: str
    solicitacaoPagador: str

    @classmethod
    def new(cls, payer_name: str, payer_cpf: str, amount: float):
        return cls(
            calendario={"expiracao": int(os.getenv("HORNEX_PIX_EXPIRATION", 3600))},
            devedor={"cpf": payer_cpf, "nome": payer_name},
            valor="%.2f" % amount,
            chave=os.getenv("HORNEX_PIX_KEY"),
            solicitacaoPagador="Tournament registration",
        )

    def to_dict(self):
        return {
            "calendario": self.calendario,
            "devedor": self.devedor,
            "valor": {"original": self.valor},
            "chave": self.chave,
            "solicitacaoPagador": self.solicitacaoPagador,
        }
