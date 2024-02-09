import base64
import json
import os
from dataclasses import dataclass
from pathlib import Path

import requests
import structlog

BASE_DIR = Path(__file__).resolve().parent
CERT_NAME = "cert.pem"


logger = structlog.get_logger(__name__)


@dataclass
class OAuthToken:
    access_token: str
    token_type: str
    scope: str
    expires_in: int


class EfiDial:
    def __init__(self) -> None:
        self.base_url = os.getenv("EFI_BASE_URL", None)
        self.client_id = os.getenv("EFI_CLIENT_ID", None)
        self.client_secret = os.getenv("EFI_CLIENT_SECRET", None)
        self.certificate = f"{BASE_DIR}/{CERT_NAME}"

    def authenticate(self):
        auth = base64.b64encode((f"{self.client_id}:{self.client_secret}").encode()).decode()

        url = f"{self.base_url}/oauth/token"
        payload = json.dumps({"grant_type": "client_credentials"})
        headers = {
            "Authorization": f"Basic {auth}",
            "Content-Type": "application/json",
        }

        resp = requests.post(url, headers=headers, data=payload, cert=self.certificate, timeout=5)

        if resp.status_code != 200:
            logger.error("Error on get oauth token", resp.json())
            raise Exception("Error on get oauth token")

        data = resp.json()

        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"{data['token_type']} {data['access_token']}",
        }

    def create_order_with_transaction_id(self, txid, payload):
        self.authenticate()

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
