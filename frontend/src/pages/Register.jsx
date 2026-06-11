import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Patient Registered Successfully");
    navigate("/");
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: "500px" }}>
        <h2 className="text-center mb-4">
          Patient Registration
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full Name"
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Phone Number"
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
          />

          <button
            className="btn btn-success w-100"
            type="submit"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;