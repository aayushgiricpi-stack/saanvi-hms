import { Link } from "react-router-dom";

function Sidebar({ role }) {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "calc(100vh - 56px)",
      }}
    >
      <h5 className="mb-4">Menu</h5>

      {/* ================= ADMIN ================= */}

      {role === "Admin" && (
        <>
          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/admin-dashboard"
          >
            📊 Dashboard
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/admin-appointments"
          >
            📅 Appointments
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/admin-medical-records"
          >
            🩺 Medical Records
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/admin-prescriptions"
          >
            💊 Prescriptions
          </Link>
           <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/doctor-patients"
          >
            👨‍⚕️ doctor
          </Link>
           <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/doctor-patients"
          >
            👨‍⚕️ Patients
          </Link>
        </>
      )}

      {/* ================= DOCTOR ================= */}

      {role === "Doctor" && (
        <>
          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/doctor-dashboard"
          >
            📊 Dashboard
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/doctor-patients"
          >
            👨‍⚕️ Patients
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/doctor-appointments"
          >
            📅 Appointments
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/doctor-reports"
          >
            📋 Medical Reports
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/doctor-profile"
          >
            👤 Profile
          </Link>
        </>
      )}

      {/* ================= PATIENT ================= */}

      {role === "Patient" && (
        <>
          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/patient-dashboard"
          >
            📊 Dashboard
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/patient-appointments"
          >
            📅 My Appointments
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/patient-medical-records"
          >
            🩺 Medical Records
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/patient-prescriptions"
          >
            💊 Prescriptions
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/patient-profile"
          >
            👤 Profile
          </Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;