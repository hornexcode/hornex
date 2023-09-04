package auth

import (
	"time"

	jwt "github.com/golang-jwt/jwt"
)

var secretKey = "secret"

type JWTData struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	jwt.StandardClaims
}

func GenerateJWTAccessToken(id, email, firstName, lastName string) (string, error) {
	claims := JWTData{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
		},
		ID:        id,
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secretKey))
}
