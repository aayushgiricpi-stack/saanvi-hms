import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import DoctorDashboard from "../pages/DoctorDashboard";
import PatientDashboard from "../pages/PatientDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/doctor-dashboard"
        element={<DoctorDashboard />}
      />

      <Route
        path="/patient-dashboard"
        element={<PatientDashboard />}
      />
    </Routes>
  );
}

export default AppRoutes;