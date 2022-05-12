CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS words;

CREATE TABLE IF NOT EXISTS words (
    id   uuid      DEFAULT uuid_generate_v4() PRIMARY KEY,
    word text
);

COPY word FROM '.\words.txt' WITH (FORMAT csv)