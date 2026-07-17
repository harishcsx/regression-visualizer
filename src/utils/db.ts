import { Pool } from 'pg';

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for some hosted databases like Neon
  }
});

let initialized = false;

export async function getDb() {
  if (!initialized) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS visitors (
          id VARCHAR(255) PRIMARY KEY,
          device_name VARCHAR(255) NOT NULL,
          visit_count INT DEFAULT 1,
          last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      initialized = true;
      console.log("Database initialized: 'visitors' table ready.");
    } catch (error) {
      console.error("Error initializing database table:", error);
    }
  }
  return pool;
}
