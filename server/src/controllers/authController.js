const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: 'Name, email, password, and password confirmation are required',
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters',
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password and confirmation password do not match',
            });
        }
        const existingUser = await User.findOne({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email is already registered',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            message: 'Server error',
        });
    }
};

// Login an existing user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
            });
        }

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d',
            }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error);

        res.status(500).json({
            message: 'Server error',
        });
    }
};

// Get the currently logged-in user's information
const me = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email'],
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.json({
            user,
        });
    } catch (error) {
        console.error('Get user error:', error);

        res.status(500).json({
            message: 'Server error',
        });
    }
};

module.exports = {
    register,
    login,
    me,
};