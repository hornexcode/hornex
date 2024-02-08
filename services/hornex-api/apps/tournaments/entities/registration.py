from dataclasses import dataclass


@dataclass
class Registration:
    id: str
    tournament_id: int
    user_id: int
    created_at: int
    updated_at: int
    deleted_at: int
    status: str
    payment_status: str
