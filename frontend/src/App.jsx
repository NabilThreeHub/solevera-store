import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Pastikan path ini benar
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      {/* Navbar ditaruh di sini agar muncul di SEMUA halaman */}
      <Navbar /> 

      {/* Pembungkus agar konten tidak terlalu mepet ke pinggir layar */}
      <div className="container shadow-sm p-3 bg-white rounded mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Detail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;