const express = require('express');
const router = express.Router();
const db = require('../models');
const { User } = db;
const  authenticateUser  = require('../middleware/authenticateUser');
const bcrypt = require('bcryptjs');


//NOTE: /api prefix is assigned in app.js line 51

// Create (POST)
router.post('/users', authenticateUser, async (req, res) => {
    const { firstName, lastName, emailAddress, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !emailAddress || !password) {
        return res.status(400).json({
            error: 'All fields are required: firstName, lastName, emailAddress, and password'
        });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        // Create the new user and we replace req.body.password with the hashed password
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword
        });
        // return the newUser data in our response
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            // Handle validation errors here
            res.status(400).json({ error: error.errors.map(e => e.message) });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


// Read (GET)
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update (PUT)
router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update(req.body);
            res.json({ message: 'User updated' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete (DELETE)
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.destroy();
            res.json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
