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
	r.Group(func(r chi.Router) {
		// TODO: create a new lib for handling authentication
		verifier := jwtauth.New("HS256", []byte("secret"), nil)
		r.Use(jwtauth.Verifier(verifier))
		r.Use(jwtauth.Authenticator)
		r.Post("/api/v1/teams", h.create)
		// r.Patch("/api/v1/teams", h.update)
	})
}

// -

type Team struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type CreateTeamRequest struct {
	Name string `json:"name"`
}

type CreateTeamResponse struct {
	Team Team `json:"team"`
}

func (h *TeamHandler) create(w http.ResponseWriter, r *http.Request) {
	var req CreateTeamRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	// TODO: handle error if claims is nil
	_, claims, _ := jwtauth.FromContext(r.Context())

	team, err := h.teamService.Create(r.Context(), internal.TeamCreateParams{
		Name:    req.Name,
		OwnerID: claims["id"].(string),
	})

	if err != nil {
		renderErrorResponse(w, r, "failed to create team", err)
		return
	}

	renderResponse(w, r, &CreateTeamResponse{
		Team: Team{
			ID:   team.ID,
			Name: team.Name,
		},
	}, http.StatusCreated)
}

// -

type UpdateTeamRequest struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type UpdateTeamResponse struct {
	Team Team `json:"team"`
}

// func (h *TeamHandler) update(w http.ResponseWriter, r *http.Request) {
// 	var req UpdateTeamRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		renderErrorResponse(w, r, "invalid request",
// 			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

// 		return
// 	}

// 	user := UserFromContext(r.Context())
// 	team := h.teamService.FindByName(r.Context(), req.Name)
// 	if team.OwnerID != user.ID {
// 		renderErrorResponse(w, r, "unauthorized", errors.NewErrorf(errors.ErrorCodePermissionDenied, "unauthorized"))
// 		return
// 	}

// 	_, err := h.teamService.Update(r.Context(), req.ID, internal.TeamUpdateParams{
// 		Name: req.Name,
// 	})

// }
