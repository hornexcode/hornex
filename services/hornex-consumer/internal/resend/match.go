package resend

import (
	"context"
	"fmt"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	pb "hornex.gg/hornex"
	"hornex.gg/hornex-consumer/internal"
	"hornex.gg/hornex/errors"
	"hornex.gg/hornex/resend"
)

// Match service...
type Match struct {
	client resend.Clientable
}

// NewMatch ...
func NewMatch(client resend.Clientable) *Match {
	return &Match{
		client: client,
	}
}

// Started...
func (m *Match) Started(ctx context.Context, match internal.Match) error {
	opts := grpc.WithTransportCredentials(insecure.NewCredentials())
	serverAddr := "localhost:50051"
	conn, err := grpc.Dial(serverAddr, opts)
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "grpc.Dial")
	}
	defer conn.Close()

	fmt.Println("Connected to server")

	client := pb.NewMatchServiceClient(conn)
	_, err = client.Retrieve(ctx, &pb.MatchRetrieveRequest{Id: "test-id-123"})
	if err != nil {
		return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "client.Retrieve")
	}

	// if err := m.client.Send(); err != nil {
	// 	return errors.WrapErrorf(err, errors.ErrorCodeUnknown, "client.Send")
	// }
	return nil
}
