import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Bar,
  Pie,
  Line,
} from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AdminAnalytics({ stats }) {
  const pieData = {
    labels: ["Doctors", "Patients"],
    datasets: [
      {
        data: [
          stats.totalDoctors || 0,
          stats.totalPatients || 0,
        ],
      },
    ],
  };

  const barData = {
    labels: [
      "Pending",
      "Approved",
      "Rejected",
    ],
    datasets: [
      {
        label: "Appointments",
        data: [
          stats.pendingAppointments || 0,
          stats.approvedAppointments || 0,
          stats.rejectedAppointments || 0,
        ],
      },
    ],
  };

  const lineData = {
    labels: [
      "Users",
      "Doctors",
      "Patients",
      "Appointments",
    ],
    datasets: [
      {
        label: "Hospital Statistics",
        data: [
          stats.totalUsers || 0,
          stats.totalDoctors || 0,
          stats.totalPatients || 0,
          stats.totalAppointments || 0,
        ],
      },
    ],
  };

  return (
    <div className="row mt-4">

      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">
            <h5>🥧 Doctor vs Patient</h5>
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-body">
            <h5>📊 Appointment Status</h5>
            <Bar data={barData} />
          </div>
        </div>
      </div>

      <div className="col-md-12 mt-4">
        <div className="card shadow">
          <div className="card-body">
            <h5>📈 Hospital Trends</h5>
            <Line data={lineData} />
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminAnalytics;