
import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: import.meta.env.VITE_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/student_housing',
  ssl: import.meta.env.VITE_DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export { pool };
