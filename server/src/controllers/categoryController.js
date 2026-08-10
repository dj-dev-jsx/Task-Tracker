const { Category } = require('../models');

// Get all categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']],
        });

        res.json({
            categories,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Create a new category
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: 'Category name is required',
            });
        }

        const trimmedName = name.trim();

        const existingCategory = await Category.findOne({
            where: {
                name: trimmedName,
            },
        });

        if (existingCategory) {
            return res.status(409).json({
                message: 'Category already exists',
            });
        }

        const category = await Category.create({
            name: trimmedName,
        });

        res.status(201).json({
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        console.error('Error creating category:', error);

        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

module.exports = {
    getCategories,
    createCategory,
};