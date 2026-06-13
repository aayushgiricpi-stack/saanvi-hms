import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";

function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);

  const [appointment, setAppointment] = useState({
    doctorId: "",
    doctorName: "",
    appointmentDate: "",
  });

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/doctors"
      );

      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const bookAppointment = async () => {
    if (
      !appointment.doctorId ||
      !appointment.appointmentDate
    ) {
      return alert(
        "Please select doctor and appointment date"
      );
    }

    try {
      await axios.post(
        "http://localhost:5000/api/appointments",
        {
          patientName: user.fullname,
          patientEmail: user.email,
          doctorId: appointment.doctorId,
          doctorName: appointment.doctorName,
          appointmentDate:
            appointment.appointmentDate,
        }
      );

      alert(
        "Appointment Booked Successfully"
      );

      setAppointment({
        doctorId: "",
        doctorName: "",
        appointmentDate: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed To Book Appointment"
      );
    }
  };

  return (
    <DashboardLayout role="Patient">
      <div className="container">
        <div className="card shadow border-0">
          <div className="card-header bg-success text-white">
            <h3 className="mb-0">
              📅 Book Appointment
            </h3>
          </div>

          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">
                Select Doctor
              </label>

              <select
                className="form-select"
                value={appointment.doctorId}
                onChange={(e) => {
                  const doctor =
                    doctors.find(
                      (d) =>
                        d.id ==
                        e.target.value
                    );

                  setAppointment({
                    ...appointment,
                    doctorId:
                      doctor.id,
                    doctorName:
                      doctor.fullname,
                  });
                }}
              >
                <option value="">
                  Choose Doctor
                </option>

                {doctors.map(
                  (doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.fullname}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Appointment Date
              </label>

              <input
                type="date"
                className="form-control"
                value={
                  appointment.appointmentDate
                }
                onChange={(e) =>
                  setAppointment({
                    ...appointment,
                    appointmentDate:
                      e.target.value,
                  })
                }
              />
            </div>

            <button
              className="btn btn-success w-100"
              onClick={bookAppointment}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;