import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Extinguishers = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    serialNumber: '', location: '', type: 'CO2', size: '5 lbs',
    installationDate: '', expiryDate: '', status: 'Active',
  });

  const canEdit = user?.role === 'admin' || user?.role === 'inspector';

  const load = () => {
    API.get('/extinguishers').then((res) => setList(res.data.extinguishers));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ serialNumber: '', location: '', type: 'CO2', size: '5 lbs', installationDate: '', expiryDate: '', status: 'Active' });
    setShowModal(true);
  };

  const openEdit = (ext) => {
    setEditing(ext);
    setForm({
      serialNumber: ext.serialNumber, location: ext.location, type: ext.type,
      size: ext.size, installationDate: ext.installationDate?.slice(0, 10),
      expiryDate: ext.expiryDate?.slice(0, 10), status: ext.status,
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/extinguishers/${editing._id}`, form);
      } else {
        await API.post('/extinguishers', form);
      }
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving extinguisher');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this extinguisher?')) return;
    try {
      await API.delete(`/extinguishers/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting');
    }
  };

  const badgeClass = (status) => {
    if (status === 'Active') return 'badge badge-green';
    if (status === 'Expired') return 'badge badge-red';
    if (status === 'Under Maintenance') return 'badge badge-amber';
    return 'badge badge-gray';
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <div className="topbar">
          <div>
            <h1>Extinguishers</h1>
            <p className="page-subtitle">{list.length} registered across all facilities</p>
          </div>
          {canEdit && <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={openNew}>+ Register extinguisher</button>}
        </div>

        <div className="table-wrap">
          {list.length === 0 ? (
            <div className="empty-state">No extinguishers registered yet.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  {canEdit && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {list.map((ext) => (
                  <tr key={ext._id}>
                    <td>{ext.serialNumber}</td>
                    <td>{ext.location}</td>
                    <td>{ext.type}</td>
                    <td>{ext.size}</td>
                    <td>{ext.expiryDate?.slice(0, 10)}</td>
                    <td><span className={badgeClass(ext.status)}>{ext.status}</span></td>
                    {canEdit && (
                      <td>
                        <button className="icon-btn" onClick={() => openEdit(ext)}>Edit</button>{' '}
                        {user?.role === 'admin' && (
                          <button className="icon-btn danger" onClick={() => handleDelete(ext._id)}>Delete</button>
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
              <h2>{editing ? 'Edit extinguisher' : 'Register new extinguisher'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Serial Number</label>
                  <input name="serialNumber" value={form.serialNumber} onChange={handleChange} required disabled={!!editing} />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input name="location" value={form.location} onChange={handleChange} required placeholder="Building A - Floor 2" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={form.type} onChange={handleChange}>
                      <option>Water</option>
                      <option>CO2</option>
                      <option>Foam</option>
                      <option>Dry Chemical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Size</label>
                    <select name="size" value={form.size} onChange={handleChange}>
                      <option>2.5 lbs</option>
                      <option>5 lbs</option>
                      <option>9 lbs</option>
                      <option>12 lbs</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Installation Date</label>
                    <input type="date" name="installationDate" value={form.installationDate} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option>Active</option>
                    <option>Expired</option>
                    <option>Under Maintenance</option>
                    <option>Decommissioned</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">{editing ? 'Save changes' : 'Register'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Extinguishers;