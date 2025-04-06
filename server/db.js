const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "aaa",
  host: "localhost",
  port: 5433,
  database: "trip_planner",
});

module.exports = pool;
