import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function PatientDashboard() {
  const [doctors, setDoctors] =
    useState([]);

  const [appointment, setAppointment] =
    useState({
      doctorId: "",
      doctorName: "",
      appointmentDate: "",
      reason: "",
    });

  const [myAppointments,
    setMyAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );
  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState("");

  // RBAC
  if (!user) {
    return (
      <div className="container mt-5">
        <h3>Unauthorized Access</h3>
      </div>
    );
  }

  if (user.role !== "patient") {
    return (
      <div className="container mt-5">
        <h3>
          Access Denied - Patient Only
        </h3>
      </div>
    );
  }

  useEffect(() => {
    fetchDoctors();
    fetchMyAppointments();
    fetchMedicalReports();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://localhost:5000/api/auth/doctors",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyAppointments =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            `http://localhost:5000/api/appointments/patient/${user.email}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setMyAppointments(
          response.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const bookAppointment =
    async () => {
      if (
        !appointment.doctorId ||
        !appointment.appointmentDate
      ) {
        return toast.warning(
          "Please select doctor and date"
        );
      }

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(
          "http://localhost:5000/api/appointments",
          {
            patientName:
              user.fullname,
            patientEmail:
              user.email,
            doctorId:
              appointment.doctorId,
            doctorName:
              appointment.doctorName,
            appointmentDate:
              appointment.appointmentDate,
            reason:
              appointment.reason,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Appointment Booked Successfully"
        );

        fetchMyAppointments();

        setAppointment({
          doctorId: "",
          doctorName: "",
          appointmentDate: "",
          reason: "",

        });
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
          "Booking Failed"
        );
      }
    };
  const fetchMedicalReports = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://localhost:5000/api/reports/patient",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setReports(response.data);

    } catch (error) {

      console.log(error);

    }

  };
  const downloadReport = (report) => {

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(25, 118, 210);
    doc.text("SAANVI HOSPITAL MANAGEMENT SYSTEM", 15, 20);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Medical Report", 15, 32);

    autoTable(doc, {
      startY: 40,

      theme: "grid",

      head: [["Field", "Details"]],

      body: [

        ["Patient Name", report.patientName],

        ["Patient Email", report.patientEmail],

        ["Doctor Name", report.doctorName],

        ["Department", report.department],

        ["Diagnosis", report.diagnosis],

        ["Symptoms", report.symptoms],

        ["Treatment", report.treatment],

        ["Medicines", report.medicines],

        ["Remarks", report.remarks || "-"],

        ["Next Visit", report.nextVisit || "-"],

        ["Report Date", report.reportDate],

      ],

      headStyles: {
        fillColor: [25, 118, 210],
      },

    });

    doc.setFontSize(12);

    doc.text(
      "Doctor Signature: ____________________",
      15,
      doc.lastAutoTable.finalY + 20
    );

    doc.text(
      "Hospital Stamp: _____________________",
      15,
      doc.lastAutoTable.finalY + 35
    );

    doc.save(`Medical_Report_${report.id}.pdf`);

  };
  const printReport = (report) => {

    const printWindow = window.open(
      "",
      "_blank"
    );

    printWindow.document.write(`

<html>

<head>

<title>Medical Report</title>

<style>

body{

font-family:Arial;

padding:40px;

}

table{

width:100%;

border-collapse:collapse;

}

td{

border:1px solid #ddd;

padding:10px;

}

h2{

text-align:center;

}

</style>

</head>

<body>

<h2>

SAANVI HOSPITAL MANAGEMENT SYSTEM

</h2>

<h3>

Medical Report

</h3>

<table>

<tr>

<td>Patient</td>

<td>${user.fullname}</td>

</tr>

<tr>

<td>Doctor</td>

<td>${report.doctor?.fullname}</td>

</tr>

<tr>

<td>Department</td>

<td>${report.doctor?.department}</td>

</tr>

<tr>

<td>Appointment Date</td>

<td>${report.Appointment?.appointmentDate}</td>

</tr>

<tr>

<td>Diagnosis</td>

<td>${report.diagnosis}</td>

</tr>

<tr>

<td>Symptoms</td>

<td>${report.symptoms}</td>

</tr>

<tr>

<td>Treatment</td>

<td>${report.treatment}</td>

</tr>

<tr>

<td>Medicines</td>

<td>${report.medicines}</td>

</tr>

<tr>

<td>Remarks</td>

<td>${report.remarks}</td>

</tr>

<tr>

<td>Next Visit</td>

<td>${report.nextVisit}</td>

</tr>

</table>

</body>

</html>

`);

    printWindow.document.close();

    printWindow.print();

  };

  const pendingCount =
    myAppointments.filter(
      (a) => a.status === "Pending"
    ).length;

  const approvedCount =
    myAppointments.filter(
      (a) => a.status === "Approved"
    ).length;

  const filteredDoctors =
    selectedDepartment
      ? doctors.filter(
        (doctor) =>
          doctor.department ===
          selectedDepartment
      )
      : doctors;

  return (
    <DashboardLayout role="Patient">
      <div className="container-fluid">

        {/* Welcome */}
        <div className="card shadow border-0 mb-4">
          <div className="card-body">
            <h2>
              👋 Welcome {user.fullname}
            </h2>

            <p className="text-muted">
              Book and manage your
              appointments.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card bg-primary text-white shadow border-0">
              <div className="card-body text-center">
                <h2>
                  {
                    myAppointments.length
                  }
                </h2>
                <p>
                  Total Appointments
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-warning shadow border-0">
              <div className="card-body text-center">
                <h2>
                  {pendingCount}
                </h2>
                <p>Pending</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-success text-white shadow border-0">
              <div className="card-body text-center">
                <h2>
                  {approvedCount}
                </h2>
                <p>Approved</p>
              </div>
            </div>
          </div>

        </div>

        {/* Book Appointment */}
        <div className="card shadow border-0">
          <div className="card-header bg-success text-white">
            <h4>
              📅 Book Appointment
            </h4>
          </div>

          <div className="card-body">


            {/* Department Dropdown */}
            <select
              className="form-select mb-3"
              value={selectedDepartment}
              onChange={(e) =>
                setSelectedDepartment(
                  e.target.value
                )
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

            {/* Doctor Dropdown */}
            <select
              className="form-select mb-3"
              value={appointment.doctorId}
              onChange={(e) => {
                const doctor =
                  filteredDoctors.find(
                    (d) =>
                      d.id ==
                      e.target.value
                  );

                if (!doctor) return;

                setAppointment({
                  ...appointment,
                  doctorId: doctor.id,
                  doctorName:
                    doctor.fullname,
                });
              }}
            >
              <option value="">
                Select Doctor
              </option>

              {filteredDoctors.map(
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


            <input
              type="date"
              className="form-control mb-3"
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
            <textarea
              className="form-control mb-3"
              rows="3"
              placeholder="Reason for Appointment"
              value={appointment.reason}
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  reason: e.target.value,
                })
              }
            />

            <button
              className="btn btn-success w-100"
              onClick={
                bookAppointment
              }
            >
              Book Appointment
            </button>

          </div>
        </div>

        {/* My Appointments */}
        <div className="card shadow border-0 mt-4">

          <div className="card-header bg-primary text-white">
            <h4>
              📋 My Appointments
            </h4>
          </div>

          <div className="card-body table-responsive">

            <table className="table table-hover">

              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Prescription</th>
                </tr>
              </thead>

              <tbody>

                {myAppointments.length >
                  0 ? (
                  myAppointments.map(
                    (appt) => (
                      <tr
                        key={
                          appt.id
                        }
                      >
                        <td>
                          {
                            appt.doctorName
                          }
                        </td>

                        <td>
                          {
                            appt.appointmentDate
                          }
                        </td>

                        <td>
                          <span
                            className={`badge ${appt.status ===
                              "Approved"
                              ? "bg-success"
                              : appt.status ===
                                "Rejected"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                              }`}
                          >
                            {
                              appt.status
                            }
                          </span>
                        </td>
                        <td>
                          {appt.prescriptionFile ? (
                            <a
                              href={`http://localhost:5000/uploads/prescriptions/${appt.prescriptionFile}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-primary btn-sm"
                            >
                              View Prescription
                            </a>
                          ) : (
                            "Not Uploaded"
                          )}
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="3"
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
        {/* Medical Reports */}
        {/* Medical Reports */}
        <div className="card shadow border-0 mt-4">

          <div className="card-header bg-success text-white">
            <h4 className="mb-0">
              🩺 My Medical Reports
            </h4>
          </div>

          <div className="card-body">

            {reports.length > 0 ? (

              reports.map((report) => (

                <div
                  className="card shadow border-success mb-4"
                  key={report.id}
                >

                  <div className="card-header bg-light d-flex justify-content-between align-items-center">

                    <h5 className="mb-0">
                      📋 Medical Report #{report.id}
                    </h5>

                    <span className="badge bg-success">
                      {report.reportDate}
                    </span>

                  </div>

                  <div className="card-body">

                    <div className="row">

                      <div className="col-md-6 mb-3">
                        <strong>👤 Patient Name</strong>
                        <p>{report.patientName}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <strong>📧 Email</strong>
                        <p>{report.patientEmail}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <strong>👨‍⚕️ Doctor</strong>
                        <p>{report.doctorName}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <strong>🏥 Department</strong>
                        <p>{report.department}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <strong>🩺 Diagnosis</strong>
                        <p>{report.diagnosis}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <strong>🤒 Symptoms</strong>
                        <p>{report.symptoms}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <strong>💉 Treatment</strong>
                        <p>{report.treatment}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <strong>💊 Medicines</strong>
                        <p>{report.medicines}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <strong>📝 Remarks</strong>
                        <p>{report.remarks || "-"}</p>
                      </div>

                      <div className="col-md-6 mb-3">
                        <strong>📅 Next Visit</strong>
                        <p>{report.nextVisit || "-"}</p>
                      </div>

                    </div>

                    <hr />

                    <div className="d-flex gap-2">

                      <button
                        className="btn btn-primary"
                        onClick={() => downloadReport(report)}
                      >
                        📄 Download PDF
                      </button>

                      <button
                        className="btn btn-success"
                        onClick={() => printReport(report)}
                      >
                        🖨️ Print Report
                      </button>

                    </div>

                  </div>

                </div>

              ))

            ) : (

              <div className="text-center py-5">

                <h4>No Medical Reports Found</h4>

                <p className="text-muted">
                  Your doctor has not created any medical report yet.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;