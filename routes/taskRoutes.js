const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all tasks
router.get('/tasks/', async (req, res) => {
    try {
        const allTasks = await pool.query('SELECT * FROM tasks');
        res.json(allTasks.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single task by ID
router.get('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (task.rows.length === 0) {
            return res.status(404).send('Task not found');
        }
        res.json(task.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add a new task
router.post('/tasks/', async (req, res) => {
    try {
        const { title, description } = req.body;

        // Validate request body
        if (!title || !description) {
            return res.status(400).send('Title and description are required');
        }

        const newTask = await pool.query(
            'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
            [title, description]
        );
        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        // Validate request body
        if (!title || !description || completed === undefined) {
            return res.status(400).send('Title, description, and completed status are required');
        }

        const updateTask = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 RETURNING *',
            [title, description, completed, id]
        );
        if (updateTask.rows.length === 0) {
            return res.status(404).send('Task not found');
        }
        res.json(updateTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTask = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (deleteTask.rows.length === 0) {
            return res.status(404).send('Task not found');
        }
        res.json('Task was deleted');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;