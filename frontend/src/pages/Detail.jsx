import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
// Mengimpor SweetAlert2
import Swal from "sweetalert2";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  // State untuk menampung ukuran yang dipilih pembeli (Default: M)
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Gagal ambil detail:", err);
        Swal.fire({
          icon: "error",
          title: "Gagal memuat",
          text: "Gagal mengambil detail produk dari backend.",
          confirmButtonColor: "#212529"
        });
      }
    };
    fetchProduct();
  }, [id]);

  // Fungsi Tambah ke Keranjang (Tanpa pindah halaman)
  const addToCart = () => {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Menyisipkan properti ukuran terpilih ke objek produk sebelum disimpan
    const productWithSize = { ...product, size: selectedSize };
    
    cart.push(productWithSize);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Menggunakan SweetAlert2 untuk pop-up berhasil masuk keranjang yang interaktif
    Swal.fire({
      icon: "success",
      title: "Berhasil Masuk Keranjang!",
      text: `${product.name} (Size ${selectedSize}) telah ditambahkan.`,
      showConfirmButton: true,
      confirmButtonText: "Lihat Keranjang",
      showCancelButton: true,
      cancelButtonText: "Lanjut Belanja",
      confirmButtonColor: "#212529",
      cancelButtonColor: "#6c757d",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/cart"); // Arahkan ke halaman cart jika klik Lihat Keranjang
      }
    });
  };

  // Fungsi Beli Sekarang (Langsung ke Checkout)
  const buyNow = () => {
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Menyisipkan properti ukuran terpilih ke objek produk sebelum disimpan
    const productWithSize = { ...product, size: selectedSize };
    
    cart.push(productWithSize);
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/checkout");
  };

  if (!product) return <h3 className="text-center mt-5">Loading...</h3>;

  // Mengubah string size dari database ("M,L,XL,XXL") menjadi array
  const availableSizes = product.sizes ? product.sizes.split(",") : ["M", "L", "XL", "XXL"];

  // Pengecekan Kategori untuk Menentukan Jenis Size Chart
  const isBawahan = product.category?.toLowerCase().includes("celana") || 
                    product.category?.toLowerCase().includes("bawahan") || 
                    product.category?.toLowerCase().includes("pants");

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

          {/* ================= PILIHAN SIZE & PANDUAN UKURAN ================= */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="fw-bold text-uppercase small text-muted">Pilih Ukuran:</label>
              {/* Tombol Pemicu Modal Pop-up */}
              <button 
                type="button" 
                className="btn btn-link text-decoration-none text-primary small p-0 fw-semibold" 
                data-bs-toggle="modal" 
                data-bs-target="#sizeChartModal"
                style={{ fontSize: "0.85rem" }}
              >
                📏 Panduan Ukuran {isBawahan ? "(Bawahan)" : "(Atasan)"}
              </button>
            </div>
            
            <div className="d-flex gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`btn ${selectedSize === size ? "btn-dark" : "btn-outline-dark"} px-4 py-2 fw-bold`}
                  onClick={() => setSelectedSize(size)}
                  style={{ minWidth: "55px" }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* ================================================================= */}

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

      {/* Pop-up (Modal) Size Chart Bootstrap */}
      <div className="modal fade" id="sizeChartModal" tabIndex="-1" aria-labelledby="sizeChartModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="sizeChartModalLabel">
                Panduan Ukuran {isBawahan ? "Bawahan" : "Atasan"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              
              {/* KONDISI JIKA PRODUK ADALAH BAWAHAN / CELANA */}
              {isBawahan ? (
                <table className="table table-bordered text-center align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>Size</th>
                      <th>Lingkar Pinggang (cm)</th>
                      <th>Panjang Celana (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold">M (29-30)</td>
                      <td>76 - 80</td>
                      <td>98</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">L (31-32)</td>
                      <td>81 - 85</td>
                      <td>100</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">XL (33-34)</td>
                      <td>86 - 90</td>
                      <td>102</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">XXL (35-36)</td>
                      <td>91 - 95</td>
                      <td>104</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                /* KONDISI JIKA PRODUK ADALAH ATASAN (BAJU/JAKET/SWEATER) */
                <table className="table table-bordered text-center align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>Size</th>
                      <th>Lebar Dada (cm)</th>
                      <th>Panjang Baju (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold">M</td>
                      <td>50</td>
                      <td>70</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">L</td>
                      <td>53</td>
                      <td>72</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">XL</td>
                      <td>56</td>
                      <td>74</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">XXL</td>
                      <td>59</td>
                      <td>76</td>
                    </tr>
                  </tbody>
                </table>
              )}

              <p className="text-muted small mb-0 mt-2">* Toleransi ukuran ±1-2 cm karena proses produksi massal.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Detail;