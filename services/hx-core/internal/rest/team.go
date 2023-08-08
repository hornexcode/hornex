package rest

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/go-chi/render"
	"github.com/google/uuid"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type TeamService interface {
	Create(ctx context.Context, params internal.TeamCreateParams) (internal.Team, error)
	Find(ctx context.Context, id string) (*internal.Team, error)
	Update(ctx context.Context, id string, params internal.TeamUpdateParams) (*internal.Team, error)
	// List(ctx context.Context) (*[]internal.Team, error)
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
		r.Get("/api/v1/teams/{id}", h.find)
		r.Get("/api/v1/teams", h.list)
		r.Patch("/api/v1/teams/{id}", h.update)
	})
}

// -

type Team struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	CreatedBy string `json:"created_by"`
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
		Name:      req.Name,
		CreatedBy: claims["id"].(string),
	})

	if err != nil {
		renderErrorResponse(w, r, err.Error(), err)
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
	Name string `json:"name"`
}

type UpdateTeamResponse struct {
	Team Team `json:"team"`
}

func (h *TeamHandler) update(w http.ResponseWriter, r *http.Request) {
	var req UpdateTeamRequest

	id := chi.URLParam(r, "id")

	_, err := h.teamService.Find(r.Context(), id)

	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "team not found"})
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	// TODO: check if user is the team creator
	/*accessToken := strings.Split(r.Header.Get("Authorization"), "Bearer ")[1]

	cognito := cognito.FromContext(r.Context())

	u, err := cognito.ProviderUser(accessToken)

	fmt.Printf("User: %v", u)


		fmt.Printf("USER: %v", u)

		if team.CreatedBy != u.Email {
			renderErrorResponse(w, r, "unauthorized", errors.NewErrorf(http.StatusUnauthorized, "unauthorized"))
			return
		} */

	upTeam, err := h.teamService.Update(r.Context(), id, internal.TeamUpdateParams{
		Name: req.Name,
	})

	if err != nil {
		renderErrorResponse(w, r, "could not update", errors.NewErrorf(http.StatusBadRequest, "bad request"))
	}

	renderResponse(w, r,
		&UpdateTeamResponse{
			Team: Team{
				Name:      upTeam.Name,
				ID:        upTeam.ID,
				CreatedBy: upTeam.CreatedBy,
			},
		},
		http.StatusOK)
}

type FindTeamResponse struct {
	Team Team `json:"team"`
}

func (t *TeamHandler) find(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	team, err := t.teamService.Find(r.Context(), id)

	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "team not found"})
		return
	}

	renderResponse(w, r,

		&FindTeamResponse{
			Team: Team{
				ID:        team.ID,
				Name:      team.Name,
				CreatedBy: team.CreatedBy,
			},
		},
		http.StatusOK)
}

type MockedTeam struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type ListTeamsResponse struct {
	Teams []MockedTeam `json:"teams"`
}

func (t *TeamHandler) list(w http.ResponseWriter, r *http.Request) {

	// TODO : Implement METHOD

	teams := []MockedTeam{
		{
			ID:    uuid.NewString(),
			Name:  "HX Hornex",
			Image: "https://dvm9jp3urcf0o.cloudfront.net/logo-ideas/esports-logos/archer.png",
		},
		{
			ID:    uuid.NewString(),
			Name:  "HX Hornex",
			Image: "https://dvm9jp3urcf0o.cloudfront.net/logo-ideas/esports-logos/archer.png",
		},
		{
			ID:    uuid.NewString(),
			Name:  "HX Hornex",
			Image: "https://dvm9jp3urcf0o.cloudfront.net/logo-ideas/esports-logos/archer.png",
		},
		{
			ID:    uuid.NewString(),
			Name:  "HX Hornex",
			Image: "https://dvm9jp3urcf0o.cloudfront.net/logo-ideas/esports-logos/archer.png",
		},
	}

	renderResponse(w, r,

		&ListTeamsResponse{
			Teams: teams,
		},
		http.StatusOK)
}
