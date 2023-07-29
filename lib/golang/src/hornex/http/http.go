package http

import (
	"net/http"
	"time"

	retryHttp "github.com/hashicorp/go-retryablehttp"
)

const genericTimeout = 2 * time.Second

type client interface {
	Do(req *http.Request) (*http.Response, error)
	Get(url string) (*http.Response, error)
}

var (
	Client            client
	ClientWithTimeout client
)

func init() {
	Client = &http.Client{}
	ClientWithTimeout = &http.Client{
		Timeout: genericTimeout,
	}
}

func NewRetryClient(retry int) client {
	rh := retryHttp.NewClient()
	rh.RetryMax = retry
	return rh.StandardClient()
}

func InvalidResponse(statusCode int) bool {
	return statusCode < http.StatusOK || statusCode >= http.StatusMultipleChoices
}
