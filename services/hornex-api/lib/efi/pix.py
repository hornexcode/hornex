from lib.efi.client import Client


class PixPayment:
    def __init__(self) -> None:
        self.client = Client()

    def charge(self, txid, payload):
        order = self.client.create_order_with_transaction_id(txid, payload)
        qrcode = self.client.create_qrcode(order.get("loc").get("id"))
        return qrcode

    def list(self):
        return self.client.list_orders()
