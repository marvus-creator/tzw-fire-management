import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Inspections = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [extinguishers, setExtinguishers] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ extinguisher: '', inspector: '', scheduledDate: '', notes: '' });

  const load = () => {
    API.get('/inspections').then((res) => setList(res.data.inspections));
  };

  useEffect(() => {
    load();
    API.get('/extinguishers').then((res) => setExtinguishers(res.data.extinguishers));
    API.get('/auth/users?role=inspector').then((res) => setInspectors(res.data.users));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/inspections', form);
      setShowModal(false);
      setForm({ extinguisher: '', inspector: '', scheduledDate: '', notes: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error scheduling inspection');
    }
  };

  const markCompleted = async (id) => {
    try {
      await API.put(`/inspections/${id}`, { status: 'Completed' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating');
    }
  };

  const badgeClass = (status) => {
    if (status === 'Completed') return 'badge badge-green';
    if (status === 'Cancelled') return 'badge badge-red';
    return 'badge badge-amber';
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <div className="topbar">
          <div>
            <h1>Inspections</h1>
            <p className="page-subtitle">Schedule and track extinguisher inspections</p>
          </div>
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={() => setShowModal(true)}>+ Schedule inspection</button>
        </div>

        <div className="table-wrap">
          {list.length === 0 ? (
            <div className="empty-state">No inspections scheduled yet.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Extinguisher</th>
                  <th>Scheduled Date</th>
                  <th>Inspector</th>
                  <th>Status</th>
                  <th>Notes</th>
                  {(user?.role === 'admin' || user?.role === 'inspector') && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {list.map((insp) => (
                  <tr key={insp._id}>
                    <td>{insp.extinguisher?.serialNumber} — {insp.extinguisher?.location}</td>
                    <td>{insp.scheduledDate?.slice(0, 10)}</td>
                    <td>{insp.inspector ? `${insp.inspector.firstName} ${insp.inspector.lastName}` : '-'}</td>
                    <td><span className={badgeClass(insp.status)}>{insp.status}</span></td>
                    <td>{insp.notes || '-'}</td>
                    {(user?.role === 'admin' || user?.role === 'inspector') && (
                      <td>
                        {insp.status === 'Scheduled' && (
                          <button className="icon-btn" onClick={() => markCompleted(insp._id)}>Mark completed</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Schedule inspection</h2>
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
                  <label>Inspector</label>
                  <select name="inspector" value={form.inspector} onChange={handleChange} required>
                    <option value="">Select inspector</option>
                    {inspectors.map((ins) => (
                      <option key={ins._id} value={ins._id}>
                        {ins.firstName} {ins.lastName} ({ins.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date &amp; Time</label>
                  <input type="datetime-local" name="scheduledDate" value={form.scheduledDate} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <input name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Schedule</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Inspections;