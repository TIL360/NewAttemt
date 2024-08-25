const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const checkAuth = require('../middleware/check-atuh');






// MySQL connection (make sure to move this to a better place in your code, if you want to use it in different routes)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sms',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  //console.log('Connected to MySQL database');
});


 

// New endpoint for profile or verification
router.get("/", checkAuth, (req, res) => {
  const query = 'SELECT * FROM classes';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
});



});



  
 


  module.exports = router;