const User = require('./User');
const Category = require('./Category');
const Task = require('./Task');

User.hasMany(Task, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Task.belongsTo(User, {
    foreignKey: 'user_id',
});

Category.hasMany(Task, {
    foreignKey: 'category_id',
    onDelete: 'CASCADE',
});

Task.belongsTo(Category, {
    foreignKey: 'category_id',
});

module.exports = {
    User,
    Category,
    Task,
};