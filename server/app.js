const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3001', // Your React app URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.) to be sent
}));

const studentRoutes = require('./api/routes/students/students');
const feeRoutes = require('./api/routes/fee');
const userRoutes = require('./api/routes/users/user');
const classesRoutes = require('./api/routes/classes/classes');

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sms'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes which should handle requests
app.use('/students', studentRoutes);
app.use('/fee', feeRoutes);
app.use('/user', userRoutes);
app.use('/classes', classesRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

module.exports = app;
