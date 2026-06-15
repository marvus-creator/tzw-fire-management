import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch {
      // Even if the server call fails, clear the local session.
    }
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: 'Overview', icon: '◧' },
    { to: '/extinguishers', label: 'Extinguishers', icon: '🧯' },
    { to: '/inspections', label: 'Inspections', icon: '📅' },
    { to: '/maintenance', label: 'Maintenance', icon: '🛠' },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/reports', label: 'Reports', icon: '📊' });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="navbar-logo">TZW</div>
        <span>Fire Management</span>
      </div>

      <nav className="sidebar-links">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`sidebar-link ${location.pathname === l.to ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/profile" className="sidebar-user" title="View profile">
          <div className="avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
          <div>
            <div className="sidebar-name">{user?.firstName} {user?.lastName}</div>
            <div className="navbar-role">{user?.role}</div>
          </div>
        </Link>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </aside>
  );
};

export default Navbar;