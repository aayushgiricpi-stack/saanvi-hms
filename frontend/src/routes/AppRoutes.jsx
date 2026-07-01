import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import ProtectedRoute from "../components/ProtectedRoute";

// Dashboards
import AdminDashboard from "../pages/AdminDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import PatientDashboard from "../pages/PatientDashboard";

// ================= ADMIN =================
import AdminAppointments from "../pages/admin/Appointments";
import AdminMedicalRecords from "../pages/admin/MedicalRecords";
import AdminPrescriptions from "../pages/admin/Prescriptions";
// import AdminProfile from "../pages/admin/Profile";


// ================= DOCTOR =================
import DoctorAppointments from "../pages/doctor/Appoinments";
import DoctorPatients from "../pages/doctor/Patients";
import DoctorReports from "../pages/doctor/Reports";
import DoctorProfile from "../pages/doctor/Profile";

// ================= PATIENT =================
import PatientAppointments from "../pages/patient/MyAppointments";
import PatientMedicalRecords from "../pages/patient/MedicalRecords";
import PatientPrescriptions from "../pages/patient/Prescriptions";
import PatientProfile from "../pages/patient/Profile";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-appointments"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-medical-records"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminMedicalRecords />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-prescriptions"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminPrescriptions />
          </ProtectedRoute>
        }
      />


      {/* <Route
        path="/admin-profile"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminProfile />
          </ProtectedRoute>
        }
      /> */}


      {/* ================= DOCTOR ================= */}

      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-appointments"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-patients"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorPatients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-reports"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-profile"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorProfile />
          </ProtectedRoute>
        }
      />

      {/* ================= PATIENT ================= */}

      <Route
        path="/patient-dashboard"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient-appointments"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientAppointments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient-medical-records"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientMedicalRecords />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient-prescriptions"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientPrescriptions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient-profile"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

    </Routes>
  );
}

export default AppRoutes;