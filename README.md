Uruchamianie postgres na docker

`docker compose up -d`

Uruchamianie skryptu bazy danych:

`docker exec -it postgres psql -U postgres -d trip_planner -f /app/create_tables.sql`

Migracja skryptu z przykładowymi danymi do bazy danych: 
`docker cp C:\Users\lniedzialkowska\Desktop\trip_planner\trip_planner\postgres\schema.sql postgres:/app/schema.sql`

Uruchamianie skryptu z przykładowymi danymi do bazy danych:

`docker exec -it postgres psql -U postgres -d trip_planner -f /app/schema.sql`

Uruchamianie backendu:

`nodemon server/index.js`

Uruchamianie frontendu:

`npm run start`
