const express = require("express");

const {
  register,
  login,
  getDoctors,
  getAllUsers,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const verifyToken = require(
  "../middleware/authMiddleware"
);

const authorizeRole = require(
  "../middleware/roleMiddleware"
);

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Register
router.post(
  "/register",
  register
);

// Login
router.post(
  "/login",
  login
);

// Forgot Password
router.post(
  "/forgot-password",
  forgotPassword
);

// Reset Password
router.post(
  "/reset-password/:token",
  resetPassword
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Get all doctors
router.get(
  "/doctors",
  verifyToken,
  getDoctors
);

// Admin Only - Get all users
router.get(
  "/users",
  verifyToken,
  authorizeRole("admin"),
  getAllUsers
);
// router.get(
//   "/notifications",
//   verifyToken,
//   getNotifications
// );

module.exports = router;