# Gerar certificado e chave em único arquivo

openssl pkcs12 -in certificado.p12 -out certificado.pem -nodes -password pass:""

This code can be used inside http EfiDial to register the PIX key webhook:

```python
    def register_webhook(self, url):
        self.authenticate()
        uri = f"{self.base_url}/v2/webhook/{os.getenv('EFI_PIX_KEY')}"
        resp = requests.put(
            uri,
            headers={**self.headers, "x-skip-mtls-checking": "true"},
            cert=f"{BASE_DIR}/{CERT_NAME}",
            timeout=5,
            json={"webhookUrl": url},
        )

        if resp.status_code != 200:
            raise Exception("Error on registering webhook", resp.json())

        return resp.json()

    def get_webhooks(self):
        self.authenticate()
        uri = f"{self.base_url}/v2/webhook/{os.getenv('EFI_PIX_KEY')}"
        resp = requests.get(
            uri,
            headers=self.headers,
            cert=f"{BASE_DIR}/{CERT_NAME}",
            timeout=5,
        )

        if resp.status_code != 200:
            raise Exception("Error on fetching webhook", resp.json())

        return resp.json()


from lib.efi.http import EfiDial
efi = EfiDial()
efi.get_webhooks()
efi.register_webhook("https://feasible-thoroughly-flea.ngrok-free.app/v1/webhooks/efi/pix?hmac=f5f156101f6162341d1f536469bc0dfda3c27ac37569664b68429522aa692d65&ignorar=")
"""
```
