import base64
import os
import json
import requests
import pyqrcode
from abc import ABC, abstractmethod
from dataclasses import dataclass
from lib.logging import logger
from pathlib import Path
from PIL import Image
from io import BytesIO


BASE_DIR = Path(__file__).resolve().parent


@dataclass
class OAuthToken:
    access_token: str
    token_type: str
    scope: str
    expires_in: int


@dataclass
class Order:
    user_doc_id: str
    user_doc_name: str
    amount: int


class Clientable(ABC):
    @abstractmethod
    def get_oauth_token(self) -> OAuthToken:
        pass


class Client(Clientable):
    def __init__(self) -> None:
        # TODO: remove this
        self.base_url = os.getenv("EFI_BASE_URL", "https://pix-h.api.efipay.com.br")
        self.client_id = os.getenv(
            "EFI_CLIENT_ID", "Client_Id_7ce2b32e4e3f8d01c758d23af27bf08b69a17766"
        )
        self.client_secret = os.getenv(
            "EFI_CLIENT_ID", "Client_Secret_831ecbc805314970942e82e89b01d06b4cfbcd24"
        )

        resp = self.get_oauth_token()

        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"{resp.token_type} {resp.access_token}",
        }

    def get_oauth_token(self) -> OAuthToken:
        auth = base64.b64encode(
            (f"{self.client_id}:{self.client_secret}").encode()
        ).decode()

        uri = f"{self.base_url}/oauth/token"
        payload = json.dumps({"grant_type": "client_credentials"})
        headers = {"Authorization": f"Basic {auth}", "Content-Type": "application/json"}

        # TODO: remove this
        certificado = f"{BASE_DIR}/certificado.pem"

        resp = requests.post(
            uri, headers=headers, data=payload, cert=certificado, timeout=5
        )

        data = resp.json()

        if resp.status_code != 200:
            raise Exception("Error on get oauth token", data)

        return OAuthToken(
            access_token=data["access_token"],
            token_type=data["token_type"],
            scope=data["scope"],
            expires_in=data["expires_in"],
        )

    def create_order_with_transaction_id(self, txid, payload):
        uri = f"{self.base_url}/v2/cob/{txid}"
        logger.success("Creating order", uri, payload)
        resp = requests.put(
            uri,
            headers=self.headers,
            data=json.dumps(payload),
            cert=f"{BASE_DIR}/certificado.pem",
            timeout=5,
        )

        if resp.status_code != 201:
            logger.warning("Error on create order", resp.json())
            raise Exception("Error on create order", resp.json())

        return resp.json()

    def create_qrcode(self, location_id):
        uri = f"{self.base_url}/v2/loc/{location_id}/qrcode"
        resp = requests.get(
            uri, headers=self.headers, cert=f"{BASE_DIR}/certificado.pem", timeout=5
        )

        if resp.status_code != 200:
            logger.warning("Error on create qrcode", resp.json())
            raise Exception("Error on create qrcode", resp.json())

        return resp.json()

    def qrcode_generator(self, location_id):
        qrcode = self.create_qrcode(location_id)
        data_qrcode = qrcode["qrcode"]

        url = pyqrcode.QRCode(data_qrcode, error="H")
        url.png("qrcode.jpg", scale=10)
        img = Image.open("qrcode.jpg")
        img = img.convert("RGBA")
        img_io = BytesIO()
        img.save(img_io, "PNG", quality=100)
        img_io.seek(0)

        return img_io
