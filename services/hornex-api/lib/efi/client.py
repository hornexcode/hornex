import base64
import json
import logging
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path

import requests

BASE_DIR = Path(__file__).resolve().parent
CERT_NAME = "cert.pem"


logger = logging.getLogger("django")


@dataclass
class OAuthToken:
    access_token: str
    token_type: str
    scope: str
    expires_in: int


class Clientable(ABC):
    @abstractmethod
    def get_oauth_token(self) -> OAuthToken:
        pass


class Efi(Clientable):
    def __init__(self) -> None:
        self.base_url = os.getenv("EFI_BASE_URL", None)
        self.client_id = os.getenv("EFI_CLIENT_ID", None)
        self.client_secret = os.getenv("EFI_CLIENT_SECRET", None)
        self.certificate = f"{BASE_DIR}/{CERT_NAME}"

        if (
            not self.base_url
            or not self.client_id
            or not self.client_secret
            or not self.certificate
        ):
            raise Exception("Missing EFI env vars")

        resp = self.get_oauth_token()

        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"{resp.token_type} {resp.access_token}",
        }

    def get_oauth_token(self) -> OAuthToken:
        print(self.certificate, self.base_url, self.client_id, self.client_secret)
        auth = base64.b64encode(
            (f"{self.client_id}:{self.client_secret}").encode()
        ).decode()

        url = f"{self.base_url}/oauth/token"
        payload = json.dumps({"grant_type": "client_credentials"})
        headers = {"Authorization": f"Basic {auth}", "Content-Type": "application/json"}

        resp = requests.post(
            url, headers=headers, data=payload, cert=self.certificate, timeout=5
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
            cert=f"{BASE_DIR}/{CERT_NAME}",
            timeout=5,
        )

        if resp.status_code != 201:
            raise Exception("Error on create order", resp.json())

        return resp.json()

    def create_qrcode(self, location_id):
        uri = f"{self.base_url}/v2/loc/{location_id}/qrcode"
        resp = requests.get(
            uri,
            headers=self.headers,
            cert=f"{BASE_DIR}/{CERT_NAME}",
            timeout=5,
        )

        if resp.status_code != 200:
            raise Exception("Error on create qrcode", resp.json())

        return resp.json()

    def list_orders(self):
        uri = f"{self.base_url}/v2/cob?inicio=2023-11-10T16:01:35Z&fim=2023-11-30T20:10:00Z"
        resp = requests.get(
            uri,
            headers=self.headers,
            cert=f"{BASE_DIR}/{CERT_NAME}",
            timeout=5,
        )

        if resp.status_code != 200:
            raise Exception("Error on list orders", resp.json())

        return resp.json()

    def charge(self, txid, payload):
        order = self.create_order_with_transaction_id(txid, payload)
        qrcode = self.create_qrcode(order.get("loc").get("id"))
        return qrcode
