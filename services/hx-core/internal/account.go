package internal

type LOLAccount struct {
	ID            string `json:"id"`
	UserID        string `json:"user_id"`
	AccountID     string `json:"account_id"`
	Region        string `json:"region"`
	Puuid         string `json:"puuid"`
	SummonerName  string `json:"summoner_name"`
	SummonerLevel int32  `json:"summoner_level"`
	ProfileIconID int32  `json:"profile_icon_id"`
	RevisionDate  int64  `json:"revision_date"`
	Verified      bool   `json:"verified"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}
