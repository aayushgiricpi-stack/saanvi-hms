const Appointment = require("../models/Appointment");

// Create Appointment
exports.createAppointment = async (
  req,
  res
) => {
  try {
    const appointment =
      await Appointment.create({
        patientEmail:
          req.body.patientEmail,
        patientName:
          req.body.patientName,
        doctorId:
          req.body.doctorId,
        doctorName:
          req.body.doctorName,
        appointmentDate:
          req.body.appointmentDate,
        reason:
          req.body.reason,
        status: "Pending",
      });

    res.status(201).json(
      appointment
    );
  } catch (error) {
    console.log(
      "CREATE APPOINTMENT ERROR:"
    );
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Doctor Appointments
exports.getDoctorAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.findAll({
          where: {
            doctorId:
              req.params.doctorId,
          },
        });

      res.json(appointments);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

// Get Patient Appointments
exports.getPatientAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.findAll({
          where: {
            patientEmail:
              req.params.email,
          },
        });

      res.json(appointments);
    } catch (error) {
      console.log(
        "GET PATIENT APPOINTMENTS ERROR:"
      );
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };

// Update Status
exports.updateStatus = async (
  req,
  res
) => {
  try {
    const appointment =
      await Appointment.findByPk(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        message:
          "Appointment Not Found",
      });
    }

    appointment.status =
      req.body.status;

    await appointment.save();

    res.json({
      message:
        "Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Prescription
exports.addPrescription =
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findByPk(
          req.params.id
        );

      if (!appointment) {
        return res.status(404).json({
          message:
            "Appointment Not Found",
        });
      }

      appointment.prescription =
        req.body.prescription;

      await appointment.save();

      res.status(200).json({
        success: true,
        message:
          "Prescription Added Successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  };
exports.uploadPrescription = async (
  req,
  res
) => {
  try {
    console.log("FILE RECEIVED:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const appointment =
      await Appointment.findByPk(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        message:
          "Appointment Not Found",
      });
    }

    appointment.prescriptionFile =
      req.file.filename;

    await appointment.save();

    console.log(
      "Saved File:",
      appointment.prescriptionFile
    );

    res.json({
      success: true,
      message:
        "Prescription Uploaded",
      file:
        appointment.prescriptionFile,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};