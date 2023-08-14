package internal

import "time"

type StatusType string

const (
	StatusTypePending  StatusType = "pending"
	StatusTypeAccepted StatusType = "accepted"
	StatusTypeDeclined StatusType = "declined"
)

type Invite struct {
	ID        string
	TeamID    string
	UserID    string
	Status    StatusType
	CreatedAt time.Time
	Team      *Team
	User      *User
}
