const express = require('express');
const db = require('../models');
const { User, Course } = db;
const router = express.Router();

// Create a new User
router.get('/test-create-user', async (req, res) => {
    try {
        const newUser = await User.create({
            firstName: 'John',
            lastName: 'Doe',
            emailAddress: 'john.doe@example.com',
            password: 'password123'
        });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch User by ID
router.get('/test-fetch-user', async (req, res) => {
    try {
        const user = await User.findByPk(1);  // assuming the user with ID 1 exists
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new Course
router.get('/test-create-course', async (req, res) => {
    try {
        const newCourse = await Course.create({
            title: 'Introduction to Node.js',
            description: 'Learn the basics of Node.js',
            estimatedTime: '10 hours',
            materialsNeeded: 'Computer, Text Editor',
            userId: 1 // assuming a user with ID 1 exists
        });
        res.json(newCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fetch Course by ID
router.get('/test-fetch-course', async (req, res) => {
    try {
        const course = await Course.findByPk(1);  // assuming the course with ID 1 exists
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





module.exports = router;
