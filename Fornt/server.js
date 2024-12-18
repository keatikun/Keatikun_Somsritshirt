const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

const PORT = 3001;

// อนุญาต CORS สำหรับ Frontend ที่รันบน http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

// เสิร์ฟไฟล์ Static (เช่น CSS, JS)
app.use(express.static(path.join(__dirname, '../../Keatikun_Somsritshirt-main/Fornt/CSS')));
app.use(express.static(path.join(__dirname, '../../Keatikun_Somsritshirt-main/Fornt/JS')));
app.use(express.static(path.join(__dirname, '../../Keatikun_Somsritshirt-main/Fornt/HTML')));
// Route สำหรับส่ง HTML
app.get('/admin', (req, res) => {
    console.log('Request at /admin');
    res.sendFile(path.join(__dirname, '../../Keatikun_Somsritshirt-main/Fornt/HTML/add-product.html'));
});


// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
