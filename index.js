const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const pool = require('./db');

const app = express();
const PORT = 5000;

// Middleware to parse JSON data
app.use(express.json());

// Use task routes
app.use('/tasks', taskRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});