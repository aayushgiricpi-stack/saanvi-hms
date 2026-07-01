const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getNotifications,
} = require("../controllers/appointmentController");

// Get logged-in user's notifications
router.get(
  "/",
  verifyToken,
  getNotifications
);

module.exports = router;