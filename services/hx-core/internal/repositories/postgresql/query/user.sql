-- name: InsertUser :one
INSERT INTO users (
  email,
  first_name,
  last_name,
  date_of_birth,
  password
)
VALUES (
  @email,
  @first_name,
  @last_name,
  @date_of_birth,
  @password
)
RETURNING id, created_at, updated_at;

-- name: SelectUserByEmail :one
SELECT * FROM users WHERE email = @email;