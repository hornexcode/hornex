package internal

import "time"

type InviteStatusType string

const (
	InviteStatusTypePending  InviteStatusType = "pending"
	InviteStatusTypeAccepted InviteStatusType = "accepted"
	InviteStatusTypeDeclined InviteStatusType = "declined"
)

type Invite struct {
	ID        string
	TeamID    string
	UserID    string
	Status    InviteStatusType
	CreatedAt time.Time
	Team      *Team
	User      *User
}
