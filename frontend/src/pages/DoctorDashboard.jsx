import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointments/doctor/${user.id}`
      );

      setAppointments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout role="Doctor">
      <h1>Doctor Dashboard</h1>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>{appointments.length}</h2>
              <p>Appointments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow mt-4">
        <div className="card-header">
          <h4>My Appointments</h4>
        </div>

        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Email</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.patientEmail}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
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