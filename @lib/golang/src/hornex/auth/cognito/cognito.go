package cognito

import (
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	cognito "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
)

func NewCognitoSession(region string) *cognito.CognitoIdentityProvider {
	conf := &aws.Config{Region: aws.String(region)}

	sess, err := session.NewSession(conf)
	client := cognito.New(sess)

	if err != nil {
		panic(err)
	}

	return client
}
