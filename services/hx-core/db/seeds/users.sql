INSERT INTO users (
    email,
    password,
    first_name,
    last_name,
    birth_date,
    email_verified,
    created_at,
    updated_at
) VALUES (
    'jonh.doe@gmail',
    '$2a$14$on6yhjQMTRlSP1cXPNySbupedFz1etYAyoRmZ84/.ry2b8kiJ7QI2',
    'jonh',
    'doe',
    '1997-08-31',
    true,
    NOW(),
    NOW()
);