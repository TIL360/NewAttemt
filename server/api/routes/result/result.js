const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const checkAuth = require('../middleware/check-atuh');

const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
destination: function(req, file, cb){
  cb(null, './uploads/staff');
},
filename: function(req, file, cb){
cb(null, file.originalname);
}
}); 

const fileFilter = (req, file, cb) => {
  
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){

    cb(null, true);
  }else{

    cb(null, false);
  }
}


const upload = multer({
  storage: storage, 
  limits: {fileSize: 1024 * 1024 * 5},
  fileFilter: fileFilter

});

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

router.get("/", checkAuth, (req, res) => {
    const { year, month, standard } = req.query; // Fetch the standard from the query parameters
    db.query(
      `SELECT * 
       FROM result_tbl 
       INNER JOIN basicinfo 
       ON result_tbl.result_adm_no = basicinfo.adm_no 
       WHERE result_tbl.year = ? AND result_tbl.month = ? AND result_tbl.	result_standard = ?`, // Add the standard to the WHERE clause
      [year, month, standard], // Include standard in the parameters
      (err, results) => {
        if (err) return res.status(500).json({ error: "Error fetching results", details: err });
        res.status(200).json(results);
      }
    );
  });
  

  router.get('/results/:resultid', checkAuth, (req, res) => {
    const { resultid } = req.params; 
    db.query(
        `SELECT OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8 FROM result_tbl WHERE resultid = ?`, 
        [resultid], 
        (err, results) => {
            if (err) return res.status(500).json({ error: "Error fetching results", details: err });
            res.status(200).json(results[0]); // Return the first result
        }
    );
  });
  
  
// Update obtained marks
router.patch('/results/:resultid', checkAuth, (req, res) => {
  const { resultid } = req.params; 
  const { OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8 } = req.body;

  db.query(
      `UPDATE result_tbl SET OM1 = ?, OM2 = ?, OM3 = ?, OM4 = ?, OM5 = ?, OM6 = ?, OM7 = ?, OM8 = ? WHERE resultid = ?`, 
      [OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8, resultid],
      (err, results) => {
          if (err) return res.status(500).json({ error: "Error updating marks", details: err });
          res.status(200).json({ message: "Marks updated successfully!" });
      }
  );
});


// Publish result and calculate positions
router.post('/publish-result', checkAuth, async (req, res) => {
  const { year, month, exam_name } = req.body; 
  try {
    // Step 1: Fetch all results for the specified year, month, and exam name
    const results = await new Promise((resolve, reject) => {
      db.query(
        `SELECT result_adm_no, OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8
         FROM result_tbl WHERE year = ? AND month = ? AND exam_name = ?`, 
        [year, month, exam_name],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

    if (results.length === 0) {
      return res.status(400).json({ message: 'No results found for the specified year, month, and exam name.' });
    }

    // Step 2: Calculate percentages
    const studentsWithPercentages = results.map(result => {
      const { result_adm_no, OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8 } = result;
      const totalMarks = [OM1, OM2, OM3, OM4, OM5, OM6, OM7, OM8].reduce((a, b) => a + (parseFloat(b) || 0), 0);
      const percentage = (totalMarks / (8 * 100)) * 100; // Assuming each subject is out of 100
      return { result_adm_no, percentage };
    });

    // Step 3: Sort and assign positions
    studentsWithPercentages.sort((a, b) => b.percentage - a.percentage); // Sort descending by percentage
    await Promise.all(studentsWithPercentages.map((student, index) => {
      const position = index + 1;

      // Step 4: Update the position in the database
      return new Promise((resolve, reject) => {
        db.query(
          `UPDATE result_tbl SET position = ? WHERE result_adm_no = ? AND year = ? AND month = ? AND exam_name = ?`,
          [position, student.result_adm_no, year, month, exam_name],
          (err) => {
            if (err) {
              console.error("Error updating position:", err);
              return reject(err);
            }
            resolve();
          }
        );
      });
    }));

    // Update publication status
    await new Promise((resolve, reject) => {
      db.query(
        `UPDATE result_tbl SET publication = 'Publish' WHERE year = ? AND month = ? AND exam_name = ?`, 
        [year, month, exam_name],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
    
    res.status(200).json({ message: "Result published and positions calculated successfully!" });
  } catch (err) {
    return res.status(500).json({ error: "Error publishing results", details: err });
  }
});



// Pend result
router.post('/pend-result', checkAuth, (req, res) => {
  const { year, month } = req.body; 
  db.query(
    `UPDATE result_tbl SET publication = 'Pend' WHERE year = ? AND month = ?`, 
    [year, month],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error pending result", details: err });
      res.status(200).json({ message: "Result marked as pending!" });
    }
  );
});

  module.exports = router;