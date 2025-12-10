require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 4000;

// 1. Kết nối Database (Lấy từ create_table.js sang)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) console.error("❌ Kết nối MySQL thất bại: " + err.message);
    else console.log("✅ Đã kết nối MySQL thành công!");
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 2. Cấu hình Upload ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- API 1: ĐĂNG BÀI VIẾT (Lưu vào DB) ---
app.post('/api/add-article', upload.single('image'), (req, res) => {
    const { title, summary, category, content } = req.body;
    let imageUrl = '';

    if (req.file) {
        imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    // Câu lệnh SQL chèn dữ liệu
    const sql = `INSERT INTO articles (title, summary, category, content, image_url) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(sql, [title, summary, category, content, imageUrl], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Lỗi Database' });
        }
        res.status(200).json({ message: 'Đăng bài thành công!', id: result.insertId });
    });
});

// --- API 2: LẤY TẤT CẢ BÀI VIẾT (Cho trang chủ) ---
app.get('/api/articles', (req, res) => {
    // Sắp xếp bài mới nhất lên đầu (ORDER BY created_at DESC)
    const sql = "SELECT * FROM articles ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Lỗi lấy dữ liệu' });
        res.json(results);
    });
});

// --- API 3: LẤY CHI TIẾT 1 BÀI VIẾT (Cho trang detail) ---
app.get('/api/articles/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM articles WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Lỗi server' });
        if (result.length === 0) return res.status(404).json({ message: 'Bài viết không tồn tại' });
        res.json(result[0]); // Trả về object bài viết đầu tiên tìm thấy
    });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});