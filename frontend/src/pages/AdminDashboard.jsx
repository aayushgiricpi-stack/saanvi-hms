import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";
 import AdminAnalytics from "../components/AdminAnalytics";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] =
    useState({});
  const [currentPage, setCurrentPage] =
    useState(1);

  const usersPerPage = 5;
  const [sortBy, setSortBy] =
    useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [doctorForm, setDoctorForm] =
    useState({
      fullname: "",
      email: "",
      phone: "",
      password: "",
      department: "",
    });
  const [editingDoctorId,
    setEditingDoctorId] =
    useState(null);
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
    fetchStats();
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
  const fetchStats = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://localhost:5000/api/dashboard/stats",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createDoctor = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/admin/doctors",
        doctorForm,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Doctor Added Successfully"
      );

      setDoctorForm({
        fullname: "",
        email: "",
        phone: "",
        password: "",
      });

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed To Add Doctor"
      );
    }
  };

  const deleteDoctor = async (id) => {
    if (
      !window.confirm(
        "Delete this doctor?"
      )
    )
      return;

    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/doctors/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Doctor Deleted Successfully"
      );

      fetchUsers();
    } catch (error) {
      toast.error(
        "Failed To Delete Doctor"
      );
    }
  };
  const editDoctor = (doctor) => {
    setEditingDoctorId(
      doctor.id
    );

    setDoctorForm({
      fullname:
        doctor.fullname,
      email: doctor.email,
      phone: doctor.phone,
      password: "",
    });
  };
  const updateDoctor = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/doctors/${editingDoctorId}`,
        {
          fullname: 
            doctorForm.fullname,
          email:
            doctorForm.email,
          phone:
            doctorForm.phone,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Doctor Updated Successfully"
      );

      setEditingDoctorId(null);

      setDoctorForm({
        fullname: "",
        email: "",
        phone: "",
        password: "",
      });

      fetchUsers();
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed To Update Doctor"
      );
    }
  };

  const totalDoctors = users.filter(
    (u) => u.role === "doctor"
  ).length;

  const totalPatients = users.filter(
    (u) => u.role === "patient"
  ).length;

  const totalAdmins = users.filter(
    (u) => u.role === "admin"
  ).length;
  const indexOfLastUser =
    currentPage * usersPerPage;

  const indexOfFirstUser =
    indexOfLastUser - usersPerPage;





  const sortedUsers = [...users].sort(
    (a, b) => {

      if (sortBy === "name") {
        return a.fullname.localeCompare(
          b.fullname
        );
      }

      if (sortBy === "email") {
        return a.email.localeCompare(
          b.email
        );
      }

      if (sortBy === "department") {
        return (
          a.department || ""
        ).localeCompare(
          b.department || ""
        );
      }

      return 0;
    }
  );
  const filteredUsers = sortedUsers.filter((user) => {
    const keyword = searchTerm.toLowerCase();

    return (
      user.fullname?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.phone?.toLowerCase().includes(keyword) ||
      (user.department || "").toLowerCase().includes(keyword)
    );
  });
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
 
  
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
              Manage Doctors,
              Patients and Users
            </p>
          </div>
        </div>

        {/* Statistics */}
        {/* Analytics Dashboard */}
        <div className="row g-3 mb-4">

          <div className="col-md-3">
            <div className="card bg-primary text-white shadow border-0">
              <div className="card-body text-center">
                <h2>{stats.totalUsers || 0}</h2>
                <p>Total Users</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-success text-white shadow border-0">
              <div className="card-body text-center">
                <h2>{stats.totalDoctors || 0}</h2>
                <p>Total Doctors</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-warning shadow border-0">
              <div className="card-body text-center">
                <h2>{stats.totalPatients || 0}</h2>
                <p>Total Patients</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card bg-dark text-white shadow border-0">
              <div className="card-body text-center">
                <h2>{stats.totalAppointments || 0}</h2>
                <p>Total Appointments</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-secondary text-white shadow border-0">
              <div className="card-body text-center">
                <h2>{stats.pendingAppointments || 0}</h2>
                <p>Pending Appointments</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-success text-white shadow border-0">
              <div className="card-body text-center">
                <h2>{stats.approvedAppointments || 0}</h2>
                <p>Approved Appointments</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-danger text-white shadow border-0">
              <div className="card-body text-center">
                <h2>{stats.rejectedAppointments || 0}</h2>
                <p>Rejected Appointments</p>
              </div>
            </div>
          </div>


        </div>


        {/* Add Doctor */}
        <div className="card shadow border-0 mb-4">

          <div className="card-header bg-success text-white">
            <h4 className="mb-0">
              {editingDoctorId
                ? "✏️ Update Doctor"
                : "➕ Add Doctor"}
            </h4>
          </div>

          <div className="card-body">

            <div className="row g-2">

              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  value={
                    doctorForm.fullname
                  }
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      fullname:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={
                    doctorForm.email
                  }
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      email:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                  value={
                    doctorForm.phone
                  }
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      phone:
                        e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <select
                  className="form-control"
                  value={doctorForm.department}
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      department: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Department
                  </option>

                  <option value="Cardiology">
                    Cardiology
                  </option>

                  <option value="Neurology">
                    Neurology
                  </option>

                  <option value="Orthopedics">
                    Orthopedics
                  </option>

                  <option value="Pediatrics">
                    Pediatrics
                  </option>

                  <option value="ENT">
                    ENT
                  </option>

                  <option value="General">
                    General
                  </option>
                </select>
              </div>

              <div className="col-md-2">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={doctorForm.password}
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-2">

                <button
                  className={`btn w-100 ${editingDoctorId
                    ? "btn-warning"
                    : "btn-success"
                    }`}
                  onClick={
                    editingDoctorId
                      ? updateDoctor
                      : createDoctor
                  }
                >
                  {editingDoctorId
                    ? "Update Doctor"
                    : "Add Doctor"}
                </button>

                {editingDoctorId && (
                  <button
                    className="btn btn-secondary w-100 mt-2"
                    onClick={() => {
                      setEditingDoctorId(null);

                      setDoctorForm({
                        fullname: "",
                        email: "",
                        phone: "",
                        password: "",
                        department: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </div>

          </div>

        </div>
       
        <div className="mb-3">

          <select
            className="form-select w-25"
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
          >
            <option value="">
              Sort Users
            </option>

            <option value="name">
              Name (A-Z)
            </option>

            <option value="email">
              Email (A-Z)
            </option>

            <option value="department">
              Department (A-Z)
            </option>

          </select>

        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page when searching
            }}
          />
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
                  <th>Department</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id}>

                      <td>{user.id}</td>

                      <td>
                        {user.fullname}
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        {user.phone}
                      </td>

                      <td>
                        {user.department || "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${user.role === "admin"
                            ? "bg-danger"
                            : user.role === "doctor"
                              ? "bg-success"
                              : "bg-primary"
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        {user.role === "doctor" ? (
                          <>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() =>
                                editDoctor(user)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                deleteDoctor(user.id)
                              }
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
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
        <div className="d-flex justify-content-center align-items-center mt-3">

          <button
            className="btn btn-secondary me-3"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-secondary ms-3"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
          >
            Next
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;