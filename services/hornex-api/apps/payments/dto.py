from dataclasses import dataclass


@dataclass
class RegistrationPaymentDTO:
    id: str
    amount: int
    email: str  # used for stripe
    credit_card: int = None  # used for stripe
    cpf: str = None  # used for pix
    name: str = None  # used for pix
