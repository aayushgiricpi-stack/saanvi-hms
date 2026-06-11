import DashboardLayout from "../layouts/DashboardLayout";

function DoctorDashboard() {
  return (
    <DashboardLayout role="Doctor">
      <h1>Doctor Dashboard</h1>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>120</h2>
              <p>Total Patients</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>15</h2>
              <p>Appointments</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>8</h2>
              <p>Reports</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;