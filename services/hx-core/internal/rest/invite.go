package rest

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/go-chi/render"
	"hornex.gg/hornex/errors"
)

type InviteService interface {
	Create(ctx context.Context, memberEmail, teamId, invitedBy string) error
	Accept(ctx context.Context, inviteId, userId string) error
	Decline(ctx context.Context, inviteId, userId string) error
}

type InviteHandler struct {
	inviteService InviteService
}

func NewInviteHandler(inviteService InviteService) *InviteHandler {
	return &InviteHandler{
		inviteService: inviteService,
	}
}

func (h *InviteHandler) Register(r *chi.Mux) {
	r.Group(func(r chi.Router) {
		verifier := jwtauth.New("HS256", []byte("secret"), nil)
		r.Use(jwtauth.Verifier(verifier))
		r.Use(jwtauth.Authenticator)

		r.Post("/api/v1/invites", h.create)
		r.Get("/api/v1/invites/{id}/accept", h.accept)
		r.Get("/api/v1/invites/{id}/decline", h.decline)
	})
}

type InviteMemberRequest struct {
	TeamID string `json:"team_id"`
	Email  string `json:"email"`
}

func (i *InviteHandler) create(w http.ResponseWriter, r *http.Request) {
	var req InviteMemberRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))
		return
	}
	defer r.Body.Close()

	_, claims, _ := jwtauth.FromContext(r.Context())

	err := i.inviteService.Create(r.Context(), req.Email, req.TeamID, claims["id"].(string))
	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "could not invite member"})
		return
	}

	renderResponse(w, r, nil, http.StatusOK)
}

func (i *InviteHandler) accept(w http.ResponseWriter, r *http.Request) {
	_, claims, _ := jwtauth.FromContext(r.Context())

	inviteID := chi.URLParam(r, "id")

	err := i.inviteService.Accept(r.Context(), inviteID, claims["id"].(string))
	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "could not accept invite"})
		return
	}

	renderResponse(w, r, nil, http.StatusOK)
}

func (i *InviteHandler) decline(w http.ResponseWriter, r *http.Request) {
	_, claims, _ := jwtauth.FromContext(r.Context())

	inviteID := chi.URLParam(r, "id")

	err := i.inviteService.Decline(r.Context(), inviteID, claims["id"].(string))
	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "could not accept invite"})
		return
	}

	renderResponse(w, r, nil, http.StatusOK)
}
