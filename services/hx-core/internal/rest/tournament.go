package rest

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type TournamentService interface {
	Create(ctx context.Context, params internal.CreateTournamentParams) (internal.Tournament, error)
}

type TournamentHandler struct {
	tournamentService TournamentService
}

func NewTournamentHandler(tournamentService TournamentService) *TournamentHandler {
	return &TournamentHandler{
		tournamentService: tournamentService,
	}
}

func (h *TournamentHandler) Register(r *chi.Mux) {
	r.Group(func(r chi.Router) {
		verifier := jwtauth.New("HS256", []byte("secret"), nil)
		r.Use(jwtauth.Verifier(verifier))
		r.Use(jwtauth.Authenticator)
		r.Post("/api/v1/tournaments", h.create)
	})
}

type CreateTournamentRequest struct {
	Name        string `json:"name"`
	GameID      string `json:"game_id"`
	Description string `json:"description"`
	EntryFee    int    `json:"entry_fee"`
	PrizePool   int    `json:"prize_pool"`
	CreatedBy   string `json:"created_by"`
}

func (h *TournamentHandler) create(w http.ResponseWriter, r *http.Request) {
	var body CreateTournamentRequest

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	_, claims, _ := jwtauth.FromContext(r.Context())

	fmt.Printf(claims["first_name"].(string))
	// TODO: dá para colocar uma coluna no user `bool is_admin` e pegar aqui no `claims` para validação
}
