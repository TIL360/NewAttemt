const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sms",
});


// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
  if (!token) return res.status(403).json({ message: "No token provided." });

  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Unauthorized!" });
      req.userId = decoded.userid;
      next();
  });
};
 
// New endpoint for profile or verification
router.get("/", verifyToken, (req, res) => {
  // You can add further logic to fetch user details if needed
  res.status(200).json({ Valid: true }); // This is just an example response
});



// Handling POST requests for signup
router.post("/signup", (req, res) => {
  const { username, password, usertype } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ error: err.message });
    }

    // Insert into the database
    const sql = "INSERT INTO user_detail (username, password, usertype) VALUES (?, ?, ?)";
    db.query(sql, [username, hash, usertype], (err, result) => {
      if (err) {
        console.error("Error inserting user: ", err);
        return res.status(500).json({ error: "Database error: " + err.message });
      }
      res.status(201).json({ id: result.insertId, username, usertype });
    });
  });
});


// Handling POST requests for login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM user_detail WHERE username = ?";
  
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    
    if (!results.length) return res.status(401).json({ message: "Auth failed. User not found." });

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: "Auth failed. Invalid credentials." });
      }

      const token = jwt.sign(
        { username: results[0].username, userid: results[0].id }, // Ensure 'id' is the correct field
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ message: "Auth successful.", token, user: { username: results[0].username, usertype: results[0].usertype } });
    });
  });
});


module.exports = router;
