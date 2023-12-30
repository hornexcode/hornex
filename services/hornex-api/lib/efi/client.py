import os
from abc import ABC, abstractmethod
from dataclasses import dataclass

import structlog

from apps.payments.dto import RegistrationPaymentDTO
from lib.efi.http import EfiDial

logger = structlog.get_logger(__name__)


@dataclass
class OAuthToken:
    access_token: str
    token_type: str
    scope: str
    expires_in: int


class Clientable(ABC):
    @abstractmethod
    def charge(self, registration_payment: RegistrationPaymentDTO) -> OAuthToken:
        raise NotImplementedError


class Efi(Clientable):
    instance: "Efi" = None
    client: EfiDial = None

    def __new__(cls):
        if cls.instance is None:
            cls.instance = super().__new__(cls)
            cls.instance.client = EfiDial()
        return cls.instance

    def charge(self, registration_payment: RegistrationPaymentDTO):
        txid = registration_payment.id[:35]
        payload = CreatePixChargeData.new(
            registration_payment.name,
            registration_payment.cpf,
            registration_payment.amount,
            txid,
        ).to_dict()

        order = self.client.create_order_with_transaction_id(txid, payload)
        qrcode = self.client.create_qrcode(order.get("loc").get("id"))
        return qrcode


class Mock(Clientable):
    def charge(self, registration_payment: RegistrationPaymentDTO):
        return {
            "location": "https://api-pix-h.gerencianet.com.br/v2/loc/qr/2e4c5f2e-6e4e-4d6d-8e4f-2e4c5f2e6e4e",
            "qrcode": "https://api-pix-h.gerencianet.com.br/v2/loc/qr/2e4c5f2e-6e4e-4d6d-8e4f-2e4c5f2e6e4e",
        }


@dataclass
class CreatePixChargeData:
    calendario: dict
    devedor: dict
    valor: dict
    chave: str
    solicitacaoPagador: str
    txid: str

    @classmethod
    def new(cls, payer_name: str, payer_cpf: str, amount: float, txid: str):
        return cls(
            calendario={"expiracao": int(os.getenv("PIX_EXPIRATION", 3600))},
            devedor={"cpf": payer_cpf, "nome": payer_name},
            valor="%.2f" % amount,
            chave=os.getenv("PIX_KEY"),
            solicitacaoPagador="Tournament registration",
            txid=txid,
        )

    def to_dict(self):
        return {
            "calendario": self.calendario,
            "devedor": self.devedor,
            "valor": self.valor,
            "chave": self.chave,
            "txid": self.txid,
            "solicitacaoPagador": self.solicitacaoPagador,
        }
