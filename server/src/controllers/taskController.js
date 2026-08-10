const { Op } = require('sequelize');
const { Task, Category } = require('../models');

// Get all tasks for the logged-in user with filters
const getTasks = async (req, res) => {
    try {
        const {
            status,
            category_id,
            search,
            page = 1,
            limit = 10,
            sort_by = 'createdAt',
            sort_order = 'DESC',
        } = req.query;

        const currentPage = Math.max(parseInt(page, 10) || 1, 1);
        const pageLimit = Math.min(
            Math.max(parseInt(limit, 10) || 10, 1),
            100
        );

        const offset = (currentPage - 1) * pageLimit;

        const where = {
            user_id: req.user.id,
        };

        if (status) {
            where.status = status;
        }

        if (category_id) {
            where.category_id = category_id;
        }

        if (search) {
            where.title = {
                [Op.like]: `%${search}%`,
            };
        }

        const allowedSortFields = {
            due_date: 'due_date',
            status: 'status',
            createdAt: 'createdAt',
        };

        const sortField = allowedSortFields[sort_by] || 'createdAt';
        const sortDirection = String(sort_order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const { count, rows } = await Task.findAndCountAll({
            where,
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                },
            ],
            order: [[sortField, sortDirection]],
            limit: pageLimit,
            offset,
        });

        res.json({
            tasks: rows,
            pagination: {
                currentPage,
                limit: pageLimit,
                totalItems: count,
                totalPages: Math.ceil(count / pageLimit),
            },
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Get a specific task by ID for the logged-in user
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            where: {
                id,
                user_id: req.user.id,
            },
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        res.json({
            task,
        });
    } catch (error) {
        console.error('Error fetching task:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Create a new task for the logged-in user
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            due_date,
            category_id,
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: 'Title is required',
            });
        }

        if (!category_id) {
            return res.status(400).json({
                message: 'Category is required',
            });
        }

        const validStatuses = [
            'pending',
            'in_progress',
            'completed',
        ];

        const taskStatus = status || 'pending';

        if (!validStatuses.includes(taskStatus)) {
            return res.status(400).json({
                message: 'Invalid status',
            });
        }

        const category = await Category.findByPk(category_id);

        if (!category) {
            return res.status(400).json({
                message: 'Category not found',
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description || null,
            status: taskStatus,
            due_date: due_date || null,
            category_id,
            user_id: req.user.id,
        });

        const createdTask = await Task.findByPk(task.id, {
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                },
            ],
        });

        res.status(201).json({
            message: 'Task created successfully',
            task: createdTask,
        });
    } catch (error) {
        console.error('Error creating task:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Update an existing task for the logged-in user
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            where: {
                id,
                user_id: req.user.id,
            },
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        const {
            title,
            description,
            status,
            due_date,
            category_id,
        } = req.body;

        if (title !== undefined && !title.trim()) {
            return res.status(400).json({
                message: 'Title cannot be empty',
            });
        }

        const validStatuses = [
            'pending',
            'in_progress',
            'completed',
        ];

        if (
            status !== undefined &&
            !validStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: 'Invalid status',
            });
        }

        if (category_id !== undefined) {
            const category = await Category.findByPk(category_id);

            if (!category) {
                return res.status(400).json({
                    message: 'Category not found',
                });
            }
        }

        await task.update({
            ...(title !== undefined && {
                title: title.trim(),
            }),
            ...(description !== undefined && {
                description,
            }),
            ...(status !== undefined && {
                status,
            }),
            ...(due_date !== undefined && {
                due_date,
            }),
            ...(category_id !== undefined && {
                category_id,
            }),
        });

        const updatedTask = await Task.findByPk(task.id, {
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                },
            ],
        });

        res.json({
            message: 'Task updated successfully',
            task: updatedTask,
        });
    } catch (error) {
        console.error('Error updating task:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            where: {
                id,
                user_id: req.user.id,
            },
        });

        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
            });
        }

        await task.destroy();

        res.json({
            message: 'Task deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting task:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
};