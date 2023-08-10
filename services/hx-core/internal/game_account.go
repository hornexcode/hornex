package internal

type LOLAccount struct {
	ID            string `json:"id"`
	UserID        string `json:"user_id"`
	AccountId     string `json:"account_id"`
	Region        string `json:"region"`
	PUUID         string `json:"puuid"`
	SummonerName  string `json:"summoner_name"`
	SummonerLevel int    `json:"summoner_level"`
	ProfileIconId int    `json:"profile_icon_id"`
	RevisionDate  int    `json:"revision_date"`
	Verified      bool   `json:"verified"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}
