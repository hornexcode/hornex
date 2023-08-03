package rest

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-chi/render"
	"hornex.gg/hornex/auth/cognito"
)

type UserRequest struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

type userKey struct{}

func UserFromContext(ctx context.Context) *UserRequest {
	return ctx.Value(userKey{}).(*UserRequest)
}

func UserWithContext(ctx context.Context, user *UserRequest) context.Context {
	return context.WithValue(ctx, userKey{}, user)
}

func IsAuthenticated(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO: check if the user is authenticated by checking the token in the request Header and Cookies
		fmt.Println("Cookies :", r.Cookies())
		token := tokenFromHeader(r)
		accessToken := strings.Split(token, "Bearer ")[1]

		fmt.Println("token: ", accessToken)

		if accessToken == "" {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, map[string]string{"error": "missing authorization header"})
			return
		}

		cognito := cognito.FromContext(r.Context())

		u, err := cognito.ProviderUser(accessToken)
		if err != nil {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, map[string]string{"error": err.Error()})
			return
		}

		ctx := r.Context()
		ctx = UserWithContext(ctx, &UserRequest{
			Email: u.Email,
		})

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// -

func tokenFromCookie(r *http.Request) string {
	cookie, err := r.Cookie("hx-jwt")
	if err != nil {
		return ""
	}
	return cookie.Value
}

func tokenFromHeader(r *http.Request) string {
	return r.Header.Get("Authorization")
}
