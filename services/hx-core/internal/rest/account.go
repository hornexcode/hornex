package rest

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"hornex.gg/hx-core/internal"
)

type LOLAccountService interface {
	Create(ctx context.Context, params internal.LOLAccount) (internal.LOLAccount, error)
}

type LOLAccountHandler struct {
	service LOLAccountService
}

func NewLOLAccountHandler() *LOLAccountHandler {
	return &LOLAccountHandler{
		// service: service,
	}
}

func (h *LOLAccountHandler) Register(r *chi.Mux) {
	r.Group(func(r chi.Router) {
		// TODO: create a new lib for handling authentication
		verifier := jwtauth.New("HS256", []byte("secret"), nil)
		r.Use(jwtauth.Verifier(verifier))
		r.Use(jwtauth.Authenticator)
		r.Get("/api/v1/lol/summoner/search", h.search)
		r.Post("/api/v1/lol/summoner/connect", h.search)
	})
}

type ConnectLOLAccountRequest struct {
	Region    string `json:"region"`
	AccountId string `json:"account_id"`
}

type SearchSummonerRequest struct {
	Region       string `json:"region"`
	SummonerName string `json:"summoner_name"`
}

type APILOLSummonerResponse struct {
	ID            string `json:"id"`
	AccountID     string `json:"accountId"`
	Puuid         string `json:"puuid"`
	Name          string `json:"name"`
	ProfileIconID int    `json:"profileIconId"`
	RevisionDate  int    `json:"revisionDate"`
	SummonerLevel int    `json:"summonerLevel"`
}

func (h *LOLAccountHandler) search(w http.ResponseWriter, r *http.Request) {

	summonerName := r.URL.Query().Get("summoner_name")
	region := r.URL.Query().Get("region")

	if summonerName == "" || region == "" {
		renderErrorResponse(w, r, "invalid request", errors.New("invalid request"))
		return
	}

	url := fmt.Sprintf("https://%s.api.riotgames.com/lol/summoner/v4/summoners/by-name/%s?api_key=%s", region, summonerName, os.Getenv("RIOT_API_KEY"))

	fmt.Println(url)
	req, _ := http.NewRequest("GET", url, bytes.NewReader(nil))
	req.Header.Add("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("error", err)
	}
	defer res.Body.Close()

	var summoner APILOLSummonerResponse
	if err := json.NewDecoder(res.Body).Decode(&summoner); err != nil {
		fmt.Println("error", err)
	}

	fmt.Println(summoner)

	renderResponse(w, r, summoner, http.StatusOK)
}
