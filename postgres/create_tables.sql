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
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        cost FLOAT,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users (id),
        created_at TIMESTAMP DEFAULT NOW ()
    );


CREATE TABLE 
events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    date DATE,
    time TIME,
    description VARCHAR(255),
    cost FLOAT,
    trip_id INTEGER NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips (id),
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
        start_date,
        end_date,
        cost,
        user_id
    )
VALUES
    (
        1,
        'Wakacje w Grecji',
        '2025-06-01',
        '2025-06-15',
        3000.50,
        1
    ),
    (
        2,
        'Weekend w Paryżu',
        '2025-05-01',
        '2025-05-03',
        800.00,
        1
    );

INSERT INTO packing_lists (trip_id) VALUES (1), (2);

INSERT INTO item_category (name, packing_list_id)
VALUES
    ('Ubrania', 1),
    ('Kosmetyki', 1),
    ('Elektronika', 1),
    ('Dziecko', 2),
    ('Plaża', 2);

INSERT INTO packing_items (name, quantity, packed, item_category_id)
VALUES
    ('T-shirty', 5, false, 1),
    ('Spodnie', 2, true, 1),
    ('Szczoteczka do zębów', 1, true, 2),
    ('Szampon', 1, false, 2),
    ('Ładowarka do telefonu', 1, true, 3),
    ('Powerbank', 1, false, 3),
    ('Pieluchy', 6, false, 4),
    ('Strój kąpielowy', 2, true, 4),
    ('Mleko modyfikowane', 1, true, 4),
    ('Ręcznik', 1, false, 5),
    ('Klapki', 1, true, 5);

INSERT INTO events (name, date, time, description, cost, trip_id)
VALUES ('Zwiedzanie Akropolu', NULL, NULL,'Wycieczka do Akropolu', 50.0, 1);

INSERT INTO events (name, date, time, description, cost, trip_id)
VALUES ('Kolacja w tawernie', '2025-06-02', '20:00', 'Kolacja z lokalnymi potrawami', 30.0, 1);

SELECT
    *
FROM
    users;