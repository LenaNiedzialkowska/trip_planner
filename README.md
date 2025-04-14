Uruchamianie postgres na docker

`docker compose up -d`

Uruchamianie skryptu bazy danych:

`docker exec -it postgres psql -U postgres -d trip_planner -f /app/create_tables.sql`

Uruchamianie backendu:

`nodemon server/index.js`

Uruchamianie frontendu:

`npm run start`
