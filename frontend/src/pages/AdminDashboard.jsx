import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // RBAC
  if (!user) {
    return (
      <div className="container mt-5">
        <h3>Unauthorized Access</h3>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="container mt-5">
        <h3>Access Denied - Admin Only</h3>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://localhost:5000/api/auth/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setUsers(response.data);
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to load users"
      );
    }
  };

  const doctors = users.filter(
    (u) => u.role === "doctor"
  );

  const patients = users.filter(
    (u) => u.role === "patient"
  );

  return (
    <DashboardLayout role="Admin">
      <div className="container-fluid">

        {/* Welcome */}
        <div className="card shadow border-0 mb-4">
          <div className="card-body">
            <h2>
              👨‍💼 Welcome {user.fullname}
            </h2>

            <p className="text-muted">
              Manage users and monitor
              hospital activities.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card bg-primary text-white shadow">
              <div className="card-body text-center">
                <h2>{users.length}</h2>
                <p>Total Users</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-success text-white shadow">
              <div className="card-body text-center">
                <h2>{doctors.length}</h2>
                <p>Total Doctors</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-warning shadow">
              <div className="card-body text-center">
                <h2>{patients.length}</h2>
                <p>Total Patients</p>
              </div>
            </div>
          </div>

        </div>

        {/* Users Table */}
        <div className="card shadow border-0">

          <div className="card-header bg-dark text-white">
            <h4 className="mb-0">
              👥 All Users
            </h4>
          </div>

          <div className="card-body table-responsive">

            <table className="table table-hover">

              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>

                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullname}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>

                      <td>
                        <span
                          className={`badge ${
                            user.role ===
                            "admin"
                              ? "bg-danger"
                              : user.role ===
                                "doctor"
                              ? "bg-success"
                              : "bg-primary"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center"
                    >
                      No Users Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;