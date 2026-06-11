import DashboardLayout from "../layouts/DashboardLayout";

function PatientDashboard() {
  return (
    <DashboardLayout role="Patient">
      <h1>Patient Dashboard</h1>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>3</h2>
              <p>Appointments</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>5</h2>
              <p>Medical Reports</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body text-center">
              <h2>2</h2>
              <p>Prescriptions</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;