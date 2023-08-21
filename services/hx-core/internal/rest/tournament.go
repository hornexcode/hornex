package rest

import (
	"context"
	"encoding/json"
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
	EntryFee    int32  `json:"entry_fee"`
	PrizePool   int32  `json:"prize_pool"`
	DueDate     string `json:"due_date"`
}

type CreateTournamentResponse struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	CreatedAt string `json:"created_at"`
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

	// TODO: coluna `bool | is_admin` em users
	/* if !claims["is_admin"].(bool) {
		render.Status(r, http.StatusForbidden)
		render.JSON(w, r, map[string]string{"error": "user is not admin"})
	} */

	tournament, err := h.tournamentService.Create(r.Context(), internal.CreateTournamentParams{
		Name:        body.Name,
		GameID:      body.GameID,
		Description: body.Description,
		EntryFee:    body.EntryFee,
		PrizePool:   body.PrizePool,
		CreatedBy:   claims["id"].(string),
		DueDate:     body.DueDate,
	})

	if err != nil {
		renderErrorResponse(w, r, err.Error(), err)
		return
	}

	renderResponse(w, r, &CreateTournamentResponse{
		ID:        tournament.ID,
		Name:      tournament.Name,
		CreatedAt: tournament.CreatedAt.String(),
	}, http.StatusCreated)
}
