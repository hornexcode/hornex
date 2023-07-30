package internal

type Team struct {
	ID      string `json:"id"`
	OwnerID string `json:"owner_id"`
	Name    string `json:"name"`
	Members []User `json:"members"`
}

type Member struct {
	ID     string `json:"id"`
	UserID string `json:"user_id"`
	TeamID string `json:"team_id"`
}
