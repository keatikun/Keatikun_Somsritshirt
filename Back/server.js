const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require("dotenv");


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());  // สำหรับการรับข้อมูลในรูปแบบ JSON
app.use(express.urlencoded({ extended: true }));  // สำหรับการรับข้อมูลจากฟอร์มในรูปแบบ URL-encoded


// ตั้งค่าการเชื่อมต่อ MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// เชื่อมต่อฐานข้อมูล
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});


//------------------------------------START PRODUCT------------------------------------//
// API สำหรับดึงข้อมูลสินค้า
app.get('/products', (req, res) => {
    const sql = `SELECT 
    product_id, product_name, 
    product_price, product_quantity, 
    product_size, product_status FROM product`;

    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results); // ส่งข้อมูล JSON ไปยัง client
    });
});
// Add a new product
app.post('/add/products', (req, res) => {
    const { product_name, product_price, product_quantity, product_size, product_status = 'Activate' } = req.body;  // กำหนดค่าเริ่มต้นให้ product_status เป็น 'Activate'

    // ตรวจสอบว่ามีข้อมูลครบหรือไม่
    if (!product_name || !product_price || !product_quantity || !product_size) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const sql = `INSERT INTO product (product_name, product_price, product_quantity, product_size, product_status) 
                 VALUES (?, ?, ?, ?, ?)`;  // เพิ่ม ? สำหรับ product_status

    db.query(sql, [product_name, product_price, product_quantity, product_size, product_status], (err, results) => {
        if (err) {
            console.error('Error inserting product:', err);
            return res.status(500).json({ message: 'Error adding product.' });
        }
        res.status(201).json({ message: 'Product added successfully!' });
    });
});


// Delete a product
app.delete('/delete/products/:id', (req, res) => {
    const productId = req.params.id;

    const sql = `DELETE FROM product WHERE product_id = ?`;

    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json({ message: 'Error deleting product.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json({ message: 'Product deleted successfully!' });
    });
});




// Update an existing product
app.put('/update/products/:id', (req, res) => {
    const productId = req.params.id;
    const { product_name, product_price, product_quantity, product_size, product_status } = req.body;

    // สร้างตัวแปรที่ใช้เก็บค่าที่จะอัปเดต
    let updatedFields = [];
    let updatedValues = [];

    // เช็คแต่ละฟิลด์และเพิ่มลงใน array ถ้าค่ามีอยู่
    if (product_name) {
        updatedFields.push('product_name = ?');
        updatedValues.push(product_name);
    }
    if (product_price) {
        updatedFields.push('product_price = ?');
        updatedValues.push(product_price);
    }
    if (product_quantity) {
        updatedFields.push('product_quantity = ?');
        updatedValues.push(product_quantity);
    }
    if (product_size) {
        updatedFields.push('product_size = ?');
        updatedValues.push(product_size);
    }

    if (product_status) {
        updatedFields.push('product_status = ?');
        updatedValues.push(product_status);
    }

    // ตรวจสอบว่าอย่างน้อยหนึ่งฟิลด์ได้รับการอัปเดตหรือไม่
    if (updatedFields.length === 0) {
        return res.status(400).json({ message: 'At least one field is required to update.' });
    }

    // เพิ่ม product_id ลงในค่า query
    updatedValues.push(productId);

    const sql = `UPDATE product 
                 SET ${updatedFields.join(', ')} 
                 WHERE product_id = ?`;

    db.query(sql, updatedValues, (err, results) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json({ message: 'Error updating product.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        res.json({ message: 'Product updated successfully!' });
    });
});




// เริ่มเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});