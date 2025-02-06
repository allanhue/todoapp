const { Pool } = require('pg');

// Database connection details
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    port: 5300,
    database: 'todo_app',
    password: 'Kraken',
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connection successful:', res.rows[0]);
    }
});

module.exports = pool;