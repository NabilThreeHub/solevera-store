import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out!");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">SOLEVERA</Link>
        <div className="d-flex align-items-center">
          <Link className="nav-link text-white me-3" to="/cart">🛒 Cart</Link>
          {user ? (
            <div className="dropdown">
              <button className="btn btn-outline-light dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown">
                Hi, {user.username}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow">
                {user.role === "admin" && (
                  <li><Link className="dropdown-item" to="/admin">Admin Panel</Link></li>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link className="btn btn-primary btn-sm" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;