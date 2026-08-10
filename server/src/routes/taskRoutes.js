const express = require('express');

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getTasks);

router.get('/:id', authenticateToken, getTaskById);

router.post('/', authenticateToken, createTask);

router.put('/:id', authenticateToken, updateTask);

router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;