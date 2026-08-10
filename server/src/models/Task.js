const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define(
    'Task',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(
                'pending',
                'in_progress',
                'completed'
            ),
            defaultValue: 'pending',
            allowNull: false,
        },

        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'tasks',
    }
);

module.exports = Task;