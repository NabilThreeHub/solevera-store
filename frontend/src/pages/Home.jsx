import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setLoading(false);
    }
  };

  return (
    <div className="pb-5">
      
      {/* ================= HERO BANNER SECTION (AUTOMATIC CAROUSEL) ================= */}
      <div 
        id="soleveraBanner" 
        className="carousel slide carousel-fade mb-5 shadow-lg mt-3 rounded-5 overflow-hidden" 
        data-bs-ride="carousel" 
        data-bs-interval="3000" // Berganti otomatis setiap 3 detik
      >
        {/* Indikator Garis di Bawah Banner */}
        <div className="carousel-indicators" style={{ zIndex: 3 }}>
          <button type="button" data-bs-target="#soleveraBanner" data-bs-slide-to="0" className="active" aria-current="true"></button>
          <button type="button" data-bs-target="#soleveraBanner" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#soleveraBanner" data-bs-slide-to="2"></button>
        </div>

        {/* Lapisan Slide Foto */}
        <div className="carousel-inner">
          
          {/* Slide 1 */}
          <div className="carousel-item active">
            <div 
              className="p-5 text-white text-center d-flex align-items-center justify-content-center position-relative"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('http://localhost:5000/uploads/banner1.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "450px"
              }}
            >
              <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
                <h1 className="display-3 fw-bold mb-3 tracking-wide">solevera.id</h1>
                <p className="fs-5 text-light opacity-75 mb-4">
                  Definisikan gayamu dengan koleksi premium terbaik kami.
                </p>
                <button 
                  className="btn btn-light btn-lg rounded-pill px-5 fw-bold shadow"
                  onClick={() => window.scrollTo({ top: 550, behavior: 'smooth' })}
                >
                  Mulai Belanja
                </button>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item">
            <div 
              className="p-5 text-white text-center d-flex align-items-center justify-content-center position-relative"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('http://localhost:5000/uploads/banner2.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "450px"
              }}
            >
              <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
                <h1 className="display-3 fw-bold mb-3 tracking-wide">NEW ARRIVALS</h1>
                <p className="fs-5 text-light opacity-75 mb-4">
                  Temukan tren fashion up-to-date rilisan terbaru minggu ini.
                </p>
                <button 
                  className="btn btn-light btn-lg rounded-pill px-5 fw-bold shadow"
                  onClick={() => window.scrollTo({ top: 550, behavior: 'smooth' })}
                >
                  Lihat Koleksi
                </button>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item">
            <div 
              className="p-5 text-white text-center d-flex align-items-center justify-content-center position-relative"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url('http://localhost:5000/uploads/banner3.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "450px"
              }}
            >
              <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
                <h1 className="display-3 fw-bold mb-3 tracking-wide">SPECIAL OFFER</h1>
                <p className="fs-5 text-light opacity-75 mb-4">
                  Jangan lewatkan potongan harga spesial khusus untuk pelanggan setia.
                </p>
                <button 
                  className="btn btn-light btn-lg rounded-pill px-5 fw-bold shadow"
                  onClick={() => window.scrollTo({ top: 550, behavior: 'smooth' })}
                >
                  Ambil Promo
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Tombol Navigasi Panah Kiri & Kanan */}
        <button className="carousel-control-prev" type="button" data-bs-target="#soleveraBanner" data-bs-slide="prev" style={{ zIndex: 3 }}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#soleveraBanner" data-bs-slide="next" style={{ zIndex: 3 }}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {/* =========================================================================== */}

      {/* Bagian List Produk */}
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Koleksi Terbaru</h2>
          <span className="badge bg-dark rounded-pill px-3">{products.length} Produk</span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status"></div>
            <p className="mt-2">Memuat koleksi...</p>
          </div>
        ) : (
          <div className="row">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="col-6 col-md-4 col-lg-3 mb-4" key={product.id}>
                  <div className="card h-100 border-0 shadow-sm card-hover">
                    <div className="position-relative overflow-hidden rounded-top">
                      <img
                        src={`http://localhost:5000/uploads/${product.image}`}
                        className="card-img-top"
                        alt={product.name}
                        style={{ 
                          height: "280px", 
                          objectFit: "cover", 
                          transition: "transform 0.5s ease" 
                        }}
                      />
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge bg-dark bg-opacity-75 small">
                          {product.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="card-body d-flex flex-column">
                      <h6 className="fw-bold mb-1 text-dark text-truncate">{product.name}</h6>
                      <p className="text-danger fw-bold mb-3">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </p>
                      <Link
                        to={`/product/${product.id}`}
                        className="btn btn-outline-dark btn-sm rounded-pill mt-auto fw-semibold py-2"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted italic">Belum ada produk tersedia.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;