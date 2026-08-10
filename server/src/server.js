const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        message: 'API is running',
    });
});

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        await sequelize.authenticate();

        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
};

startServer();