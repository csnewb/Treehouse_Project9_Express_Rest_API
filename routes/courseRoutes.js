const express = require('express');
const router = express.Router();
const db = require('../models');
const { Course } = db;
// const  authenticateUser  = require('../middleware/authenticateUser');
const {authenticateUser} = require('../middleware/auth-user')

//NOTE: /api prefix is assigned in app.js line 51


//Read (GET)
router.get('/courses/', async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                }
            ]
        });

        if (courses) {
            res.status(200).json(courses);
        } else {
            res.status(404).json({ error: 'No courses found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//Read (GET)
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                }
            ]
        });

        if (course) {
            res.status(200).json(course);
        } else {
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Create (POST)
router.post('/courses', authenticateUser, async (req, res) => {
    try {
        const { title, description } = req.body;

        // Manual validation
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and Description are required.' });
        }

        const newCourse = await Course.create(req.body);

        // Set the Location header to the URI for the newly created course.
        res.location(`/api/courses/${newCourse.id}`);

        // Return a 201 HTTP status code and no content.
        res.status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors.map(e => e.message) });
        }
        return res.status(500).json({ error: error.message });
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

            // Return a 204 HTTP status code and no content.
            res.status(204).end();
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

            // Return a 204 HTTP status code and no content.
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
