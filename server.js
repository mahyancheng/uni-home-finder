import express from 'express';
import cors from 'cors';
import pg from 'pg';
const { Pool } = pg;

const app = express();
const port = 3000;

// Enable CORS for the frontend
app.use(cors());
app.use(express.json());

// Create PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'student_housing',
  password: 'postgres',
  port: 5432,
});

// Search properties endpoint
app.get('/api/properties', async (req, res) => {
  try {
    const { property_type, max_distance_minutes, keywords } = req.query;
    
    let query = 'SELECT * FROM properties';
    const params = [];
    const conditions = [];

    if (property_type) {
      params.push(property_type);
      conditions.push(`property_type ILIKE $${params.length}`);
    }

    if (max_distance_minutes) {
      params.push(max_distance_minutes);
      conditions.push(`CAST(SPLIT_PART(distance_to_help_uni, \' \', 1) AS INTEGER) <= $${params.length}`);
    }

    if (keywords) {
      const searchTerms = keywords.split(' ');
      const keywordConditions = searchTerms.map(term => {
        params.push(`%${term}%`);
        return `(
          property_name ILIKE $${params.length} OR
          property_type ILIKE $${params.length} OR
          property_size ILIKE $${params.length} OR
          property_price ILIKE $${params.length} OR
          distance_to_help_uni ILIKE $${params.length} OR
          room_features ILIKE $${params.length} OR
          amenities_advantages ILIKE $${params.length}
        )`;
      });
      conditions.push(`(${keywordConditions.join(' AND ')})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    console.log('Executing query:', query);
    console.log('With parameters:', params);

    const result = await pool.query(query, params);
    console.log('Query returned', result.rows.length, 'properties');
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get property details endpoint
app.get('/api/properties/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await pool.query(
      'SELECT * FROM properties WHERE property_name ILIKE $1',
      [name]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error getting property details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 