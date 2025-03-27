const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "aaa",
    host: "localhost",
    port: 5432,
    database: "trip_planner"
});

module.exports = pool;