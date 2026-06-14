import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

function DoctorDashboard() {
  const [appointments, setAppointments] =
    useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response =
        await axios.get(
          `http://localhost:5000/api/appointments/doctor/${user.id}`
        );

      setAppointments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (
    appointmentId,
    status
  ) => {
    try {
      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        {
          status,
        }
      );

      alert(
        `Appointment ${status} Successfully`
      );

      fetchAppointments();
    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  return (
    <DashboardLayout role="Doctor">
      <h1 className="mb-4">
        Doctor Dashboard
      </h1>

      {/* Statistics */}
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>
                {appointments.length}
              </h2>
              <p>Total Appointments</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>
                {
                  appointments.filter(
                    (a) =>
                      a.status ===
                      "Pending"
                  ).length
                }
              </h2>
              <p>Pending</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>
                {
                  appointments.filter(
                    (a) =>
                      a.status ===
                      "Approved"
                  ).length
                }
              </h2>
              <p>Approved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="card shadow mt-4">
        <div className="card-header">
          <h4 className="mb-0">
            My Appointments
          </h4>
        </div>

        <div className="card-body">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Email</th>
                <th>Date</th>
                <th>Status</th>
                <th width="220">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {appointments.length >
              0 ? (
                appointments.map(
                  (appointment) => (
                    <tr
                      key={
                        appointment.id
                      }
                    >
                      <td>
                        {
                          appointment.patientName
                        }
                      </td>

                      <td>
                        {
                          appointment.patientEmail
                        }
                      </td>

                      <td>
                        {
                          appointment.appointmentDate
                        }
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            appointment.status ===
                            "Approved"
                              ? "bg-success"
                              : appointment.status ===
                                "Rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {
                            appointment.status
                          }
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            updateStatus(
                              appointment.id,
                              "Approved"
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            updateStatus(
                              appointment.id,
                              "Rejected"
                            )
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center"
                  >
                    No Appointments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;