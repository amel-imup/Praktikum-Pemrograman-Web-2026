const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.static("public"));


// Konfigurasi koneksi ke database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "database_mahasiswa"
});


db.connect((err) => {
  if (err) {
    console.error("Koneksi ke database gagal:", err.message);
    return;
  }
  console.log("Berhasil terhubung ke database MySQL");
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "server backend berjalan!",
    docs: "Akses /api/mahasiswa"
  });
});

// mengambil semua data mahasiswa
app.get("/api/mahasiswa", (req, res) => {
  db.query("SELECT * FROM mahasiswa ORDER BY id DESC", (err, results) =>{
    if (err) return res.status(500).json({ 
        success: false,
        message: err.message,
    });
    res.json(results);
    });
});


// menambahkan data mahasiswa baru
app.post("/api/mahasiswa", (req, res) => {
    const { nama, nim, jurusan, email } = req.body;
    const sql = "INSERT INTO mahasiswa (nama, nim, jurusan, email) VALUES (?, ?, ?, ?)";
    db.query(sql, [nama, nim, jurusan, email], (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message,
        });
        res.json({
            success: true,
            message: "Data mahasiswa berhasil ditambahkan",
        });
    });
});


app.put("/api/mahasiswa/:id", (req, res) => {
    const { id } = req.params;
    const { nama, nim, jurusan, email } = req.body;
    const sql = "UPDATE mahasiswa SET nama = ?, nim = ?, jurusan = ?, email = ? WHERE id = ?";
    db.query(sql, [nama, nim, jurusan, email, id], (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message,
        });
        res.json({
            success: true,
            message: "Data mahasiswa berhasil diperbarui",
        });
    });
});


app.delete("/api/mahasiswa/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM mahasiswa WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message,
        });
        res.json({
            success: true,
            message: "Data mahasiswa berhasil dihapus",
        });
    });
});


app.listen(port, () => {
  console.log("Server berjalan di port:", port);
});