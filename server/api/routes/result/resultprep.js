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

router.post("/result", checkAuth, (req, res) => { 
  const { year, month } = req.body; // Destructure only year and month from body

  // This assumes adm_no needs to be inferred or retrieved from somewhere else.
  // For demonstration, let's just retrieve all records for the 'Active' status in basicinfo
  const basicInfoQuery = "SELECT * FROM basicinfo WHERE status = 'Active'";
  
  db.query(basicInfoQuery, (error, basicInfoResults) => { 
      if (error) { 
          console.error("Error fetching basic info:", error); 
          return res.status(500).json({ error: "Failed to fetch basic info", details: error }); 
      }
      
      if (basicInfoResults.length === 0) {
          return res.status(404).json({ error: "No active basic info found" });
      }

      // Loop through result rows to insert into result_tbl
      const created_at = new Date(); // Current date and time for created_at

      basicInfoResults.forEach((basicInfo) => {
          const result_adm_no = basicInfo.adm_no;
          const result_standard = basicInfo.standard;

          // Now perform the insert operation
          const query = "INSERT INTO result_tbl (year, month, result_adm_no, result_standard, created_at) VALUES (?, ?, ?, ?, ?)";
          db.query(query, [year, month, result_adm_no, result_standard, created_at], (insertError) => {
              if (insertError) {
                  console.error("Error inserting result:", insertError);
                  return res.status(500).json({ error: "Database insertion failed", details: insertError });
              }
          });
      });

      // Send success response after all inserts
      return res.status(200).json({ success: true, message: "Results inserted successfully" });
  });
});


// Endpoint to get distinct years, months, and standards
router.get("/selectboxes", checkAuth, (req, res) => {
  const queryYear = "SELECT DISTINCT year FROM result_tbl";
  const queryMonth = "SELECT DISTINCT month FROM result_tbl WHERE month IS NOT NULL";
  const queryStandard = "SELECT DISTINCT result_standard FROM result_tbl";

  db.query(queryYear, (err, years) => {
      if (err) return res.status(500).json({ error: "Error fetching years", details: err });

      db.query(queryMonth, (err, months) => {
          if (err) return res.status(500).json({ error: "Error fetching months", details: err });

          db.query(queryStandard, (err, standards) => {
              if (err) return res.status(500).json({ error: "Error fetching standards", details: err });

              res.status(200).json({ years, months, standards });
          });
      });
  });
});

router.patch("/marks", checkAuth, (req, res) => {
  const { standard, examYear, examName, TMS1, TMS2, TMS3, TMS4, TMS5, TMS6, TMS7, TMS8 } = req.body;

  // Create a query to update the record based on the criteria
  const updateQuery = `
    UPDATE result_tbl 
    SET TMS1 = ?, TMS2 = ?, TMS3 = ?, TMS4 = ?, TMS5 = ?, TMS6 = ?, TMS7 = ?, TMS8 = ?
    WHERE year = ? AND month = ? AND result_standard = ?
  `;

  db.query(updateQuery, [TMS1, TMS2, TMS3, TMS4, TMS5, TMS6, TMS7, TMS8, examYear, examName, standard], (updateError, results) => {
    if (updateError) {
      console.error("Error updating result:", updateError);
      return res.status(500).json({ error: "Database update failed", details: updateError });
    }

    // Check if any rows were affected to determine if the update was successful
    if (results.affectedRows === 0) {
      // If no rows were affected, it means there was no record to update
      return res.status(404).json({ error: "No record found to update" });
    }

    // Send success response after the update
    return res.status(200).json({ success: true, message: "Results updated successfully" });
  });
});




  module.exports = router;