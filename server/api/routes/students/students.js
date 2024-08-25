const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const multer = require('multer');
const path = require('path');
const checkAuth = require('../middleware/check-atuh');
const storage = multer.diskStorage({
destination: function(req, file, cb){
  cb(null, './uploads');
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


 

// New endpoint for profile or verification
router.get("/", checkAuth, (req, res) => {
  const query = 'SELECT * FROM basicinfo';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
});




    //   res.status(200).json({
//     message: 'Handling GET requests to /students'
//   });
});
router.post('/', checkAuth, upload.single('image'), (req, res, next) => {
  console.log(req.file);

  // Check if the file was uploaded
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

  const { admno, name, standard, monthly_fee, status, father, adm_date, adm_standard, mobile, address, email } = req.body;

  // Assuming you're storing the image's file path in the database
  const imagePath = req.file.path;

  const sql = 'INSERT INTO basicinfo (adm_no, name, standard, image, monthly_fee, status, father, adm_date, adm_standard, mobile, address, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [admno, name, standard, imagePath, monthly_fee, status, father, adm_date, adm_standard, mobile, address, email], (err, result) => {
      if (err) {
          console.error('Error inserting student: ', err);
          return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: result.insertId, admno, name, standard });
  });
});


// Handling GET by admno
router.get('/:admno', checkAuth, (req, res, next) => {
    const admno = req.params.admno;
  
    const query = 'SELECT * FROM basicinfo WHERE adm_no = ?';
    db.query(query, [admno], (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(results[0]);
    });
  });
  
  // Update record
router.patch('/:admno', checkAuth, upload.single('image'), (req, res, next) => {
  const admno = req.params.admno;
  const { name, standard, monthly_fee, status, father, adm_date, adm_standard, mobile, address, email } = req.body;
  
  // Create an array with the values to be updated
  const updateValues = [
      name,
      standard,
      monthly_fee,
      status,
      father,
      adm_date,
      adm_standard,
      mobile,
      address,
      email,
      admno // The adm_no to identify the record to update
  ];

  // If there's a new image, include it in the update
  let sql = 'UPDATE basicinfo SET name = ?, standard = ?, monthly_fee = ?, status = ?, father = ?, adm_date = ?, adm_standard = ?, mobile = ?, address = ?, email = ? WHERE adm_no = ?';

  if (req.file) { // Check if a file was uploaded
      const imagePath = req.file.path;
      sql = 'UPDATE basicinfo SET name = ?, standard = ?, monthly_fee = ?, status = ?, father = ?, adm_date = ?, adm_standard = ?, mobile = ?, address = ?, email = ?, image = ? WHERE adm_no = ?';
      updateValues.unshift(imagePath); // Add the image path to the beginning of the array
  } 

  db.query(sql, updateValues, (err, result) => {
      if (err) {
          console.error('Error updating student: ', err);
          return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Student not found' });
      }
      res.status(200).json({ message: 'Student updated successfully' });
  });
});

  
  // Delete record
  router.delete('/:admno', checkAuth, (req, res, next) => {
    const studentId = req.params.admno;
  
    const sql = 'DELETE FROM basicinfo WHERE adm_no = ?';
    db.query(sql, [studentId], (err, result) => {
      if (err) {
        console.error('Error deleting student: ', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'No student found' });
      }
      res.status(200).json({ message: 'Student deleted successfully' });
    });
  });
 

  router.get('/classes', (req, res, next) => {
    const query = 'SELECT * FROM basicinfo';
    db.query(query, (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      res.json(results);
    });
});




  module.exports = router;