package rest

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type UserService interface {
	Create(ctx context.Context, params internal.UserCreateParams) (internal.User, error)
	GetUserByEmail(ctx context.Context, email string) (internal.User, error)
}

type AuthService interface {
	SignUp(ctx context.Context, params internal.UserCreateParams) error
	ConfirmSignUp(ctx context.Context, email, confirmationCode string) error
	SignIn(ctx context.Context, params internal.UserSignInParams) (internal.UserToken, error)
}

type UserHandler struct {
	userService UserService
	authService AuthService
}

// NewUserHandler returns a new instance of a handler for managing user requests.
func NewUserHandler(userService UserService, authService AuthService) *UserHandler {
	return &UserHandler{userService: userService, authService: authService}
}

// Register connects the handlers to the router
func (h *UserHandler) Register(r *chi.Mux) {
	r.Post("/api/v1/auth/signup", h.signUp)
	r.Post("/api/v1/auth/signup-confirm", h.signUpConfirm)
	r.Post("/api/v1/auth/login", h.login)

	r.Group(func(r chi.Router) {
		r.Use(IsAuthenticated)
		r.Post("/api/v1/auth/logout", h.logout)
		// - Users
		r.Get("/api/v1/users/current", h.currentUser)
	})
}

// - SignUp

type User struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type SignUpRequest struct {
	Email         string `json:"email"`
	Username      string `json:"username"`
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	BirthDate     string `json:"birth_date"`
	Password      string `json:"password"`
	TermsAccepted bool   `json:"terms_accepted"`
}

type SignUpResponse struct {
	User User `json:"user"`
}

func (h *UserHandler) signUp(w http.ResponseWriter, r *http.Request) {
	var req SignUpRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	params := internal.UserCreateParams{
		Email:         req.Email,
		Username:      req.Username,
		Password:      req.Password,
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		BirthDate:     req.BirthDate,
		TermsAccepted: req.TermsAccepted,
	}
	if err := params.Validate(); err != nil {
		renderErrorResponse(w, r, "invalid request", err)
		return
	}

	err := h.authService.SignUp(r.Context(), params)
	if err != nil {
		renderErrorResponse(w, r, err.Error(), err)
		return
	}

	user, err := h.userService.Create(r.Context(), params)
	if err != nil {
		renderErrorResponse(w, r, err.Error(), err)
		return
	}

	renderResponse(w, r,
		&SignUpResponse{
			User: User{
				ID:        user.ID,
				Email:     user.Email,
				FirstName: user.FirstName,
				LastName:  user.LastName,
			},
		},
		http.StatusCreated)
}

// - SignUpConfirm

type SignUpConfirmRequest struct {
	Email            string `json:"email"`
	ConfirmationCode string `json:"confirmation_code"`
}

func (h *UserHandler) signUpConfirm(w http.ResponseWriter, r *http.Request) {
	var req SignUpConfirmRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	err := h.authService.ConfirmSignUp(r.Context(), req.Email, req.ConfirmationCode)
	if err != nil {
		renderErrorResponse(w, r, err.Error(), err)
		return
	}

	renderResponse(w, r, nil, http.StatusOK)
}

// - SignIn

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	AccessToken string `json:"access_token"`
	Exp         int64  `json:"exp"`
	User        User   `json:"user"`
}

func (h *UserHandler) login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	token, err := h.authService.SignIn(r.Context(), internal.UserSignInParams{
		Email:    req.Email,
		Password: req.Password,
	})

	if err != nil {
		render.Status(r, http.StatusUnauthorized)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	user, err := h.userService.GetUserByEmail(r.Context(), req.Email)
	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "user not found"})
		return
	}
	renderResponse(w, r, &LoginResponse{
		AccessToken: token.AccessToken,
		Exp:         24 * time.Hour.Milliseconds(),
		User: User{
			ID:        user.ID,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
		},
	}, http.StatusOK)
}

// - Me

type CurrentUserResponse struct {
	User User `json:"user"`
}

func (h *UserHandler) currentUser(w http.ResponseWriter, r *http.Request) {
	ureq := UserFromContext(r.Context())

	user, err := h.userService.GetUserByEmail(r.Context(), ureq.Email)
	if err != nil {
		render.Status(r, http.StatusNotFound)
		render.JSON(w, r, map[string]string{"error": "user not found"})
		return
	}

	renderResponse(w, r,
		&CurrentUserResponse{
			User: User{
				ID:        user.ID,
				Email:     user.Email,
				FirstName: user.FirstName,
				LastName:  user.LastName,
			},
		},
		http.StatusOK)
}

// -

func (h *UserHandler) logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "hx-jwt",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Now().Add(-24 * time.Hour),
	})

	renderResponse(w, r, nil, http.StatusNoContent)
}
