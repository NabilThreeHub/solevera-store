const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Secret Key untuk JWT
const JWT_SECRET = "solevera_secret_key_123";

// Akses folder uploads agar gambar muncul di browser
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Database Connection menggunakan Pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
}).promise();

// Cek Koneksi Database
db.getConnection()
  .then(() => console.log("✅ MySQL Connected Successfully"))
  .catch((err) => console.log("❌ Database Connection Failed:", err));

// Konfigurasi Multer (Upload Gambar)
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, "public/uploads"); },
  filename: (req, file, cb) => { cb(null, Date.now() + "-" + file.originalname); }
});
const upload = multer({ storage: storage });

/* ===============================
    AUTH API (LOGIN & REGISTER)
================================ */

// REGISTER (Gunakan ini untuk membuat akun admin/user pertama kali)
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role || "user"]
    );
    res.json({ message: "Registrasi berhasil!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal registrasi, email mungkin sudah ada." });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Password salah!" });

    const token = jwt.sign(
      { id: user.id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      message: "Login Berhasil!", 
      token, 
      user: { id: user.id, username: user.username, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ message: "Error pada server" });
  }
});

/* ===============================
    PRODUCT API
================================ */

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error server" });
  }
});

app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const image = req.file ? req.file.filename : "";
    await db.query(
      "INSERT INTO products (name, price, category, image, description) VALUES (?, ?, ?, ?, ?)",
      [name, price, category, image, description || ""]
    );
    res.json({ message: "Berhasil" });
  } catch (err) {
    res.status(500).json({ message: "Gagal simpan ke Database" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));