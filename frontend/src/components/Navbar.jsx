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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Mengganti teks biasa menjadi Logo + Teks Brand */}
        <Link className="navbar-brand d-flex align-items-center fw-bold" to="/">
          <img 
            src="http://localhost:5000/uploads/logo.jpg" 
            alt="Solevera Logo" 
            height="35" 
            className="d-inline-block align-top me-2"
            style={{ objectFit: "contain" }}
            onError={(e) => {
              // Jika gambar gagal dimuat (misal server backend mati), tulisan SOLEVERA tetap rapi
              e.target.style.display = 'none';
            }} 
          />
          solevera.id
        </Link>
        
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