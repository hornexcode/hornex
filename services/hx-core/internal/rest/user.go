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
	Create(ctx context.Context, params internal.UserCreateParams) (internal.User, error)
}

type AuthService interface {
	SignUp(ctx context.Context, params internal.UserCreateParams) error
	ConfirmSignUp(ctx context.Context, email, confirmationCode string) error
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
	r.Post("/api/v1/users/signup", h.signUp)
	r.Post("/api/v1/users/signup-confirm", h.signUpConfirm)
}

// - SignUp

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
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

	dob, err := time.Parse("2006-01-02", req.BirthDate)
	if err != nil {
		renderErrorResponse(w, r, "invalid request",
			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "time.Parse"))

		return
	}

	params := internal.UserCreateParams{
		Email:         req.Email,
		Username:      req.Username,
		Password:      req.Password,
		FirstName:     req.FirstName,
		LastName:      req.LastName,
		BirthDate:     dob,
		TermsAccepted: req.TermsAccepted,
	}
	if err := params.Validate(); err != nil {
		renderErrorResponse(w, r, "invalid request", err)
		return
	}

	err = h.authService.SignUp(r.Context(), params)
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
				CreatedAt: user.CreatedAt,
				UpdatedAt: user.UpdatedAt,
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

// func (h *UserHandler) signIn(w http.ResponseWriter, r *http.Request) {
// 	var req SignInRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		renderErrorResponse(w, r, "invalid request",
// 			errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "json decoder"))

// 		return
// 	}
// 	defer r.Body.Close()

// 	token, err := h.svc.SignIn(r.Context(), internal.UserSignInParams{
// 		Email:    req.Email,
// 		Password: req.Password,
// 	})

// 	if err != nil {
// 		renderErrorResponse(w, r, err.Error(), err)
// 		return
// 	}

// 	http.SetCookie(w, &http.Cookie{
// 		Name:    "hx-access-token",
// 		Value:   token.AccessToken,
// 		Path:    "/",
// 		Expires: time.Now().Add(24 * time.Hour),
// 	})

// 	renderResponse(w, r, nil, http.StatusOK)
// }

// SignInRequest defines the request used for signing in users.
type SignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
