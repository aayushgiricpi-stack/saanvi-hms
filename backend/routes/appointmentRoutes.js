const express = require("express");

const {
  createAppointment,
  getDoctorAppointments,
  updateStatus,
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/", createAppointment);

router.get(
  "/doctor/:doctorId",
  getDoctorAppointments
);

router.put(
  "/:id/status",
  updateStatus
);

module.exports = router;