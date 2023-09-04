package http

import (
	"net/http"
)

type MockClient struct {
	DoFunc func(req *http.Request) (*http.Response, error)
}

var (
	GetDoFunc   func(req *http.Request) (*http.Response, error)
	MockGetFunc func(url string) (*http.Response, error)
)

func (m *MockClient) Do(req *http.Request) (*http.Response, error) {
	return GetDoFunc(req)
}
func (m *MockClient) Get(url string) (*http.Response, error) {
	return MockGetFunc(url)
}
func (m *MockClient) NewRetryClient(_ int) client {
	return &MockClient{}
}

type MockClientError struct {
}

func (e MockClientError) Timeout() bool {
	return true
}
func (e MockClientError) Error() string {
	return ""
}
