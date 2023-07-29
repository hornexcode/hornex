package cognito

import (
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
	"github.com/aws/aws-sdk-go/aws/session"
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

type publicKey struct {
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
}

type awsCognitoClient struct {
	cognitoClient *cognito.CognitoIdentityProvider
	appClientID   string
}

func NewCognitoClient(cognitoRegion string, cognitoAppClientID string) Client {
	conf := &aws.Config{Region: aws.String(cognitoRegion)}

	sess, err := session.NewSession(conf)
	client := cognito.New(sess)

	if err != nil {
		panic(err)
	}

	return &awsCognitoClient{
		cognitoClient: client,
		appClientID:   cognitoAppClientID,
	}
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

func ProviderUser(token string) (*auth.ProviderUser, error) {
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

// -

func computeSecretHash(clientSecret string, username string, clientId string) string {
	mac := hmac.New(sha256.New, []byte(clientSecret))
	mac.Write([]byte(username + clientId))

	return base64.StdEncoding.EncodeToString(mac.Sum(nil))
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

func (k publicKey) RSA() *rsa.PublicKey {
	return &rsa.PublicKey{
		N: k.N,
		E: k.E,
	}
}
