-- name: InsertUser :one
INSERT INTO users (
  email,
  birth_date,
  password
)
VALUES (
  @email,
  @birth_date,
  @password
)
RETURNING id, created_at, updated_at;

-- name: SelectUserByEmail :one
SELECT * FROM users WHERE email = @email;

-- name: SelectUserById :one
SELECT * FROM users WHERE id = @id;

-- name: UpdateUserById :one
UPDATE users SET
  email = @email,
  first_name = @first_name,
  last_name = @last_name,
  birth_date = @birth_date,
  email_confirmed = @email_confirmed,
  updated_at = NOW()
WHERE id = @id
RETURNING id, email, first_name, last_name, birth_date, email_confirmed, created_at, updated_at;