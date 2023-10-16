package rest_test

// Feature tests for the user resource.

import (
	"context"
	"testing"

	"hornex.gg/hx-core/internal"
)

type UserServiceInMemory struct {
}

func (u *UserServiceInMemory) SignUp(ctx context.Context, params internal.UserCreateParams) (internal.User, string, error) {
	return internal.User{}, "", nil
}

// Test<Name>_<HTTP_VERB>
func TestSignUp_POST(t *testing.T) {
	t.Parallel()

	type output struct {
		expectedStatusCode int
		expectedBody       interface{}
		target             interface{}
	}

}
