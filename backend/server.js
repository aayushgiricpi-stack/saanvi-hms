const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const { connectDB, sequelize } = require("./config/db");
const Notification = require("./models/Notification");
// =========================
// Import Models
// =========================
require("./models/User");
require("./models/Appointment");
require("./models/MedicalReport");

// =========================
// Import Routes
// =========================
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const medicalReportRoutes = require("./routes/medicalReportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// =========================
// Middleware
// =========================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =========================
// Database Connection
// =========================
connectDB();

// =========================
// Static Upload Folder
// =========================
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);
app.use(
  "/api/notifications",
  notificationRoutes
);

// =========================
// Home Route
// =========================
app.get("/", (req, res) => {
  res.send("🏥 Saanvi HMS Backend Running...");
});

// =========================
// API Routes
// =========================
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/appointments",
  appointmentRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/reports",
  medicalReportRoutes
);

// =========================
// Start Server
// =========================
const PORT =
  process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log(
      "✅ Database Synced Successfully"
    );

    app.listen(PORT, () => {
      console.log(
        `🚀 Server Running On Port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(
      "Database Sync Error:"
    );
    console.log(err);
  });