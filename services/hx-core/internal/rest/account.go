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
	Create(ctx context.Context, params internal.LOLAccountCreateParams) (*internal.LOLAccount, error)
}

type LOLAccountHandler struct {
	lolAccountService LOLAccountService
}

func NewLOLAccountHandler(lolAccountService LOLAccountService) *LOLAccountHandler {
	return &LOLAccountHandler{
		lolAccountService: lolAccountService,
	}
}

func (h *LOLAccountHandler) Register(r *chi.Mux) {
	r.Group(func(r chi.Router) {
		// TODO: create a new lib for handling authentication
		verifier := jwtauth.New("HS256", []byte("secret"), nil)
		r.Use(jwtauth.Verifier(verifier))
		r.Use(jwtauth.Authenticator)
		r.Get("/api/v1/lol/summoner/search", h.search)
		r.Post("/api/v1/lol/summoner/connect", h.create)
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

type CreateAccountRequest struct {
	ID            string `json:"id"`
	AccountID     string `json:"accountId"`
	Region        string `json:"region"`
	Puuid         string `json:"puuid"`
	Name          string `json:"name"`
	SummonerLevel int32  `json:"summonerLevel"`
	ProfileIconID int32  `json:"profileIconId"`
	RevisionDate  int64  `json:"revisionDate"`
}

type CreateAccountResponse struct {
	Region        string `json:"region"`
	Puuid         string `json:"puuid"`
	SummonerName  string `json:"summoner_name"`
	SummonerLevel int32  `json:"summoner_level"`
	ProfileIconID int32  `json:"profile_icon_id"`
	RevisionDate  int64  `json:"revision_date"`
}

func (h *LOLAccountHandler) create(w http.ResponseWriter, r *http.Request) {
	var summoner CreateAccountRequest

	if err := json.NewDecoder(r.Body).Decode(&summoner); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.New("json decoder"))

		return
	}
	defer r.Body.Close()

	url := fmt.Sprintf("https://%s.api.riotgames.com/lol/summoner/v4/summoners/by-name/%s?api_key=%s", summoner.Region, summoner.Name, os.Getenv("RIOT_API_KEY"))

	req, _ := http.NewRequest("GET", url, bytes.NewReader(nil))
	req.Header.Add("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		renderErrorResponse(w, r, "no summoner", errors.New("invalid request"))
		return
	}
	defer res.Body.Close()

	var exists APILOLSummonerResponse
	if err := json.NewDecoder(res.Body).Decode(&exists); err != nil {
		renderErrorResponse(w, r, "decoder", errors.New("failed to decode"))
		return
	}

	if exists.Puuid != summoner.Puuid {
		renderErrorResponse(w, r, "Invalid summoner name or region", errors.New("Summoner does not exist"))
		return
	}

	_, claims, _ := jwtauth.FromContext(r.Context())

	account, err := h.lolAccountService.Create(r.Context(), internal.LOLAccountCreateParams{
		ID:            summoner.ID,
		UserID:        claims["id"].(string),
		AccountID:     summoner.AccountID,
		Region:        summoner.Region,
		Puuid:         summoner.Puuid,
		SummonerName:  summoner.Name,
		SummonerLevel: summoner.SummonerLevel,
		ProfileIconID: summoner.ProfileIconID,
		RevisionDate:  summoner.RevisionDate,
	})

	if err != nil {
		renderErrorResponse(w, r, err.Error(), err)
		return
	}

	renderResponse(w, r, CreateAccountResponse{
		Region:        account.Region,
		Puuid:         account.Puuid,
		SummonerName:  account.SummonerName,
		SummonerLevel: account.SummonerLevel,
		ProfileIconID: account.ProfileIconID,
		RevisionDate:  account.RevisionDate,
	}, http.StatusCreated)
}
