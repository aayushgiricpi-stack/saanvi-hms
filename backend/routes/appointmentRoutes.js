const express = require("express");

const {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointments,
  updateStatus,
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/", createAppointment);

router.get(
  "/doctor/:doctorId",
  getDoctorAppointments
);
router.get(
  "/patient/:email",
  getPatientAppointments
);

router.put(
  "/:id/status",
  updateStatus
);

module.exports = router;