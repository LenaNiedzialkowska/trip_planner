

INSERT INTO trips (name, start_date, end_date, cost, user_id)
VALUES (
    'Zakhyntos',
    '2025-07-01',
    '2025-07-10',
    2000,
    (SELECT id FROM users WHERE email = 'test@test.pl')
);
-- Dodanie szczegółowego planu wycieczki jako wydarzenia
INSERT INTO events (name, date, start_time, end_time, description, cost, trip_id)
SELECT 
    name,
    date::date,
    start_time::time,
    end_time::time,
    description,
    cost,
    (SELECT id FROM trips WHERE name = 'Zakhyntos' LIMIT 1)
FROM (
    VALUES
        -- Dzień 1: Przylot i relaks
        ('Wylot z Warszawy', '2025-07-01', '08:30', '11:00', 'Lot do Zakynthos z Warszawy Chopina', 1200),
        ('Transfer do hotelu', '2025-07-01', '11:30', '12:30', 'Transfer z lotniska do hotelu', 30),
        ('Lunch w Dias Taverna', '2025-07-01', '14:00', '15:00', 'Obiad w tawernie Dias (Kalamaki)', 50),
        ('Relaks na plaży', '2025-07-01', '16:00', '19:00', 'Odpoczynek przy hotelu lub na plaży', 0),
        ('Kolacja w Avli', '2025-07-01', '20:00', '21:30', 'Kolacja w restauracji Avli', 100),

        -- Dzień 2: Rejs Navagio + Blue Caves
        ('Rejs – Zatoka Wraku i Błękitne Groty', '2025-07-02', '09:00', '14:00', 'Rejs łodzią z przystankiem na kąpiel', 80),
        ('Lunch w Nobelos', '2025-07-02', '14:30', '15:30', 'Obiad z widokiem na morze – Nobelos Bio Restaurant', 70),
        ('Kolacja w Halfway House', '2025-07-02', '20:00', '21:30', 'Kolacja w restauracji Halfway House (Tsilivi)', 80),

        -- Dzień 3: Zakynthos Town + Bochali
        ('Zwiedzanie miasta Zakynthos', '2025-07-03', '10:00', '13:00', 'Plac Solomosa, Muzeum, Kościół św. Dionizosa', 0),
        ('Lunch w Prosilio', '2025-07-03', '13:30', '14:30', 'Lunch w restauracji Prosilio Fine Dining', 100),
        ('Kawa na wzgórzu Bochali', '2025-07-03', '15:00', '15:45', 'Widok panoramiczny i kawa', 15),
        ('Kolacja w M-eating', '2025-07-03', '20:00', '21:30', 'Kolacja w restauracji M-eating (Laganas)', 90),

        -- Dzień 4: Rejs z żółwiami + Keri Caves
        ('Rejs z obserwacją żółwi', '2025-07-04', '09:00', '12:00', 'Rejs łodzią z dnem szklanym – Laganas', 50),
        ('Lunch w Votsalo', '2025-07-04', '13:00', '14:00', 'Obiad w tawernie Votsalo (Keri)', 60),
        ('Kolacja w La Bruschetta', '2025-07-04', '20:00', '21:30', 'Kolacja w restauracji La Bruschetta (Kalamaki)', 80),

        -- Dzień 5: Wnętrze wyspy i winnice
        ('Wizyta w Volimes i Maries', '2025-07-05', '09:00', '12:00', 'Tradycyjne wioski i punkty widokowe', 0),
        ('Degustacja wina Grampsas', '2025-07-05', '13:00', '14:00', 'Wizyta w winnicy Grampsas', 25),
        ('Lunch w Ampelostrates', '2025-07-05', '14:30', '15:30', 'Tawerna z lokalnymi potrawami – Agios Leon', 60),
        ('Kolacja w Essence', '2025-07-05', '20:00', '21:30', 'Kolacja w restauracji Essence (Kalamaki)', 90),
        ('Wieczór grecki – tańce', '2025-07-05', '21:30', '23:00', 'Pokaz tańców greckich w hotelu', 0),

        -- Dzień 6: Banana Beach + sporty wodne
        ('Relaks na Banana Beach', '2025-07-06', '10:00', '16:00', 'Leżaki, sporty wodne – Banana Beach', 40),
        ('Lunch w Casa Playa', '2025-07-06', '13:00', '14:00', 'Obiad na plaży – Casa Playa', 70),
        ('Kolacja w Olive Tree', '2025-07-06', '20:00', '21:30', 'Kolacja w restauracji Olive Tree (Tsilivi)', 85),

        -- Dzień 7: Powrót
        ('Transfer na lotnisko', '2025-07-07', '08:00', '09:00', 'Transfer z hotelu na lotnisko', 30),
        ('Wylot do Polski', '2025-07-07', '11:30', '14:00', 'Powrót samolotem do Warszawy', 1200)

) AS events(name, date, start_time, end_time, description, cost);
