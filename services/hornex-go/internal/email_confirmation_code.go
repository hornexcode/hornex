package internal

import (
	"math/rand"
	"strconv"
	"time"
)

const (
	verificationCodeLength = 6
	minVerificationCode    = 100000
	maxVerificationCode    = 999999
)

type EmailConfirmationCode struct {
	Email            string    `json:"email"`
	ConfirmationCode string    `json:"confirmation_code"`
	CreatedAt        time.Time `json:"created_at"`
}

func NewEmailConfirmationCode(email string) *EmailConfirmationCode {
	return &EmailConfirmationCode{
		Email:            email,
		ConfirmationCode: strconv.Itoa(generateConfirmationCode()),
		CreatedAt:        time.Now(),
	}
}

func generateConfirmationCode() int {
	return rand.Intn(maxVerificationCode-minVerificationCode+1) + minVerificationCode
}
