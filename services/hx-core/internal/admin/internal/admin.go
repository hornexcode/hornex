package internal

import "time"

type TournamentStatusType string

const (
	TournamentStatusTypeCreated   TournamentStatusType = "created"
	TournamentStatusTypeStarted   TournamentStatusType = "started"
	TournamentStatusTypeFinished  TournamentStatusType = "finished"
	TournamentStatusTypeCancelled TournamentStatusType = "cancelled"
)

type Tournament struct {
	ID              string               `json:"id"`
	Name            string               `json:"name"`
	GameID          string               `json:"game_id"`
	Description     string               `json:"description"`
	EntryFee        int32                `json:"entry_fee"`
	PrizePool       int32                `json:"prize_pool"`
	IsActive        bool                 `json:"is_active"`
	Status          TournamentStatusType `json:"status"`
	StartTime       time.Time            `json:"start_time"`
	EndTime         time.Time            `json:"end_time"`
	MaxParticipants int32                `json:"max_participants"`
	CreatedBy       string               `json:"created_by"`
	CreatedAt       time.Time            `json:"created_at"`
	UpdatedAt       time.Time            `json:"updated_at"`
}
