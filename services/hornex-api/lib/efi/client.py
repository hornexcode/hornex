import base64
import os
import json
import requests
from abc import ABC, abstractmethod
from dataclasses import dataclass
from lib.logging import logger
from pathlib import Path


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
        self.base_url = os.getenv("EFI_BASE_URL", "https://pix.api.efipay.com.br")
        self.client_id = os.getenv(
            "EFI_CLIENT_ID", "Client_Id_e616c51bd5adb9f08cd19aa5dd47d0f1f80e3d6a"
        )
        self.client_secret = os.getenv(
            "EFI_CLIENT_ID", "Client_Secret_0c38cbac65fc629e9b97b19fd291b26fc3c303bb"
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
        certificado = f"{BASE_DIR}/certificado_prod.pem"

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
        resp = requests.put(
            uri,
            headers=self.headers,
            data=json.dumps(payload),
            cert=f"{BASE_DIR}/certificado_prod.pem",
            timeout=5,
        )

        if resp.status_code != 201:
            logger.warning("Error on create order", resp.json())
            raise Exception("Error on create order", resp.json())

        return resp.json()

    def create_qrcode(self, location_id):
        uri = f"{self.base_url}/v2/loc/{location_id}/qrcode"
        resp = requests.get(
            uri,
            headers=self.headers,
            cert=f"{BASE_DIR}/certificado_prod.pem",
            timeout=5,
        )

        if resp.status_code != 200:
            logger.warning("Error on create qrcode", resp.json())
            raise Exception("Error on create qrcode", resp.json())

        return resp.json()

    def list_orders(self):
        uri = f"{self.base_url}/v2/cob?inicio=2023-11-10T16:01:35Z&fim=2023-11-30T20:10:00Z"
        resp = requests.get(
            uri,
            headers=self.headers,
            cert=f"{BASE_DIR}/certificado_prod.pem",
            timeout=5,
        )

        if resp.status_code != 200:
            logger.warning("Error on list orders", resp.json())
            raise Exception("Error on list orders", resp.json())

        return resp.json()
