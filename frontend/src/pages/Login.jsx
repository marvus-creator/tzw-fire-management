import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-page">
      <div className="split-brand">
        <div className="brand-mark">TZW</div>
        <h2>Fire Extinguisher<br/>Management System</h2>
        <p>Track inspections, schedule maintenance, and monitor extinguisher compliance across every facility in real time.</p>
        <ul className="brand-points">
          <li>Role-based access for Admins, Inspectors &amp; Users</li>
          <li>Live extinguisher stock &amp; expiry tracking</li>
          <li>Inspection scheduling with instant notifications</li>
        </ul>
      </div>
      <div className="split-form">
        <div className="form-wrap">
          <h1>Sign in to your account</h1>
          <p className="muted">Enter your credentials to access the dashboard</p>

          {error && <div className="alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@company.com" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Enter your password" />
            </div>

            <div className="form-aux">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="auth-footer">
            New to the platform? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;