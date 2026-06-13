const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Appointment = sequelize.define("Appointment", {
  patientName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  patientEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  doctorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "Pending",
  },
});

module.exports = Appointment;