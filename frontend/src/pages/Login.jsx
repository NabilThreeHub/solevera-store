import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { email, password });
      
      // Simpan Token & Data User
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Berhasil! Lest Go! 🔥");
      
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login Gagal, Cek Email/Password");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow border-0 p-4">
            <h2 className="text-center fw-bold mb-4">SOLEVERA</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="admin@solevera.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="admin123"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-dark w-100 py-2 fw-bold">LOGIN</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;