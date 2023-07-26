package rest

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/pedrosantosbr/x5/internal"
	"github.com/pedrosantosbr/x5/internal/services"
)

type UserService interface {
	Create(ctx context.Context, params services.UserCreateParams) (internal.User, error)
}

type UserHandler struct {
	svc UserService
}

// NewUserHandler returns a new instance of a handler for managing user requests.
func NewUserHandler(svc UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

// Register connects the handlers to the router
func (h *UserHandler) Register(r *chi.Mux) {
	r.Post("/api/users", h.create)
}

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// CreateUserRequest defines the request used for creating users.
type CreateUserRequest struct {
	Email         string `json:"email"`
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	DateOfBirth   string `json:"date_of_birth"`
	Password      string `json:"password"`
	TermsAccepted bool   `json:"terms_accepted"`
}

// CreateUserResponse defines the response returned by the create user endpoint.
type CreateUserResponse struct {
	User User `json:"user"`
}

func (h *UserHandler) create(w http.ResponseWriter, r *http.Request) {
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			internal.WrapErrorf(err, internal.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	dob, err := time.Parse("2006-01-02", req.DateOfBirth)
	if err != nil {
		renderErrorResponse(w, r, "invalid request",
			internal.WrapErrorf(err, internal.ErrorCodeInvalidArgument, "time.Parse"))

		return
	}

	user, err := h.svc.Create(r.Context(), services.UserCreateParams{
		Email:         req.Email,
		Password:      req.Password,
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		DateOfBirth:   dob,
		TermsAccepted: req.TermsAccepted,
	})

	if err != nil {
		renderErrorResponse(w, r, "create failed", err)
		return
	}

	renderResponse(w, r,
		&CreateUserResponse{
			User: User{
				ID:        user.ID,
				Email:     user.Email,
				FirstName: user.FirstName,
				LastName:  user.LastName,
				CreatedAt: user.CreatedAt,
				UpdatedAt: user.UpdatedAt,
			},
		},
		http.StatusCreated)
}
