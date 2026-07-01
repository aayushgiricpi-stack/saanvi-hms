import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password,
        }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/");
      }, 2500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset link expired"
      );
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">

      <div
        className="card shadow mx-auto"
        style={{ maxWidth: "500px" }}
      >

        <div className="card-body">

          <h2 className="text-center mb-4">
            Reset Password
          </h2>

          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">

              <label className="form-label">
                New Password
              </label>

              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>

            <div className="mb-3">

              <label className="form-label">
                Confirm Password
              </label>

              <input
                type="password"
                className="form-control"
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

            </div>

            <button
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Reset Password"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default ResetPassword;