import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Maintenance = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [extinguishers, setExtinguishers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ extinguisher: '', actionTaken: '', dateOfAction: '', conditionsNoted: '' });

  const canLog = user?.role === 'admin' || user?.role === 'inspector';

  const load = () => {
    API.get('/maintenance').then((res) => setList(res.data.logs));
  };

  useEffect(() => {
    load();
    API.get('/extinguishers').then((res) => setExtinguishers(res.data.extinguishers));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/maintenance', form);
      setShowModal(false);
      setForm({ extinguisher: '', actionTaken: '', dateOfAction: '', conditionsNoted: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error logging maintenance');
    }
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <div className="topbar">
          <div>
            <h1>Maintenance</h1>
            <p className="page-subtitle">Maintenance activities and conditions noted</p>
          </div>
          {canLog && <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={() => setShowModal(true)}>+ Log maintenance</button>}
        </div>

        <div className="table-wrap">
          {list.length === 0 ? (
            <div className="empty-state">No maintenance logs yet.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Extinguisher</th>
                  <th>Action taken</th>
                  <th>Date</th>
                  <th>Conditions noted</th>
                  <th>Inspector</th>
                </tr>
              </thead>
              <tbody>
                {list.map((log) => (
                  <tr key={log._id}>
                    <td>{log.extinguisher?.serialNumber} — {log.extinguisher?.location}</td>
                    <td>{log.actionTaken}</td>
                    <td>{log.dateOfAction?.slice(0, 10)}</td>
                    <td>{log.conditionsNoted}</td>
                    <td>{log.inspector?.firstName} {log.inspector?.lastName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Log maintenance activity</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Extinguisher</label>
                  <select name="extinguisher" value={form.extinguisher} onChange={handleChange} required>
                    <option value="">Select extinguisher</option>
                    {extinguishers.map((ext) => (
                      <option key={ext._id} value={ext._id}>{ext.serialNumber} — {ext.location}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Action taken</label>
                  <input name="actionTaken" value={form.actionTaken} onChange={handleChange} required placeholder="Refilled CO2, replaced gauge..." />
                </div>
                <div className="form-group">
                  <label>Date of action</label>
                  <input type="date" name="dateOfAction" value={form.dateOfAction} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Conditions noted</label>
                  <input name="conditionsNoted" value={form.conditionsNoted} onChange={handleChange} required placeholder="Minor corrosion on base..." />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save log</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Maintenance;