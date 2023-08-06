package rest

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth/v5"
	"github.com/go-chi/render"
	"hornex.gg/hornex/errors"
	"hornex.gg/hx-core/internal"
)

type UserService interface {
	SignUp(ctx context.Context, params internal.UserCreateParams) (*internal.User, error)
	ConfirmSignUp(ctx context.Context, email, confirmationCode string) error
	Login(ctx context.Context, email, password string) (string, error)
	GetUserById(ctx context.Context, email string) (internal.User, error)
}

type UserHandler struct {
	userService UserService
}

// NewUserHandler returns a new instance of a handler for managing user requests.
func NewUserHandler(userService UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

// Register connects the handlers to the router
func (h *UserHandler) Register(r *chi.Mux) {
	r.Post("/api/v1/auth/signup", h.signUp)
	r.Post("/api/v1/auth/signup-confirm", h.signUpConfirm)
	r.Post("/api/v1/auth/login", h.login)

	r.Group(func(r chi.Router) {
		verifier := jwtauth.New("HS256", []byte("secret"), nil)
		r.Use(jwtauth.Verifier(verifier))
		r.Use(jwtauth.Authenticator)

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

	user, err := h.userService.SignUp(r.Context(), params)
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

	err := h.userService.ConfirmSignUp(r.Context(), req.Email, req.ConfirmationCode)
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
}

func (h *UserHandler) login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

		return
	}
	defer r.Body.Close()

	at, err := h.userService.Login(r.Context(), req.Email, req.Password)

	if err != nil {
		render.Status(r, http.StatusUnauthorized)
		render.JSON(w, r, map[string]string{"error": err.Error()})
		return
	}

	renderResponse(w, r, &LoginResponse{AccessToken: at}, http.StatusOK)
}

// - CurrentUser
type CurrentUserResponse struct {
	User User `json:"user"`
}

func (h *UserHandler) currentUser(w http.ResponseWriter, r *http.Request) {

	_, claims, _ := jwtauth.FromContext(r.Context())

	user, err := h.userService.GetUserById(r.Context(), claims["id"].(string))
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
