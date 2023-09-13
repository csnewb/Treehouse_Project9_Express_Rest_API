const express = require('express');
const router = express.Router();
const db = require('../models');
const { Course } = db;
const authenticateUser  = require('../middleware/authenticateUser');

//NOTE: /api prefix is assigned in app.js line 51

// Create (POST)
router.post('/courses', authenticateUser, async (req, res) => {
    try {
        const { title, description } = req.body;

        // Manual validation
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and Description are required.' });
        }

        const newCourse = await Course.create(req.body);
        res.status(201).json(newCourse);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        return res.status(500).json({ error: error.message });
    }
});


// Read (GET)
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update (PUT)
router.put('/courses/:id', authenticateUser, async (req, res) => {
    try {
        const { title, description } = req.body;

        // Manual validation for title and description
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and Description are required.' });
        }

        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.update(req.body);
            res.json({ message: 'Course updated' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        return res.status(500).json({ error: error.message });
    }
});


// Delete (DELETE)
router.delete('/courses/:id', authenticateUser, async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.destroy();
            res.json({ message: 'Course deleted' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
