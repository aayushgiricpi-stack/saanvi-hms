import { Routes, Route }
from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import DoctorDashboard
from "../pages/DoctorDashboard";

import PatientDashboard
from "../pages/PatientDashboard";

import ProtectedRoute
from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute
            allowedRole="doctor"
          >
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient-dashboard"
        element={
          <ProtectedRoute
            allowedRole="patient"
          >
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;