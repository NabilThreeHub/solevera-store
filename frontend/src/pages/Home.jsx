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
      {/* 3. HERO BANNER SECTION */}
      <div className="p-5 mb-5 bg-dark text-white rounded-5 shadow-lg text-center mt-3 position-relative overflow-hidden">
        <div className="container-fluid py-5 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-3 fw-bold mb-3">SOLEVERA STORE</h1>
          <p className="fs-5 text-secondary mb-4">
            Definisikan gayamu dengan koleksi premium terbaik kami.
          </p>
          <button 
            className="btn btn-light btn-lg rounded-pill px-5 fw-bold shadow"
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
          >
            Mulai Belanja
          </button>
        </div>
        {/* Dekorasi Aksen Lingkaran di Banner */}
        <div className="position-absolute top-0 start-0 translate-middle bg-secondary opacity-25 rounded-circle" style={{ width: '300px', height: '300px' }}></div>
      </div>

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
                /* 1. LAYOUT KARTU PRODUK */
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
                      {/* Label Category di atas gambar */}
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