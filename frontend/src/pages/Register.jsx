import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-page">
      <div className="split-brand">
        <div className="brand-mark">TZW</div>
        <h2>Join the Fire Safety<br/>Management Platform</h2>
        <p>Create an account to start scheduling inspections, logging maintenance, and keeping every extinguisher compliant.</p>
        <ul className="brand-points">
          <li>Quick setup, no installation required</li>
          <li>Secure JWT-based authentication</li>
          <li>Built for Admins, Inspectors &amp; general Users</li>
        </ul>
      </div>
      <div className="split-form">
        <div className="form-wrap">
          <h1>Create your account</h1>
          <p className="muted">Fill in your details to get started</p>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Doe" />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="At least 6 characters" minLength={6} />
            </div>

            <div className="form-group">
              <label>Account Type</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="inspector">Inspector</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;