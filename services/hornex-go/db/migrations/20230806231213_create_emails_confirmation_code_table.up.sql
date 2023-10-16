CREATE TABLE emails_confirmation_code (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email                   VARCHAR NOT NULL,
    confirmation_code       VARCHAR NOT NULL,
    created_at              TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
