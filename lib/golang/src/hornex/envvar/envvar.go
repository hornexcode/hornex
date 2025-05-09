package envvar

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"hornex.gg/hornex/errors"
)

//go:generate counterfeiter -generate

//counterfeiter:generate -o envvartesting/provider.gen.go . Provider

// Provider ...
type Provider interface {
	Get(key string) (string, error)
}

// Configuration ...
type Configuration struct {
	provider Provider
}

// Load read the env filename and load it into ENV for this process.
func Load(filename string) error {
	if err := godotenv.Load(filename); err != nil {
		fmt.Println("Error loading .env file", err)
		return errors.NewErrorf(errors.ErrorCodeUnknown, "loading env var file")
	}

	return nil
}

// New ...
func New(provider Provider) *Configuration {
	return &Configuration{
		provider: provider,
	}
}

// Get returns the value from environment variable `<key>`. When an environment variable `<key>_SECURE` exists
// the provider is used for getting the value.
func (c *Configuration) Get(key string) (string, error) {
	res := os.Getenv(key)
	valSecret := os.Getenv(fmt.Sprintf("%s_SECURE", key))

	if valSecret != "" {
		valSecretRes, err := c.provider.Get(valSecret)
		if err != nil {
			return "", errors.WrapErrorf(err, errors.ErrorCodeInvalidArgument, "provider.Get")
		}

		res = valSecretRes
	}

	return res, nil
}
