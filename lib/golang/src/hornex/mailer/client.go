package mailer

type Clientable interface {
	Send(to, subject, body string) error
}
