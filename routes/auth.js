// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')(require('../database').sequelize);

const auth = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = await User.create({ name, email, password: bcrypt.hashSync(password, 10) });

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Check token validity
router.get('/check-token', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (user) {
            res.json({ isAuthenticated: true });
        } else {
            res.json({ isAuthenticated: false });
        }
    } catch (err) {
        console.error('Error checking token:', err);
        res.status(500).send('Server error');
    }
});

// Protected route example
router.get('/protected', auth, (req, res) => {
    res.json({ msg: 'Welcome to the protected route', user: req.user });
});

module.exports = router;
