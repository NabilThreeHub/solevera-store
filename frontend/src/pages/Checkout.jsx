import { useEffect, useState } from "react";
// Mengimpor SweetAlert2
import Swal from "sweetalert2";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  
  // State baru untuk menyimpan metode pembayaran pilihan user (Default: qris)
  const [paymentMethod, setPaymentMethod] = useState("qris");

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
    // Mengubah text alert agar menampilkan metode pembayaran yang dipilih
    let labelMetode = "";
    if (paymentMethod === "qris") labelMetode = "QRIS (Otomatis)";
    if (paymentMethod === "bca") labelMetode = "Transfer Bank BCA";
    if (paymentMethod === "mandiri") labelMetode = "Transfer Bank Mandiri";

    // Menggunakan SweetAlert2 untuk pop-up berhasil pesan yang estetik
    Swal.fire({
      icon: "success",
      title: "Pesanan Berhasil! 🎉",
      html: `Pembayaran menggunakan <b>${labelMetode}</b> sukses.<br>Terima kasih telah berbelanja di Solevera Store.`,
      confirmButtonColor: "#212529", // Warna gelap serasi dengan tema web
      confirmButtonText: "Kembali ke Beranda",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("cart");
        window.location.href = "/";
      }
    });
  };

  if (cart.length === 0)
    return <h3 className="text-center mt-5">Cart kosong 😢</h3>;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="fw-bold mb-4">Checkout</h2>

      <div className="row g-4">
        {/* KOLOM KIRI: KONFIRMASI PEMBAYARAN & PILIHAN METODE */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm border-0 bg-light">
            <h5 className="fw-bold mb-3">Pilih Metode Pembayaran</h5>
            
            {/* Opsi 1: QRIS */}
            <div className="form-check card p-3 mb-2 border-0 bg-white shadow-sm flex-row align-items-center">
              <input 
                className="form-check-input mt-0 me-2" 
                type="radio" 
                name="payment" 
                id="payQris" 
                value="qris"
                checked={paymentMethod === "qris"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label fw-semibold flex-grow-1" htmlFor="payQris">
                📸 QRIS / ShopeePay / GoPay (Instant)
              </label>
            </div>

            {/* Opsi 2: Bank BCA */}
            <div className="form-check card p-3 mb-2 border-0 bg-white shadow-sm flex-row align-items-center">
              <input 
                className="form-check-input mt-0 me-2" 
                type="radio" 
                name="payment" 
                id="payBca" 
                value="bca"
                checked={paymentMethod === "bca"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label fw-semibold flex-grow-1" htmlFor="payBca">
                🏦 Transfer Bank BCA (Manual Verification)
              </label>
            </div>

            {/* Opsi 3: Bank Mandiri */}
            <div className="form-check card p-3 mb-2 border-0 bg-white shadow-sm flex-row align-items-center">
              <input 
                className="form-check-input mt-0 me-2" 
                type="radio" 
                name="payment" 
                id="payMandiri" 
                value="mandiri"
                checked={paymentMethod === "mandiri"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label fw-semibold flex-grow-1" htmlFor="payMandiri">
                🏦 Transfer Bank Mandiri
              </label>
            </div>

            <hr className="my-4" />
            
            <h4 className="mb-3">
              Total Tagihan: <span className="text-danger fw-bold">Rp {total.toLocaleString("id-ID")}</span>
            </h4>

            <button className="btn btn-dark btn-lg w-100 fw-bold mt-2 shadow-sm" onClick={handleCheckout}>
              Bayar Sekarang
            </button>
          </div>
        </div>

        {/* KOLOM KANAN: RINGKASAN PRODUK + FOTO & SIZE */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm border-0">
            <h5 className="fw-bold mb-3">Ringkasan Pesanan</h5>
            <hr className="mt-0 mb-3" />

            {cart.map((item, index) => (
              <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                <img 
                  src={`http://localhost:5000/uploads/${item.image}`} 
                  alt={item.name} 
                  width="75" 
                  height="75" 
                  className="rounded me-3 shadow-sm"
                  style={{ objectFit: "cover", backgroundColor: "#f8f9fa" }}
                  onError={(e) => e.target.src = "https://via.placeholder.com/75"}
                />
                
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1 text-truncate" style={{ maxWidth: "250px" }}>
                    {item.name}
                  </h6>
                  
                  {item.size && (
                    <p className="mb-1 text-muted small">
                      Ukuran: <span className="badge bg-secondary opacity-75">{item.size}</span>
                    </p>
                  )}
                  
                  <p className="text-danger fw-semibold mb-0 small">
                    Rp {Number(item.price).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;