const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const MedicalReport = sequelize.define(
  "MedicalReport",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    symptoms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    treatment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    medicines: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    nextVisit: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    reportDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = MedicalReport;