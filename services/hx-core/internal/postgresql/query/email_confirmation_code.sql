-- name: InsertEmailConfirmationCode :one
INSERT INTO emails_confirmation_code (
  email,
  confirmation_code
)
VALUES (
  @email,
  @confirmation_code
)
RETURNING id, email, confirmation_code, created_at;

-- name: SelectEmailConfirmationCode :one
SELECT id, email, confirmation_code, created_at FROM emails_confirmation_code WHERE email = @email ORDER BY created_at DESC;