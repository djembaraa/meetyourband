// Use 'dotenv' library to render variabel from file
import "dotenv/config";
import pg from "pg";

// Import pool class from pg
const { Pool } = "pg";

// Pool instance for new connection
// Automatic pool will use variabel to set up .env file
const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

export default pool;
