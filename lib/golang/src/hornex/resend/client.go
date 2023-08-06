package resend

import (
	"bytes"
	"fmt"
	"net/http"
	"os"
)

type Clientable interface {
	Send(from string, to string, message []byte) error
}

type Client struct {
}

func NewClient() *Client {
	return &Client{}
}

func (c *Client) Send(from string, to string, message []byte) error {
	url := "https://api.resend.com/emails"
	req, _ := http.NewRequest("POST", url, bytes.NewReader(message))
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+os.Getenv("RESEND_API_KEY"))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println(err)
	}
	defer res.Body.Close()

	return nil
}
