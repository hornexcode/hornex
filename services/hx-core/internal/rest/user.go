package rest

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type UserService interface {
	RegisterNewUser(ctx context.Context, params internal.UserCreateParams) (internal.User, error)
	SignIn(ctx context.Context, params internal.UserSignInParams) (internal.UserToken, error)
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
	r.Post("/api/v1/users/register", h.register)
}

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// RegisterUser defines the request used for creating users.
type RegisterUserRequest struct {
	Email         string `json:"email"`
	Username      string `json:"username"`
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	BirthDate     string `json:"birth_date"`
	Password      string `json:"password"`
	TermsAccepted bool   `json:"terms_accepted"`
}

// CreateUserResponse defines the response returned by the create user endpoint.
type CreateUserResponse struct {
	User User `json:"user"`
}

func (h *UserHandler) register(w http.ResponseWriter, r *http.Request) {
	var req RegisterUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	dob, err := time.Parse("2006-01-02", req.BirthDate)
	if err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "time.Parse"))

		return
	}

	user, err := h.svc.RegisterNewUser(r.Context(), internal.UserCreateParams{
		Email:         req.Email,
		Username:      req.Username,
		Password:      req.Password,
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		BirthDate:     dob,
		TermsAccepted: req.TermsAccepted,
	})

	if err != nil {
		renderErrorResponse(w, r, err.Error(), err)
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

// SignInRequest defines the request used for signing in users.
type SignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
