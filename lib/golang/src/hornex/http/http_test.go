package http

import (
	"bytes"
	"errors"
	"io"
	"net/http"
	"reflect"
	"testing"

	retryHttp "github.com/hashicorp/go-retryablehttp"
)

func TestHttpClient(t *testing.T) {

	t.Run("TestHttpNewRetryClient", func(t *testing.T) {
		expected := retryHttp.NewClient()
		expected.RetryMax = 2

		actual := NewRetryClient(2)

		if reflect.TypeOf(actual) != reflect.TypeOf(expected.StandardClient()) {
			t.Error("Response does not implement HttpClient interface")
		}
	})

	t.Run("TestMockHttpNewRetryClient", func(t *testing.T) {
		mockClient := &MockClient{}

		actual := mockClient.NewRetryClient(2)

		if reflect.TypeOf(actual) != reflect.TypeOf(mockClient) {
			t.Error("Response does not implement HttpClient interface")
		}
	})

	t.Run("TestMockHttpDo", func(t *testing.T) {
		Client = &MockClient{}

		rsp := &http.Response{StatusCode: 200, Body: io.NopCloser(bytes.NewBufferString("ok"))}
		req := &http.Request{}

		GetDoFunc = func(*http.Request) (*http.Response, error) {
			return rsp, nil
		}

		actual, _ := Client.Do(req)

		if !errors.Is(actual.Body.Close(), rsp.Body.Close()) {
			t.Errorf("expected: %v. But got: %v", rsp, actual)
		}

	})

	t.Run("TestMockHttpGet", func(t *testing.T) {
		Client = &MockClient{}

		rsp := &http.Response{StatusCode: 200, Body: io.NopCloser(bytes.NewBufferString("ok"))}
		url := "https://test.com"

		MockGetFunc = func(string) (*http.Response, error) {
			return rsp, nil
		}

		actual, _ := Client.Get(url)

		if !errors.Is(actual.Body.Close(), rsp.Body.Close()) {
			t.Errorf("expected: %v. But got: %v", rsp, actual)
		}

	})

	t.Run("TestHttpInvalidResponse", func(t *testing.T) {
		for _, test := range []struct {
			name     string
			code     int
			expected bool
		}{{
			name:     "Returns false if status < 200",
			code:     180,
			expected: true,
		}, {
			name:     "Returns false if status > 300",
			code:     220,
			expected: false,
		}, {
			name:     "Returns true if status = 2xx",
			code:     400,
			expected: true,
		}} {
			t.Run(test.name, func(t *testing.T) {
				actual := InvalidResponse(test.code)
				if actual != test.expected {
					t.Errorf("Expected: %v. But got: %v", test.expected, actual)
				}
			})
		}
	})
}
