const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const checkAuth = require('./middleware/check-atuh'); // correct the spelling typo from check-atuh to check-auth

// MySQL connection
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
});

// Function to insert fee records
router.post('/insert-fees', checkAuth, async (req, res) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JavaScript

    const queryBasicInfo = 'SELECT * FROM basicinfo';
    db.query(queryBasicInfo, (error, basicInfoResults) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        let insertedRecords = 0;

        // A counter to ensure we respond only after all asynchronous operations are complete
        let pendingQueries = basicInfoResults.length;

        // Process each basic info record
        if (pendingQueries === 0) {
            return res.status(200).json({ success: true, insertedRecords });
        }

        basicInfoResults.forEach(info => {
            const checkExistingQuery = `
                SELECT * FROM fee_tbl 
                WHERE fee_adm_no = ? AND YEAR(created_at) = ? AND MONTH(created_at) = ?
            `;
            db.query(checkExistingQuery, [info.adm_no, currentYear, currentMonth], (err, existingRecord) => {
                if (err) {
                    console.error('Check existing record error:', err);
                    return res.status(500).json({ error: 'Database query failed' });
                }

                if (existingRecord.length === 0) {
                    // Insert new record
                    const insertSQL = 'INSERT INTO fee_tbl (fee_adm_no, created_at) VALUES (?, ?)';
                    db.query(insertSQL, [info.adm_no, new Date()], (insertErr) => {
                        if (insertErr) {
                            console.error('Insert fee record error:', insertErr);
                        } else {
                            insertedRecords++;
                        }
                        // Decrement the counter and send response if all queries are done
                        if (--pendingQueries === 0) {
                            res.status(200).json({ success: true, insertedRecords });
                        }
                    });
                } else {
                    // If a record already exists, just decrement the pendingQueries
                    if (--pendingQueries === 0) {
                        res.status(200).json({ success: true, insertedRecords });
                    }
                }
            });
        });
    });
});

module.exports = router;
