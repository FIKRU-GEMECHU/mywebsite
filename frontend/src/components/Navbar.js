import { Link, NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated, getUser, logout } from "../Services/auth";

function Navbar() {
  const navigate      = useNavigate();
  const authenticated = isAuthenticated();
  const user          = getUser();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        PORT<span>FOLIO</span>
      </Link>

      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/skills">Service</NavLink>
      <NavLink to="/projects">Portfolio</NavLink>
      <NavLink to="/contact">Contact</NavLink>

      {authenticated ? (
        <>
          <NavLink to="/dashboard" style={{ color: "var(--accent)" }}>Dashboard</NavLink>
          <span className="navbar-user">{user?.name}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
