import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const Reports = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/reports')
      .then((res) => setReport(res.data.report))
      .catch((err) => setError(err.response?.data?.message || 'Error loading reports'));
  }, []);

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <div className="topbar">
          <div>
            <h1>Reports</h1>
            <p className="page-subtitle">Real-time extinguisher stock and inspection status</p>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {report && (
          <>
            <h3 style={{ marginBottom: 12, fontSize: 15 }}>Extinguisher stock</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total in stock</span>
                <span className="stat-value">{report.extinguishers.total}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Added today</span>
                <span className="stat-value">{report.extinguishers.daily}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Added this month</span>
                <span className="stat-value">{report.extinguishers.monthly}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Added this year</span>
                <span className="stat-value">{report.extinguishers.yearly}</span>
              </div>
            </div>

            <h3 style={{ margin: '24px 0 12px', fontSize: 15 }}>By status</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Active</span>
                <span className="stat-value">{report.extinguishers.byStatus.active}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Expired</span>
                <span className="stat-value">{report.extinguishers.byStatus.expired}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Under maintenance</span>
                <span className="stat-value">{report.extinguishers.byStatus.underMaintenance}</span>
              </div>
            </div>

            <h3 style={{ margin: '24px 0 12px', fontSize: 15 }}>Inspection status</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total inspections</span>
                <span className="stat-value">{report.inspections.total}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Scheduled</span>
                <span className="stat-value">{report.inspections.scheduled}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{report.inspections.completed}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Cancelled</span>
                <span className="stat-value">{report.inspections.cancelled}</span>
              </div>
            </div>

            {report.maintenance && (
              <>
                <h3 style={{ margin: '24px 0 12px', fontSize: 15 }}>Maintenance activity</h3>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-label">Total logs</span>
                    <span className="stat-value">{report.maintenance.total}</span>
                  </div>
                  <div className="stat-card">
                    <span className="stat-label">This month</span>
                    <span className="stat-value">{report.maintenance.monthly}</span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Reports;