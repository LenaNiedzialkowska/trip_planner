DROP TABLE IF EXISTS packing_items;

DROP TABLE IF EXISTS item_category;

DROP TABLE IF EXISTS packing_lists;

DROP TABLE IF EXISTS expenses;

DROP TABLE IF EXISTS expenses_category;

DROP TABLE IF EXISTS events;

DROP TABLE IF EXISTS daily_plans;

DROP TABLE IF EXISTS trips;

DROP TABLE IF EXISTS users;

CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    trips (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        number_of_destinations INT,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        cost FLOAT,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    daily_plans (
        id SERIAL PRIMARY KEY,
        date timestamp,
        trip_id integer not null,
        FOREIGN KEY (trip_id) REFERENCES trips (id),
        created_at TIMESTAMP DEFAULT NOW (),
        description VARCHAR(255)
    );

CREATE TABLE
    events (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        time time,
        description VARCHAR(255),
        cost float,
        daily_plan_id integer not null,
        FOREIGN KEY (daily_plan_id) REFERENCES daily_plans (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    expenses_category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW ()
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
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    packing_lists (
        id SERIAL PRIMARY KEY,
        trip_id integer not null,
        FOREIGN KEY (trip_id) REFERENCES trips (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    item_category (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        packing_list_id integer not null,
        FOREIGN KEY (packing_list_id) REFERENCES packing_lists (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );

CREATE TABLE
    packing_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        quantity integer,
        packed boolean,
        item_category_id integer not null,
        FOREIGN KEY (item_category_id) REFERENCES item_category (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );

INSERT INTO
    users (id, username, email, password)
VALUES
    (1, 'janek', 'janek@example.com', 'haslo123'),
    (2, 'kasia', 'kasia@example.com', 'haslo456');

INSERT INTO
    trips (
        id,
        name,
        number_of_destinations,
        start_date,
        end_date,
        cost,
        user_id
    )
VALUES
    (
        1,
        'Wakacje w Grecji',
        3,
        '2025-06-01',
        '2025-06-15',
        3000.50,
        1
    ),
    (
        2,
        'Weekend w Paryżu',
        1,
        '2025-05-01',
        '2025-05-03',
        800.00,
        1
    );

INSERT INTO
    packing_lists (id, trip_id)
VALUES
    (1, 1);

INSERT INTO
    item_category (id, name, packing_list_id)
VALUES
    (1, 'Ubrania', 1),
    (2, 'Kosmetyki', 1),
    (3, 'Elektronika', 1);

INSERT INTO
    packing_items (name, quantity, packed, item_category_id)
VALUES
    ('T-shirty', 5, false, 1),
    ('Spodnie', 2, true, 1),
    ('Szczoteczka do zębów', 1, true, 2),
    ('Szampon', 1, false, 2),
    ('Ładowarka do telefonu', 1, true, 3),
    ('Powerbank', 1, false, 3);

SELECT
    *
FROM
    users;