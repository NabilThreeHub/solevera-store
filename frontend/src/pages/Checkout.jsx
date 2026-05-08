import { useEffect, useState } from "react";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // ambil cart dari localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    // 🔥 HITUNG TOTAL YANG BENAR
    const totalHarga = savedCart.reduce((sum, item) => {
      return sum + Number(item.price); // paksa jadi number
    }, 0);

    setTotal(totalHarga);
  }, []);

  const handleCheckout = () => {
    alert("Pembayaran berhasil 🎉");
    localStorage.removeItem("cart");
    window.location.href = "/";
  };

  if (cart.length === 0)
    return <h3 className="text-center mt-5">Cart kosong 😢</h3>;

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>

      {cart.map((item, index) => (
        <div key={index} className="card p-3 mt-3">
          <h5>{item.name}</h5>
          <p>Rp {Number(item.price).toLocaleString()}</p>
        </div>
      ))}

      <h3 className="mt-4">
        Total: <span className="text-danger">Rp {total.toLocaleString()}</span>
      </h3>

      <button className="btn btn-success mt-3" onClick={handleCheckout}>
        Bayar Sekarang
      </button>
    </div>
  );
}

export default Checkout;