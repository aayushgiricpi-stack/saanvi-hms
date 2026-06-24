const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require(
  "../controllers/dashboardController"
);

const verifyToken = require(
  "../middleware/authMiddleware"
);

const authorizeRole = require(
  "../middleware/roleMiddleware"
);

router.get(
  "/stats",
  verifyToken,
  authorizeRole("admin"),
  getDashboardStats
);

module.exports = router;