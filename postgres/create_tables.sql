DROP TABLE IF EXISTS trips;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS daily_plans;

DROP TABLE IF EXISTS events;

DROP TABLE IF EXISTS expenses;

DROP TABLE IF EXISTS packing_lists;

DROP TABLE IF EXISTS packing_items;

DROP TABLE IF EXISTS item_category;

DROP TABLE IF EXISTS expenses_category;

ALTER TABLE trips
DROP FOREIGN KEY user_id;

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP,
        description VARCHAR(255)
    );

CREATE TABLE
    trips (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        number_of_destinations INT,
        password VARCHAR(255),
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        cost FLOAT,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users (id),
        created_at TIMESTAMP
    );

CREATE TABLE
    daily_plans (
        id SERIAL PRIMARY KEY,
        date timestamp,
        trip_id integer not null,
        FOREIGN KEY (trip_id) REFERENCES trips (id),
        created_at timestamp,
        description VARCHAR(255)
    );

CREATE TABLE
    events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        time time,
        desription VARCHAR(255),
        cost float,
        daily_plan_id integer not null,
        FOREIGN KEY (daily_plan_id) REFERENCES daily_plans (id),
        created_at timestamp
    );

CREATE TABLE
    expenses_category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        created_at timestamp
    );

CREATE TABLE
    expenses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        date timestamp,
        location VARCHAR(255),
        amount float,
        currency VARCHAR(255),
        status VARCHAR(255),
        trip_id integer not null,
        expenses_category_id integer not null,
        FOREIGN KEY (trip_id) REFERENCES trips (id),
        FOREIGN KEY (expenses_category_id) REFERENCES expenses_category (id),
        created_at timestamp
    );

CREATE TABLE
    packing_lists (
        id SERIAL PRIMARY KEY,
        category VARCHAR(255),
        trip_id integer not null,
        FOREIGN KEY (trip_id) REFERENCES trips (id),
        created_at timestamp
    );

CREATE TABLE
    item_category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        packing_list_id integer not null,
        FOREIGN KEY (packing_list_id) REFERENCES packing_lists (id),
        created_at timestamp
    );

CREATE TABLE
    packing_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        quantity integer,
        packed VARCHAR(255),
        packing_list_id integer not null,
        item_category_id integer not null,
        FOREIGN KEY (packing_list_id) REFERENCES packing_lists (id),
        FOREIGN KEY (item_category_id) REFERENCES item_category (id),
        created_at timestamp
    );