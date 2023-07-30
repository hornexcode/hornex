package rest

import (
	"context"
	"net/http"
	"strings"

	"github.com/go-chi/render"
	"hornex.gg/hornex/auth/cognito"
)

type UserRequest struct {
	Email string `json:"email"`
}
type userKey struct{}

func UserFromContext(ctx context.Context) *UserRequest {
	return ctx.Value(userKey{}).(*UserRequest)
}

func UserWithContext(ctx context.Context, user *UserRequest) context.Context {
	return context.WithValue(ctx, userKey{}, user)
}

func IsAuthorized(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		token = strings.Replace(token, "Bearer ", "", 1)

		if token == "" {
			render.Status(r, http.StatusUnauthorized)
			render.JSON(w, r, map[string]string{"error": "missing authorization header"})
			return
		}

		cognito := cognito.FromContext(r.Context())

		u, err := cognito.ProviderUser(token)
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
