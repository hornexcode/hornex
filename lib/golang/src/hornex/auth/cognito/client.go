package cognito

import (
	"context"
	"crypto/rsa"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/golang-jwt/jwt"
	"hornex.gg/hornex/auth"
	"hornex.gg/hornex/envvar"
	rest "hornex.gg/hornex/http"
)

type Client struct {
	cognitoAuthClient *cognitoidentityprovider.CognitoIdentityProvider
}

type clientKey struct{}

var (
	Parse           = jwt.Parse
	ParseWithClaims = jwt.ParseWithClaims
	userPoolID      = os.Getenv("COGNITO_USER_POOL_ID")
)

type publicKeyResponse struct {
	Keys []struct {
		KTY string `json:"kty"`
		KID string `json:"kid"`
		Use string `json:"use"`
		Alg string `json:"alg"`
		N   string `json:"n"`
		E   string `json:"e"`
	} `json:"keys"`
}

type publicKey struct {
	KTY string
	KID string
	Use string
	Alg string
	N   *big.Int
	E   int
}

const (
	pkEndpoint string = "/.well-known/jwks.json"
)

func (c *Client) Init(conf *envvar.Configuration) error {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(conf.Get("AWS_REGION")),
	})

	if err != nil {
		return err
	}

	c.cognitoAuthClient = cognitoidentityprovider.New(sess)
	return nil
}

func (c *Client) AdminCreateUser(name, email, username, password, dateOfBirth string) error {
	// Define the user attributes
	userAttributes := []*cognitoidentityprovider.AttributeType{
		{
			Name:  aws.String("email"),
			Value: aws.String(email),
		},
		{
			Name:  aws.String("name"),
			Value: aws.String(name),
		},
	}

	// Create the user in the specified user pool
	_, err := c.cognitoAuthClient.AdminCreateUser(&cognitoidentityprovider.AdminCreateUserInput{
		UserPoolId: aws.String(userPoolID),
		Username:   aws.String(username),
		DesiredDeliveryMediums: []*string{
			aws.String("EMAIL"), // Choose the desired delivery medium for verification, e.g., "EMAIL", "SMS"
		},
		ForceAliasCreation: aws.Bool(false), // Change this if you want to enforce alias creation
		UserAttributes:     userAttributes,
		// Add other optional parameters as needed
	})

	return err
}

// WithClient puts an Cognito auth client on the context.
func WithClient(ctx context.Context, client Clientable) context.Context {
	return context.WithValue(ctx, clientKey{}, client)
}

func NewClient() *Client {
	return &Client{}
}

func (c *Client) ProviderUser(_ context.Context, token string) (*auth.ProviderUser, error) {
	// get issuer from unverified claims
	t, err := Parse(token, nil) // returns error AND the token when you don't pass claims into Parse func
	if err != nil && !strings.Contains(err.Error(), "no Keyfunc was provided") {
		return nil, err
	}

	claims := t.Claims.(jwt.MapClaims)
	iss, ok := claims["iss"]
	if !ok {
		return nil, errors.New("token didn't contain `iss`")
	}

	issuer, ok := iss.(string)
	if !ok {
		return nil, errors.New("unexpected type for `iss`")
	}

	// get public keys from <issuer>/.well-known/jwks.json
	pks, err := publicKeys(issuer + pkEndpoint)
	if err != nil {
		return nil, err
	}

	// get claims from verified claims
	claims, err = idTokenClaims(token, pks)
	if err != nil {
		return nil, err
	}

	return &auth.ProviderUser{
		Email: claims["email"].(string),
	}, nil
}

func publicKeys(url string) ([]publicKey, error) {
	res, err := getRequest(url)
	if err != nil {
		return []publicKey{}, err
	}

	var result publicKeyResponse
	err = json.Unmarshal([]byte(res), &result)
	if err != nil {
		return []publicKey{}, err
	}

	var keys []publicKey
	for _, key := range result.Keys {
		n, err := decodeBase64BigInt(key.N)
		if err != nil {
			continue
		}

		k, err := decodeBase64BigInt(key.E)
		if err != nil {
			continue
		}

		keys = append(keys, publicKey{
			KTY: key.KTY,
			KID: key.KID,
			Use: key.Use,
			Alg: key.Alg,
			N:   n,
			E:   int(k.Int64()),
		})
	}

	return keys, nil
}

func getRequest(url string) (string, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("Content-Type", "application/json")

	res, err := rest.Client.Do(req)
	if err != nil {
		return "", err
	}

	defer res.Body.Close()

	b, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	body := string(b)
	if rest.InvalidResponse(res.StatusCode) {
		return "", fmt.Errorf("unexpected response %d from cognito: %s", res.StatusCode, body)
	}

	return body, nil
}

// -

type Clientable interface {
	ProviderUser(ctx context.Context, token string) (*auth.ProviderUser, error)
}

// FromContext retrieves a cognito auth client from the context.
func FromContext(ctx context.Context) Clientable {
	c, ok := ctx.Value(clientKey{}).(Clientable)
	if ok && c != nil {
		return c
	}
	return nil
}

// idTokenClaims decodes the id_token response and returns the JWT claims to identify the user
func idTokenClaims(idToken string, publicKeys []publicKey) (jwt.MapClaims, error) {
	claims := jwt.MapClaims{}
	var token *jwt.Token
	var err error

	for _, k := range publicKeys {
		token, err = ParseWithClaims(idToken, claims, func(token *jwt.Token) (interface{}, error) {
			return k.RSA(), nil
		})

		if err == nil && token.Valid {
			break
		}
	}

	if token == nil || !token.Valid {
		return nil, errors.New("cognito token not valid")
	}

	return token.Claims.(jwt.MapClaims), nil
}

func decodeBase64BigInt(s string) (*big.Int, error) {
	buffer, err := base64.URLEncoding.WithPadding(base64.NoPadding).DecodeString(s)
	if err != nil {
		return nil, err
	}

	return big.NewInt(0).SetBytes(buffer), nil
}
func (k publicKey) RSA() *rsa.PublicKey {
	return &rsa.PublicKey{
		N: k.N,
		E: k.E,
	}
}
