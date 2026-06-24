const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

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
    reason: {
      type: DataTypes.TEXT,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
    prescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prescriptionFile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }
);

module.exports = Appointment;