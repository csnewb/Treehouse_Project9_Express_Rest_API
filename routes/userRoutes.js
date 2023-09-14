const express = require('express');
const router = express.Router();
const db = require('../models');
const { User } = db;
// const  authenticateUser  = require('../middleware/authenticateUser');
const {authenticateUser} = require('../middleware/auth-user')
const bcrypt = require('bcryptjs');


//NOTE: /api prefix is assigned in app.js line 51

// CREATE new user (POST)
router.post('/users', async (req, res) => {
    const { firstName, lastName, emailAddress, password } = req.body;
    console.log(req.body);

    // Validate required fields
    if (!firstName || !lastName || !emailAddress || !password) {
        return res.status(400).json({
            error: 'All fields are required: firstName, lastName, emailAddress, and password'
        });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log(hashedPassword)

    try {
        // Create the new user and we replace req.body.password with the hashed password
        await User.create({
            ...req.body,
            password: hashedPassword
        });

        // Set the Location header
        res.location('/');

        // Return 201 status with no content
        res.status(201).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            // Handle validation errors here
            res.status(400).json({ error: error.errors.map(e => e.message) });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


router.get('/users/', authenticateUser, async (req, res) => {
    console.log(req.currentUser.firstName);
    try {
        const user = await User.findByPk(req.currentUser.id);

        if (user) {
            const userJSON = user.toJSON();
            res.status(200).json(userJSON);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





// Delete (DELETE) for DB Local Testing Cleanup
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
