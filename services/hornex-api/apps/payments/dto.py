from dataclasses import dataclass


@dataclass
class RegistrationPaymentDTO:
    id: str
    amount: float
    cpf: str
    name: str
