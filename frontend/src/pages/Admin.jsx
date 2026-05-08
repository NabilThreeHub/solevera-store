import { useEffect, useState } from "react";
import API from "../services/api";

function Admin() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: ""
  });

  // 1. Ambil data produk
  const getProducts = async () => {
    try {
      // baseURL sudah /api, jadi cukup /products
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // 2. Handle Submit (Tambah & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("description", form.description);
    if (file) {
      formData.append("image", file);
    }

    try {
      if (editingId) {
        // Mode Edit
        await API.put(`/products/${editingId}`, formData);
        alert("Produk berhasil diperbarui! ✨");
      } else {
        // Mode Tambah
        await API.post("/products", formData);
        alert("Produk berhasil ditambahkan! 🚀");
      }

      // Reset Form & Refresh Data
      resetForm();
      getProducts();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  // 3. Handle Edit (Isi form dengan data lama)
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || ""
    });
  };

  // 4. Handle Delete
  const deleteProduct = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini? 🗑️")) {
      await API.delete(`/products/${id}`);
      getProducts();
    }
  };

  const resetForm = () => {
    setForm({ name: "", price: "", category: "", description: "" });
    setFile(null);
    setEditingId(null);
    document.getElementById("fileInput").value = ""; // Reset input file manual
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="fw-bold mb-4">ADMIN PANEL</h2>

      {/* --- FORM PANEL --- */}
      <div className="card p-4 shadow-sm border-0 mb-5">
        <h5 className={`fw-bold ${editingId ? "text-primary" : "text-dark"}`}>
          {editingId ? "📝 Edit Produk" : "➕ Tambah Produk Baru"}
        </h5>
        <hr />
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold">Nama Produk</label>
              <input
                className="form-control"
                placeholder="Contoh: Sepatu Sneakers"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label small fw-bold">Harga (Rp)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Contoh: 150000"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Kategori</label>
            <input
              className="form-control"
              placeholder="Baju / Celana / Aksesoris"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Deskripsi</label>
            <textarea
              className="form-control"
              rows="2"
              placeholder="Detail produk..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">Upload Gambar</label>
            <input
              id="fileInput"
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            {editingId && <small className="text-muted italic">*Kosongkan jika tidak ingin mengganti gambar</small>}
          </div>

          <div className="d-flex gap-2">
            <button className={`btn ${editingId ? "btn-primary" : "btn-dark"} px-4`}>
              {editingId ? "Simpan Perubahan" : "Tambah Produk"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* --- LIST TABLE --- */}
      <h4 className="fw-bold mb-3">Daftar Produk</h4>
      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>Gambar</th>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Kategori</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/50")}
                  />
                </td>
                <td className="fw-bold">{item.name}</td>
                <td>Rp {Number(item.price).toLocaleString("id-ID")}</td>
                <td><span className="badge bg-secondary">{item.category}</span></td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(item.id)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;