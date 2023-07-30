package cognito

import (
	"context"
	"crypto/hmac"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/golang-jwt/jwt"
	"hornex.gg/hornex/auth"
	"hornex.gg/hornex/errors"
	rest "hornex.gg/hornex/http"
)

const (
	pkEndpoint string = "/.well-known/jwks.json"
)

var (
	Parse           = jwt.Parse
	ParseWithClaims = jwt.ParseWithClaims
)

type clientKey struct{}

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

type PublicKey struct {
	KTY string
	KID string
	Use string
	Alg string
	N   *big.Int
	E   int
}

type Client interface {
	SignUp(email, password, firstName, lastName, birthDate string) error
	ConfirmSignUp(email, confirmationCode string) error
	SignIn(email, password string) (*cognito.InitiateAuthOutput, error)
	ProviderUser(token string) (*auth.ProviderUser, error)
}

type awsCognitoClient struct {
	cognitoClient *cognito.CognitoIdentityProvider
	appClientID   string
}

func NewCognitoClient(appClientID string, sess *cognito.CognitoIdentityProvider) Client {
	return &awsCognitoClient{
		cognitoClient: sess,
		appClientID:   appClientID,
	}
}

// WithClient puts an Cognito auth client on the context.
func WithClient(ctx context.Context, client Client) context.Context {
	return context.WithValue(ctx, clientKey{}, client)
}

// FromContext retrieves a cognito auth client from the context.
func FromContext(ctx context.Context) Client {
	c, ok := ctx.Value(clientKey{}).(Client)
	if ok && c != nil {
		return c
	}
	return nil
}

func (ctx *awsCognitoClient) SignUp(email, password, firstName, lastName, birthDate string) error {
	clientSecret := "avpa0gh3e6mcmp7iu3137mqm2ev8a9aavv417499kujjfh96o51"
	mac := hmac.New(sha256.New, []byte(clientSecret))
	mac.Write([]byte(email + ctx.appClientID))
	secretHash := base64.StdEncoding.EncodeToString(mac.Sum(nil))

	user := &cognito.SignUpInput{
		ClientId:   aws.String(ctx.appClientID),
		SecretHash: aws.String(secretHash),
		Username:   aws.String(email),
		Password:   aws.String(password),
		UserAttributes: []*cognito.AttributeType{
			{
				Name:  aws.String("given_name"),
				Value: aws.String(firstName),
			},
			{
				Name:  aws.String("family_name"),
				Value: aws.String(lastName),
			},
			{
				Name:  aws.String("birthdate"),
				Value: aws.String(birthDate),
			},
		},
	}

	_, err := ctx.cognitoClient.SignUp(user)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "client.SignUp")
	}

	return nil
}

func (ctx *awsCognitoClient) ConfirmSignUp(email, code string) error {
	clientSecret := "avpa0gh3e6mcmp7iu3137mqm2ev8a9aavv417499kujjfh96o51"
	computeSecretHash := computeSecretHash(clientSecret, email, ctx.appClientID)

	_, err := ctx.cognitoClient.ConfirmSignUp(&cognito.ConfirmSignUpInput{
		ClientId:         aws.String(ctx.appClientID),
		ConfirmationCode: aws.String(code),
		Username:         aws.String(email),
		SecretHash:       aws.String(computeSecretHash),
	})

	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "client.ConfirmSignUp")
	}

	return nil
}

func (ctx *awsCognitoClient) SignIn(email, password string) (*cognito.InitiateAuthOutput, error) {
	clientSecret := "avpa0gh3e6mcmp7iu3137mqm2ev8a9aavv417499kujjfh96o51"
	secretHash := computeSecretHash(clientSecret, email, ctx.appClientID)

	// Set up the authentication parameters
	authParams := map[string]*string{
		"USERNAME":    aws.String(email),
		"PASSWORD":    aws.String(password),
		"SECRET_HASH": aws.String(secretHash),
	}

	// Initiate user sign-in
	authInput := &cognito.InitiateAuthInput{
		AuthFlow:       aws.String(cognito.AuthFlowTypeUserPasswordAuth),
		AuthParameters: authParams,
		ClientId:       aws.String(ctx.appClientID),
	}

	result, err := ctx.cognitoClient.InitiateAuth(authInput)

	if err != nil {
		return nil, err
	}

	return result, nil
}

// -

func GetVerifyKey() ([]PublicKey, error) {
	pks, err := PublicKeys("https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_KA56SJwIR/.well-known/jwks.json")
	if err != nil {
		return nil, err
	}

	return pks, nil
}

func (ctx *awsCognitoClient) ProviderUser(token string) (*auth.ProviderUser, error) {
	// get issuer from unverified claims
	t, err := Parse(token, nil) // returns error AND the token when you don't pass claims into Parse func
	if err != nil && !strings.Contains(err.Error(), "no Keyfunc was provided") {
		return nil, err
	}

	claims := t.Claims.(jwt.MapClaims)
	iss, ok := claims["iss"]
	if !ok {
		return nil, errors.NewErrorf(errors.ErrorCodeUnknown, "token didn't contain `iss`")
	}

	issuer, ok := iss.(string)
	if !ok {
		return nil, errors.NewErrorf(errors.ErrorCodeUnknown, "unexpected type for `iss`")
	}

	// get public keys from <issuer>/.well-known/jwks.json
	pks, err := PublicKeys(issuer + pkEndpoint)
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

// -

func computeSecretHash(clientSecret string, username string, clientId string) string {
	mac := hmac.New(sha256.New, []byte(clientSecret))
	mac.Write([]byte(username + clientId))

	return base64.StdEncoding.EncodeToString(mac.Sum(nil))
}

func PublicKeys(url string) ([]PublicKey, error) {
	// TODO: cache public keys !IMPORTANT
	res, err := getRequest(url)
	if err != nil {
		return []PublicKey{}, err
	}

	var result publicKeyResponse
	err = json.Unmarshal([]byte(res), &result)
	if err != nil {
		return []PublicKey{}, err
	}

	var keys []PublicKey
	for _, key := range result.Keys {
		n, err := decodeBase64BigInt(key.N)
		if err != nil {
			continue
		}

		k, err := decodeBase64BigInt(key.E)
		if err != nil {
			continue
		}

		keys = append(keys, PublicKey{
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

// idTokenClaims decodes the id_token response and returns the JWT claims to identify the user
func idTokenClaims(idToken string, publicKeys []PublicKey) (jwt.MapClaims, error) {
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
		return nil, errors.NewErrorf(errors.ErrorCodeUnknown, "cognito token not valid")
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

func (k PublicKey) RSA() *rsa.PublicKey {
	return &rsa.PublicKey{
		N: k.N,
		E: k.E,
	}
}
