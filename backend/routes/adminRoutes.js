const express = require("express");


const router = express.Router();

const {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require(
  "../controllers/adminController"
);

router.get("/doctors", getDoctors);

router.post(
  "/doctors",
  createDoctor
);


router.delete(
  "/doctors/:id",
  deleteDoctor
);

module.exports = router;