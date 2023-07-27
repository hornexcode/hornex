package envvar

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"hornex.gg/hornex/errors"
)

//go:generate counterfeiter -generate

//counterfeiter:generate -o envvartesting/provider.gen.go . Provider

// Configuration ...
type Configuration struct {
}

// Load read the env filename and load it into ENV for this process.
func Load(filename string) error {
	fmt.Println("Loading env vars from", filename)

	if err := godotenv.Load(filename); err != nil {
		fmt.Println("Error loading env var file", err)
		return errors.NewErrorf(errors.ErrorCodeUnknown, "loading env var file")
	}

	return nil
}

// New ...
func New() *Configuration {
	return &Configuration{}
}

func (c *Configuration) Get(key string) string {
	res := os.Getenv(key)
	if res == "" {
		log.Fatalf("Couldn't get configuration value for %s", key)
	}

	return res
}
