DROP TABLE IF EXISTS packing_items;

DROP TABLE IF EXISTS item_category;

DROP TABLE IF EXISTS expenses;

DROP TABLE IF EXISTS expenses_category;

DROP TABLE IF EXISTS events;

DROP TABLE IF EXISTS trips;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS trip_images;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE
    users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    trips (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        start_date DATE,
        end_date DATE,
        cost FLOAT,
        user_id UUID,
        FOREIGN KEY (user_id) REFERENCES users (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );


CREATE TABLE 
events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255),
    date DATE,
    time TIME,
    description VARCHAR(255),
    cost FLOAT,
    trip_id UUID NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips (id),
    created_at TIMESTAMP DEFAULT NOW ()
);


CREATE TABLE
    expenses_category (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    expenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        date timestamp,
        location VARCHAR(255),
        amount float,
        currency VARCHAR(255),
        status VARCHAR(255),
        trip_id UUID not null,
        expenses_category_id UUID not null,
        FOREIGN KEY (trip_id) REFERENCES trips (id),
        FOREIGN KEY (expenses_category_id) REFERENCES expenses_category (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    item_category (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        trip_id UUID not null,
        FOREIGN KEY (trip_id) REFERENCES trips (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    packing_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        quantity integer,
        packed boolean,
        item_category_id UUID not null,
        FOREIGN KEY (item_category_id) REFERENCES item_category (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE 
    trip_images(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        blob BYTEA,
        filename VARCHAR(255),
        mime_type VARCHAR(50),
        trip_id UUID NOT NULL,
        FOREIGN KEY (trip_id) REFERENCES trips (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );


ALTER TABLE packing_items
ADD CONSTRAINT unique_item_in_category UNIQUE (item_category_id, name);
