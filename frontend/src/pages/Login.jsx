import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "doctor") {
      navigate("/doctor-dashboard");
    } else {
      navigate("/patient-dashboard");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: "450px" }}>
        <h2 className="text-center mb-4">
          🏥 Saanvi HMS Login
        </h2>

        <div className="d-flex gap-2 mb-4">
          <button
            className={`btn ${
              role === "doctor"
                ? "btn-primary"
                : "btn-outline-primary"
            } flex-fill`}
            onClick={() => setRole("doctor")}
          >
            Doctor
          </button>

          <button
            className={`btn ${
              role === "patient"
                ? "btn-success"
                : "btn-outline-success"
            } flex-fill`}
            onClick={() => setRole("patient")}
          >
            Patient
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="form-control mb-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
          />

          <button
            className="btn btn-dark w-100"
            type="submit"
          >
            Login as {role}
          </button>
        </form>

        {role === "patient" && (
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <Link to="/register">
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;