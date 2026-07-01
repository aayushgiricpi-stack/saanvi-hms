import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";

function DoctorDashboard() {
  const [appointments, setAppointments] =
    useState([]);
  const [
    prescription,
    setPrescription,
  ] = useState("");
  const [selectedFile, setSelectedFile] =
    useState(null);
  const [showReportForm, setShowReportForm] =
    useState(false);

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [reportData, setReportData] = useState({
    diagnosis: "",
    symptoms: "",
    treatment: "",
    medicines: "",
    remarks: "",
    nextVisit: "",
  });

  const user = JSON.parse(
    localStorage.getItem("user")
  );



  // RBAC Access Control
  if (!user) {
    return (
      <div className="container mt-5">
        <h3>Unauthorized Access</h3>
      </div>
    );
  }

  if (user.role !== "doctor") {
    return (
      <div className="container mt-5">
        <h3>
          Access Denied - Doctor Only
        </h3>
      </div>
    );
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          `http://localhost:5000/api/appointments/doctor/${user.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setAppointments(response.data);
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to load appointments"
      );
    }
  };

  const updateStatus = async (
    appointmentId,
    status
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `Appointment ${status}`
      );

      fetchAppointments();
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to update status"
      );
    }
  };
  const savePrescription =
    async (id) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.put(
          `http://localhost:5000/api/appointments/prescription/${id}`,
          {
            prescription,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Prescription Saved"
        );

        fetchAppointments();
      } catch (error) {
        toast.error(
          "Failed To Save Prescription"
        );
      }
    };
  const uploadPrescription =
    async (appointmentId) => {
      try {
        if (!selectedFile) {
          return toast.warning(
            "Please select a file"
          );
        }

        const token =
          localStorage.getItem(
            "token"
          );

        const formData =
          new FormData();

        formData.append(
          "file",
          selectedFile
        );

        await axios.post(
          `http://localhost:5000/api/appointments/upload-prescription/${appointmentId}`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Prescription Uploaded"
        );

        fetchAppointments();
      } catch (error) {
        console.log(error);
        toast.error(
          "Upload Failed"
        );
      }
    };
  const handleReportChange = (e) => {
    setReportData({
      ...reportData,
      [e.target.name]: e.target.value,
    });
  };
  const saveMedicalReport = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/reports",
        {
          appointmentId: selectedAppointment.id,
          department: user.department,
          diagnosis: reportData.diagnosis,
          symptoms: reportData.symptoms,
          treatment: reportData.treatment,
          medicines: reportData.medicines,
          remarks: reportData.remarks,
          nextVisit: reportData.nextVisit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Medical Report Created Successfully");

      setShowReportForm(false);

      setSelectedAppointment(null);

      setReportData({
        diagnosis: "",
        symptoms: "",
        treatment: "",
        medicines: "",
        remarks: "",
        nextVisit: "",
      });

    } catch (error) {
      console.log(error);

      toast.error("Failed to Create Medical Report");
    }
  };

  const pendingCount =
    appointments.filter(
      (a) => a.status === "Pending"
    ).length;

  const approvedCount =
    appointments.filter(
      (a) => a.status === "Approved"
    ).length;

  const rejectedCount =
    appointments.filter(
      (a) => a.status === "Rejected"
    ).length;


  return (
    <DashboardLayout role="Doctor">
      <div className="container-fluid">

        {/* Welcome */}
        <div className="card shadow border-0 mb-4">
          <div className="card-body">
            <h2>
              👨‍⚕️ Welcome Dr.
              {user.fullname}
            </h2>

            <p>
              Department:
              {user.department}
            </p>

            <p className="text-muted">
              Manage patient appointments
              and requests.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="row g-3">

          <div className="col-lg-3 col-md-6">
            <div className="card bg-primary text-white shadow border-0">
              <div className="card-body text-center">
                <h1>📅</h1>
                <h3>
                  {appointments.length}
                </h3>
                <p>Total Appointments</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card bg-warning shadow border-0">
              <div className="card-body text-center">
                <h1>⏳</h1>
                <h3>
                  {pendingCount}
                </h3>
                <p>Pending</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card bg-success text-white shadow border-0">
              <div className="card-body text-center">
                <h1>✅</h1>
                <h3>
                  {approvedCount}
                </h3>
                <p>Approved</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card bg-danger text-white shadow border-0">
              <div className="card-body text-center">
                <h1>❌</h1>
                <h3>
                  {rejectedCount}
                </h3>
                <p>Rejected</p>
              </div>
            </div>
          </div>

        </div>

        {/* Appointments Table */}
        <div className="card shadow border-0 mt-4">

          <div className="card-header bg-dark text-white">
            <h4 className="mb-0">
              📋 My Appointments
            </h4>
          </div>

          <div className="card-body table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Prescription</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment.id}>

                      <td>
                        {appointment.patientName}
                      </td>

                      <td>
                        {appointment.patientEmail}
                      </td>

                      <td>
                        {appointment.appointmentDate}
                      </td>

                      <td>
                        {appointment.reason}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${appointment.status === "Approved"
                            ? "bg-success"
                            : appointment.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                            }`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      {/* Prescription */}
                      <td>
                        {appointment.status === "Approved" ? (
                          appointment.prescriptionFile ? (
                            <span className="badge bg-success">
                              Prescription Uploaded
                            </span>
                          ) : (
                            <>
                              <input
                                type="file"
                                className="form-control mb-2"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                  setSelectedFile(
                                    e.target.files[0]
                                  )
                                }
                              />

                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  uploadPrescription(
                                    appointment.id
                                  )
                                }
                              >
                                Upload Prescription
                              </button>
                            </>
                          )
                        ) : (
                          <span className="text-muted">
                            Approve First
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td>

                        {appointment.status === "Pending" && (
                          <>
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
                          </>
                        )}

                        {appointment.status === "Approved" && (
                          <>
                            <button
                              className="btn btn-info btn-sm mt-2"
                              onClick={() => {
                                setSelectedAppointment(appointment);
                                setShowReportForm(true);
                              }}
                            >
                              🩺 Medical Report
                            </button>
                          </>
                        )}

                        {appointment.status === "Rejected" && (
                          <span className="badge bg-danger">
                            Rejected
                          </span>
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
                      No Appointments Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>
      {showReportForm && (

        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,.5)"
          }}
        >

          <div className="modal-dialog modal-lg">

            <div className="modal-content">

              <div className="modal-header bg-primary text-white">

                <h4>Create Medical Report</h4>

                <button
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setShowReportForm(false)}
                ></button>

              </div>

              <div className="modal-body">

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label>Diagnosis</label>

                    <input
                      type="text"
                      className="form-control"
                      name="diagnosis"
                      value={reportData.diagnosis}
                      onChange={handleReportChange}
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label>Symptoms</label>

                    <input
                      type="text"
                      className="form-control"
                      name="symptoms"
                      value={reportData.symptoms}
                      onChange={handleReportChange}
                    />

                  </div>

                  <div className="col-md-12 mb-3">

                    <label>Treatment</label>

                    <textarea
                      rows="2"
                      className="form-control"
                      name="treatment"
                      value={reportData.treatment}
                      onChange={handleReportChange}
                    />

                  </div>

                  <div className="col-md-12 mb-3">

                    <label>Medicines</label>

                    <textarea
                      rows="2"
                      className="form-control"
                      name="medicines"
                      value={reportData.medicines}
                      onChange={handleReportChange}
                    />

                  </div>

                  <div className="col-md-12 mb-3">

                    <label>Doctor Remarks</label>

                    <textarea
                      rows="2"
                      className="form-control"
                      name="remarks"
                      value={reportData.remarks}
                      onChange={handleReportChange}
                    />

                  </div>

                  <div className="col-md-6">

                    <label>Next Visit</label>

                    <input
                      type="date"
                      className="form-control"
                      name="nextVisit"
                      value={reportData.nextVisit}
                      onChange={handleReportChange}
                    />

                  </div>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setShowReportForm(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={saveMedicalReport}
                >
                  Save Medical Report
                </button>

              </div>

            </div>

          </div>

        </div>

      )}
    </DashboardLayout>
  );
}

export default DoctorDashboard;