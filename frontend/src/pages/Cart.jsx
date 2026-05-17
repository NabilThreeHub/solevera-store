import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  const removeItem = (index) => {
    let newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Menggunakan Number() untuk memastikan harga dijumlahkan sebagai angka
  const totalPrice = cart.reduce((acc, item) => acc + Number(item.price), 0);

  if (cart.length === 0)
    return <h3 className="text-center mt-5">Keranjang kosong 🛒</h3>;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 fw-bold">Keranjang Belanja</h2>

      {cart.map((item, index) => (
        <div key={index} className="card mb-3 p-3 d-flex flex-row align-items-center shadow-sm">
          {/* PERBAIKAN: Menambahkan /uploads/ pada path URL gambar */}
          <img 
            src={`http://localhost:5000/uploads/${item.image}`} 
            alt={item.name}
            width="80" 
            height="80"
            className="rounded"
            style={{ objectFit: "cover", backgroundColor: "#f8f9fa" }}
            onError={(e) => e.target.src = "https://via.placeholder.com/80"}
          />
          
          <div className="ms-3 flex-grow-1">
            <h5 className="fw-bold mb-1">{item.name}</h5>
            {/* MENAMPILKAN SIZE: Menampilkan ukuran jika user memilih size sebelumnya */}
            {item.size && (
              <p className="mb-1 text-muted small">
                Ukuran: <span className="badge bg-secondary">{item.size}</span>
              </p>
            )}
            {/* REFORMASI: Format rupiah yang lebih rapi */}
            <p className="text-danger fw-semibold mb-0">
              Rp {Number(item.price).toLocaleString("id-ID")}
            </p>
          </div>
          
          <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(index)}>
            Hapus
          </button>
        </div>
      ))}

      <div className="card p-4 mt-4 bg-light border-0 rounded">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">Total Pembayaran:</h4>
          <h3 className="mb-0 text-danger fw-bold">
            Rp {totalPrice.toLocaleString("id-ID")}
          </h3>
        </div>
        <button className="btn btn-dark btn-lg w-100 mt-4 fw-bold shadow-sm" onClick={() => navigate("/checkout")}>
          LANJUT KE CHECKOUT
        </button>
      </div>
    </div>
  );
}

export default Cart;