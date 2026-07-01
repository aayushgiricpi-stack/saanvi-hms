const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const {
  createMedicalReport,
  getAllReports,
  getPatientReports,
  getReportById,
  updateMedicalReport,
  deleteMedicalReport,
} = require("../controllers/medicalReportController");

// Doctor creates report
router.post(
  "/",
  verifyToken,
  authorizeRole("doctor"),
  createMedicalReport
);

// Admin views all reports
router.get(
  "/",
  verifyToken,
  authorizeRole("admin"),
  getAllReports
);

// Patient views own reports
router.get(
  "/patient",
  verifyToken,
  authorizeRole("patient"),
  getPatientReports
);

// View report by ID
router.get(
  "/:id",
  verifyToken,
  getReportById
);

// Doctor updates report
router.put(
  "/:id",
  verifyToken,
  authorizeRole("doctor"),
  updateMedicalReport
);

// Admin deletes report
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("admin"),
  deleteMedicalReport
);

module.exports = router;