const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get Doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: "doctor" },
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Doctor
exports.createDoctor = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      password,
    } = req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const doctor =
      await User.create({
        fullname,
        email,
        phone,
        password: hashedPassword,
        role: "doctor",
      });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Doctor
exports.updateDoctor = async (
  req,
  res
) => {
  try {
    const doctor =
      await User.findByPk(
        req.params.id
      );

    if (!doctor) {
      return res.status(404).json({
        message:
          "Doctor Not Found",
      });
    }

    await doctor.update({
      fullname:
        req.body.fullname,
      email:
        req.body.email,
      phone:
        req.body.phone,
    });

    res.status(200).json({
      success: true,
      message:
        "Doctor Updated Successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// Delete Doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor =
      await User.findByPk(
        req.params.id
      );

    await doctor.destroy();

    res.json({
      message:
        "Doctor Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};