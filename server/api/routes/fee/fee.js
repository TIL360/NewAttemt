const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const checkAuth = require("../middleware/check-atuh"); // correct the spelling typo from check-atuh to check-auth
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "sms",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
});

// New endpoint for profile or verification
router.get("/", checkAuth, async (req, res) => {
  const feedetailQuery = "SELECT * FROM fee_tbl"; // renamed for clarity

  db.query(feedetailQuery, (error, result) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }

    // Send the retrieved fee details back to the client
    return res.status(200).json({ success: true, data: result });
  });
});
router.post("/insert-fees", checkAuth, async (req, res) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Months are 0-based in JavaScript

  const queryBasicInfo = "SELECT adm_no, standard, monthly_fee FROM basicinfo"; // Removed balance retrieval from basicinfo

  db.query(queryBasicInfo, (error, basicInfoResults) => {
      if (error) {
          console.error("Database query error:", error);
          return res.status(500).json({ error: "Database query failed" });
      }

      let insertedRecords = 0;
      let pendingQueries = basicInfoResults.length;

      basicInfoResults.forEach((info) => {
          // Calculate total arrears from fee_tbl for the given adm_no
          const arrearsQuery = "SELECT SUM(balance) AS totalArrears FROM fee_tbl WHERE fee_adm_no = ?";
          db.query(arrearsQuery, [info.adm_no], (arrearsErr, arrearsResults) => {
              if (arrearsErr) {
                  console.error("Calculate arrears error:", arrearsErr);
                  return res.status(500).json({ error: "Database query failed" });
              }

              const totalArrears = arrearsResults[0].totalArrears || 0; // Default to 0 if no results

              // Check for existing records in fee_tbl
              const checkExistingQuery = "SELECT * FROM fee_tbl WHERE fee_adm_no = ? AND fyear = ? AND fmonth = ?";
              db.query(checkExistingQuery, [info.adm_no, currentYear, currentMonth], (checkErr, existingRecord) => {
                  if (checkErr) {
                      console.error("Check existing record error:", checkErr);
                      return res.status(500).json({ error: "Database query failed" });
                  }

                  if (existingRecord.length === 0) {
                      // Insert new record with calculated arrears
                      const insertSQL = "INSERT INTO fee_tbl (fee_adm_no, FeeStandard, monthly_fee, created_at, arrears) VALUES (?, ?, ?, ?, ?)";
                      db.query(insertSQL, [info.adm_no, info.standard, info.monthly_fee, new Date(), totalArrears], (insertErr) => {
                          if (insertErr) {
                              console.error("Insert fee record error:", insertErr);
                          } else {
                              insertedRecords++;
                          }
                          if (--pendingQueries === 0) {
                              res.status(200).json({ success: true, insertedRecords });
                          }
                      });
                  } else {
                      if (--pendingQueries === 0) {
                          res.status(200).json({ success: true, insertedRecords });
                      }
                  }
              });
          });
      });
  });
});

// Update data by idf
router.patch("/:idf", checkAuth, async (req, res) => {
  const idf = req.params.idf; // Get idf from URL parameter
  const { collection, fine_fee, collection_by, payment_at } = req.body;

  const query = `
      UPDATE fee_tbl 
      SET collection = ?, collection_by = ?, payment_at = ?, fine_fee = ? 
      WHERE idf = ?`;

  db.query(
    query,
    [collection, collection_by, payment_at, fine_fee, idf],
    (error) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Database query failed" });
      }
      res.status(200).json({ success: true });
    }
  );
});

// Get data by idf
router.get("/:idf", checkAuth, async (req, res) => {
  const idf = req.params.idf;
  // Assuming 'id' is the common field to join on in both tables
  const query = `
    SELECT fee_tbl.*, basicinfo.*
    FROM fee_tbl
    JOIN basicinfo ON fee_tbl.fee_adm_no = basicinfo.adm_no
    WHERE fee_tbl.idf = ?`;

  db.query(query, [idf], (error, result) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json({ success: true, data: result });
  });
});

// Delete fee record by idf
router.delete("/:idf", checkAuth, async (req, res) => {
  const idf = req.params.idf;
  const query = "DELETE FROM fee_tbl WHERE idf = ?";
  db.query(query, [idf], (error) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json({ success: true });
  });
});

// Get all paid fees
router.get("/paid", checkAuth, async (req, res) => {
  const query = `SELECT 
    f.idf, 
    f.fee_adm_no, 
    b.name, 
    f.FeeStandard, 
    f.collection, 
    f.monthly_fee AS total_fee, 
    f.collection_by, 
    f.payment_at 
FROM 
    fee_tbl f 
JOIN 
    basicinfo b 
ON 
    f.fee_adm_no = b.adm_no 
WHERE 
    f.collection > 0;
`;
  db.query(query, (error, results) => {
    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json({ success: true, data: results });
  });
});

module.exports = router;
