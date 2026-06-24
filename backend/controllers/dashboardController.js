const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.getDashboardStats =
  async (req, res) => {
    try {
      const totalUsers =
        await User.count();

      const totalDoctors =
        await User.count({
          where: {
            role: "doctor",
          },
        });

      const totalPatients =
        await User.count({
          where: {
            role: "patient",
          },
        });

      const totalAppointments =
        await Appointment.count();

      const pendingAppointments =
        await Appointment.count({
          where: {
            status: "Pending",
          },
        });

      const approvedAppointments =
        await Appointment.count({
          where: {
            status: "Approved",
          },
        });

      const rejectedAppointments =
        await Appointment.count({
          where: {
            status: "Rejected",
          },
        });

      res.json({
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        pendingAppointments,
        approvedAppointments,
        rejectedAppointments,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };