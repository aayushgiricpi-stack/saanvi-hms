const Appointment = require("../models/Appointment");
const User = require("../models/User");
const sendEmail = require("../services/emailService");
const path = require("path");
  const Notification = require("../models/Notification");

// Create Appointment
// Create Appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      patientName: req.body.patientName,
      patientEmail: req.body.patientEmail,
      doctorId: req.body.doctorId,
      doctorName: req.body.doctorName,
      appointmentDate: req.body.appointmentDate,
      reason: req.body.reason,
      status: "Pending",
    });

    // Find doctor by ID
    const doctor = await User.findByPk(appointment.doctorId);

    // ===========================
    // Email to Patient
    // ===========================

    await sendEmail(
      appointment.patientEmail,
      "Appointment Booked - Saanvi HMS",
      `
      <div style="font-family:Arial;padding:20px">
      
      <h2 style="color:#0d6efd">
      Appointment Request Submitted
      </h2>

      <p>Hello <b>${appointment.patientName}</b>,</p>

      <p>
      Your appointment request has been submitted successfully.
      </p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <td><b>Doctor</b></td>
          <td>${appointment.doctorName}</td>
        </tr>

        <tr>
          <td><b>Date</b></td>
          <td>${appointment.appointmentDate}</td>
        </tr>

        <tr>
          <td><b>Status</b></td>
          <td>Pending</td>
        </tr>

        <tr>
          <td><b>Reason</b></td>
          <td>${appointment.reason}</td>
        </tr>
      </table>

      <br>

      <p>
      You will receive another email once your appointment is approved or rejected.
      </p>

      <hr>

      <b>Saanvi Hospital Management System</b>

      </div>
      `
    );

    // ===========================
    // Email to Doctor
    // ===========================

    if (doctor) {
      await sendEmail(
        doctor.email,
        "New Appointment Request",
        `
        <div style="font-family:Arial;padding:20px">

        <h2 style="color:#198754">
        New Appointment Request
        </h2>

        <p>Hello Dr. <b>${doctor.fullname}</b>,</p>

        <p>
        A new appointment has been booked.
        </p>

        <table border="1" cellpadding="8" cellspacing="0">

        <tr>
        <td><b>Patient</b></td>
        <td>${appointment.patientName}</td>
        </tr>

        <tr>
        <td><b>Email</b></td>
        <td>${appointment.patientEmail}</td>
        </tr>

        <tr>
        <td><b>Date</b></td>
        <td>${appointment.appointmentDate}</td>
        </tr>

        <tr>
        <td><b>Reason</b></td>
        <td>${appointment.reason}</td>
        </tr>

        </table>

        <br>

        Please login to Saanvi HMS and review the appointment.

        <hr>

        <b>Saanvi Hospital Management System</b>

        </div>
        `
      );
    }

    res.status(201).json({
      success: true,
      message: "Appointment Created Successfully",
      appointment,
    });

  } catch (error) {
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
// Update Appointment Status
exports.updateStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment Not Found",
      });
    }

    // Update status
    appointment.status = req.body.status;
    await appointment.save();

    // ===============================
    // APPROVED EMAIL
    // ===============================

    if (appointment.status === "Approved") {
      await sendEmail(
        appointment.patientEmail,
        "Appointment Approved - Saanvi HMS",
        `
        <div style="font-family:Arial;padding:20px">

        <h2 style="color:green">
        Appointment Approved
        </h2>

        <p>Hello <b>${appointment.patientName}</b>,</p>

        <p>
        Your appointment has been approved.
        </p>

        <table border="1" cellpadding="8" cellspacing="0">

          <tr>
            <td><b>Doctor</b></td>
            <td>${appointment.doctorName}</td>
          </tr>

          <tr>
            <td><b>Date</b></td>
            <td>${appointment.appointmentDate}</td>
          </tr>

          <tr>
            <td><b>Status</b></td>
            <td style="color:green">
              Approved
            </td>
          </tr>

        </table>

        <br>

        Please arrive 15 minutes before your appointment.

        <hr>

        <b>Saanvi Hospital Management System</b>

        </div>
        `
      );
    }

    // ===============================
    // REJECTED EMAIL
    // ===============================

    if (appointment.status === "Rejected") {
      await sendEmail(
        appointment.patientEmail,
        "Appointment Rejected - Saanvi HMS",
        `
        <div style="font-family:Arial;padding:20px">

        <h2 style="color:red">
        Appointment Rejected
        </h2>

        <p>Hello <b>${appointment.patientName}</b>,</p>

        <p>
        Unfortunately your appointment request has been rejected.
        </p>

        <table border="1" cellpadding="8" cellspacing="0">

          <tr>
            <td><b>Doctor</b></td>
            <td>${appointment.doctorName}</td>
          </tr>

          <tr>
            <td><b>Date</b></td>
            <td>${appointment.appointmentDate}</td>
          </tr>

          <tr>
            <td><b>Status</b></td>
            <td style="color:red">
              Rejected
            </td>
          </tr>

        </table>

        <br>

        You may book another appointment at your convenience.

        <hr>

        <b>Saanvi Hospital Management System</b>

        </div>
        `
      );
    }

    res.json({
      success: true,
      message: "Appointment Status Updated Successfully",
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
        message: "Appointment Not Found",
      });
    }

    appointment.prescriptionFile =
      req.file.filename;

    await appointment.save();
  

    const patient = await User.findOne({
      where: {
        email: appointment.patientEmail,
      },
    });

    if (patient) {
      await Notification.create({
        userId: patient.id,
        title: "Medical Report Uploaded",
        message: `Dr. ${appointment.doctorName} uploaded your medical report.`,
      });
    }

    // ==========================
    // SEND EMAIL TO PATIENT
    // ==========================
    console.log("FILE OBJECT:");
    console.log(req.file);
    await sendEmail(

      appointment.patientEmail,

      "Prescription Uploaded - Saanvi HMS",

      `
      <div style="font-family:Arial;padding:20px">

      <h2 style="color:#0d6efd">

      Prescription Uploaded

      </h2>

      <p>

      Hello
      <b>${appointment.patientName}</b>,

      </p>

      <p>

      Your doctor has uploaded your prescription.

      </p>

      <p>

      Doctor:
      <b>${appointment.doctorName}</b>

      </p>

      <p>

      Appointment Date:
      <b>${appointment.appointmentDate}</b>

      </p>

      <p>

      The prescription PDF is attached with this email.

      </p>

      <br>

      Get well soon ❤️

      <hr>

      <b>Saanvi Hospital Management System</b>

      </div>
      `,

      [
        {
          filename: req.file.originalname,

          path: path.join(
            __dirname,
            "../uploads/prescriptions",
            req.file.filename
          ),
        },
      ]

    );

    res.json({
      success: true,
      message:
        "Prescription Uploaded & Email Sent",
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
exports.getNotifications = async (req, res) => {
  try {

    const notifications = await Notification.findAll({
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};