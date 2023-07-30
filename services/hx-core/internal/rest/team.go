package rest

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type TeamService interface {
	Create(ctx context.Context, params internal.TeamCreateParams) (internal.Team, error)
}

type TeamHandler struct {
	teamService TeamService
}

func NewTeamHandler(teamService TeamService) *TeamHandler {
	return &TeamHandler{
		teamService: teamService,
	}
}

func (h *TeamHandler) Register(r *chi.Mux) {
	r.Post("/api/v1/teams", h.create)
}

// -

type CreateTeamRequest struct {
	Name string `json:"name"`
}

func (h *TeamHandler) create(w http.ResponseWriter, r *http.Request) {
	var req CreateTeamRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	team, err := h.teamService.Create(r.Context(), internal.TeamCreateParams{
		Name: req.Name,
	})

	if err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}

	renderResponse(w, r, team, http.StatusOK)
}
