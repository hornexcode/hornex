package rest

import (
	"context"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/go-chi/render"
	"hornex.gg/hx-core/internal"
)

type GameService interface {
	Find(ctx context.Context, id string) (*internal.Game, error)
	List(ctx context.Context) (*[]internal.Game, error)
}

type GameHandler struct {
	gameService GameService
}

func NewGameHandler(gameService GameService) *GameHandler {
	return &GameHandler{
		gameService: gameService,
	}
}

func (h *GameHandler) Register(r *chi.Mux) {
	r.Group(func(r chi.Router) {
		verifier := jwtauth.New("HS256", []byte("secret"), nil)
		r.Use(jwtauth.Verifier(verifier))
		r.Use(jwtauth.Authenticator)
		r.Get("/api/v1/games/{id}", h.find)
		r.Get("/api/v1/games", h.list)
	})
}

type Game struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type FindGameResponse struct {
	Game Game `json:"game"`
}

func (g *GameHandler) find(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	game, err := g.gameService.Find(r.Context(), id)

	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "game not found"})
		return
	}

	renderResponse(w, r,
		&FindGameResponse{
			Game: Game{
				ID:   game.ID,
				Name: game.Name,
				Slug: game.Slug,
			},
		},
		http.StatusOK)
}

func (g *GameHandler) list(w http.ResponseWriter, r *http.Request) {
	games, err := g.gameService.List(r.Context())

	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "games not found"})
		return
	}

	var gamesResponse []Game

	for _, game := range *games {
		gamesResponse = append(gamesResponse, Game{
			ID:   game.ID,
			Name: game.Name,
			Slug: game.Slug,
		})
	}

	renderResponse(w, r, gamesResponse, http.StatusOK)
}
