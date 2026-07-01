const MedicalReport = require("../models/MedicalReport");
const Appointment = require("../models/Appointment");
const User = require("../models/User");



// ======================================
// Create Medical Report
// ======================================

exports.createMedicalReport = async (req, res) => {
  try {

    const appointment = await Appointment.findByPk(
      req.body.appointmentId
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment Not Found",
      });
    }

    const report = await MedicalReport.create({

      appointmentId: req.body.appointmentId,

      patientName: appointment.patientName,

      patientEmail: appointment.patientEmail,

      doctorId: appointment.doctorId,

      doctorName: appointment.doctorName,

      department: req.body.department,

      diagnosis: req.body.diagnosis,

      symptoms: req.body.symptoms,

      treatment: req.body.treatment,

      medicines: req.body.medicines,

      remarks: req.body.remarks,

      nextVisit: req.body.nextVisit,

      reportDate: new Date(),

    });

    res.status(201).json({

      success: true,

      message: "Medical Report Created Successfully",

      report,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// ======================================
// Get All Reports
// ======================================

exports.getAllReports = async (req, res) => {

  try {

    const reports = await MedicalReport.findAll({

      order: [["createdAt", "DESC"]],

    });

    res.json(reports);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: error.message,

    });

  }

};


// ======================================
// Get Reports By Patient Email
// ======================================

exports.getPatientReports = async (req, res) => {

  try {

    const reports = await MedicalReport.findAll({

      where: {

        patientEmail: req.params.email,

      },

      order: [["createdAt", "DESC"]],

    });

    res.json(reports);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: error.message,

    });

  }

};


// ======================================
// Get Report By ID
// ======================================

exports.getReportById = async (req, res) => {

  try {

    const report = await MedicalReport.findByPk(

      req.params.id

    );

    if (!report) {

      return res.status(404).json({

        message: "Medical Report Not Found",

      });

    }

    res.json(report);

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: error.message,

    });

  }

};


// ======================================
// Update Report
// ======================================

exports.updateMedicalReport = async (req, res) => {

  try {

    const report = await MedicalReport.findByPk(

      req.params.id

    );

    if (!report) {

      return res.status(404).json({

        message: "Medical Report Not Found",

      });

    }

    report.department = req.body.department;

    report.diagnosis = req.body.diagnosis;

    report.symptoms = req.body.symptoms;

    report.treatment = req.body.treatment;

    report.medicines = req.body.medicines;

    report.remarks = req.body.remarks;

    report.nextVisit = req.body.nextVisit;

    await report.save();

    res.json({

      success: true,

      message: "Medical Report Updated Successfully",

      report,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: error.message,

    });

  }

};


// ======================================
// Delete Report
// ======================================

exports.deleteMedicalReport = async (req, res) => {

  try {

    const report = await MedicalReport.findByPk(

      req.params.id

    );

    if (!report) {

      return res.status(404).json({

        message: "Medical Report Not Found",

      });

    }

    await report.destroy();

    res.json({

      success: true,

      message: "Medical Report Deleted Successfully",

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      message: error.message,

    });

  }

};


exports.getPatientReports = async (req, res) => {

  try {

    // Get logged-in patient
    const patient = await User.findByPk(req.user.id);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    const reports = await MedicalReport.findAll({

      where: {
        patientEmail: patient.email,
      },

      order: [["createdAt", "DESC"]],

    });

    res.json(reports);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

};