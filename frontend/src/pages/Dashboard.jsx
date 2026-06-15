import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      API.get('/reports')
        .then((res) => setStats(res.data.report))
        .catch(() => setStats(null));
    }
  }, [user]);

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <div className="topbar">
          <div>
            <h1>Overview</h1>
            <p className="page-subtitle">Welcome back, {user?.firstName} — here's what's happening today.</p>
          </div>
        </div>

        {user?.role === 'admin' && stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Extinguishers</span>
              <span className="stat-value">{stats.extinguishers.total}</span>
              <span className="stat-sub">{stats.extinguishers.byStatus.active} active</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Added this month</span>
              <span className="stat-value">{stats.extinguishers.monthly}</span>
              <span className="stat-sub">{stats.extinguishers.yearly} this year</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Scheduled Inspections</span>
              <span className="stat-value">{stats.inspections.scheduled}</span>
              <span className="stat-sub">{stats.inspections.total} total</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completed Inspections</span>
              <span className="stat-value">{stats.inspections.completed}</span>
              <span className="stat-sub">{stats.inspections.cancelled} cancelled</span>
            </div>
          </div>
        )}

        <div className="cards-grid">
          <a href="/extinguishers" className="card">
            <h3>🧯 Extinguishers</h3>
            <p>View and manage fire extinguishers across all locations</p>
          </a>
          <a href="/inspections" className="card">
            <h3>📅 Inspections</h3>
            <p>Schedule and track inspections</p>
          </a>
          <a href="/maintenance" className="card">
            <h3>🛠️ Maintenance</h3>
            <p>Log maintenance activities and conditions noted</p>
          </a>
          {user?.role === 'admin' && (
            <a href="/reports" className="card">
              <h3>📊 Reports</h3>
              <p>View real-time stock and inspection reports</p>
            </a>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;