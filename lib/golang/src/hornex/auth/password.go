package auth

import "golang.org/x/crypto/bcrypt"

type Hasher struct{}

func (h *Hasher) Hash(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		panic(err)
	}
	return string(bytes)
}

func (h *Hasher) Check(password, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

func NewHasher() *Hasher {
	return &Hasher{}
}
