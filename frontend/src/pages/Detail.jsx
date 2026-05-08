import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Gagal ambil detail:", err);
        alert("Gagal ambil detail produk dari backend");
      }
    };
    fetchProduct();
  }, [id]);

  // Fungsi Tambah ke Keranjang (Tanpa pindah halaman)
  const addToCart = () => {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produk berhasil ditambah ke keranjang! 🛒");
  };

  // Fungsi Beli Sekarang (Langsung ke Checkout)
  const buyNow = () => {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/checkout");
  };

  if (!product) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container mt-5 mb-5">
      <button className="btn btn-sm btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Kembali
      </button>

      <div className="row align-items-center">
        {/* Kolom Gambar */}
        <div className="col-md-6 text-center mb-4 mb-md-0">
          <img
            src={`http://localhost:5000/uploads/${product.image}`}
            alt={product.name}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "450px", width: "100%", objectFit: "contain", backgroundColor: "#f8f9fa" }}
            onError={(e) => e.target.src = "https://via.placeholder.com/400"}
          />
        </div>

        {/* Kolom Info Produk */}
        <div className="col-md-6 ps-md-5">
          <span className="badge bg-light text-dark border mb-2">{product.category}</span>
          <h1 className="fw-bold mb-2">{product.name}</h1>
          <h3 className="text-danger fw-bold mb-4">
            Rp {Number(product.price).toLocaleString("id-ID")}
          </h3>
          
          <div className="mb-4">
            <h6 className="fw-bold text-uppercase small text-muted">Deskripsi</h6>
            <p className="text-secondary" style={{ lineHeight: "1.6" }}>
              {product.description || "Deskripsi produk belum tersedia untuk saat ini."}
            </p>
          </div>

          <hr className="my-4" />

          {/* Grup Tombol Aksi */}
          <div className="row g-2">
            <div className="col-6">
              <button 
                className="btn btn-outline-dark btn-lg w-100 fw-bold" 
                onClick={addToCart}
                style={{ fontSize: "0.9rem" }}
              >
                + KERANJANG
              </button>
            </div>
            <div className="col-6">
              <button 
                className="btn btn-dark btn-lg w-100 fw-bold shadow-sm" 
                onClick={buyNow}
                style={{ fontSize: "0.9rem" }}
              >
                BELI SEKARANG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;