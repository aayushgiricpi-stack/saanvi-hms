const express = require("express");

const router = express.Router();

const {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateStatus,
  addPrescription,
  uploadPrescription,
} = require("../controllers/appointmentController");
console.log("uploadPrescription =", uploadPrescription);
const verifyToken = require(
  "../middleware/authMiddleware"
);

const authorizeRole = require(
  "../middleware/roleMiddleware"
);

const upload = require(
  "../middleware/uploadPrescription"
);

router.post(
  "/",
  verifyToken,
  authorizeRole("patient"),
  createAppointment
);

router.get(
  "/doctor/:doctorId",
  verifyToken,
  authorizeRole("doctor"),
  getDoctorAppointments
);

router.get(
  "/patient/:email",
  verifyToken,
  authorizeRole("patient"),
  getPatientAppointments
);

router.put(
  "/:id/status",
  verifyToken,
  authorizeRole("doctor"),
  updateStatus
);
router.put(
  "/prescription/:id",
  verifyToken,
  addPrescription
);
router.post(
  "/upload-prescription/:id",
  upload.single("file"),
  uploadPrescription
);
module.exports = router;