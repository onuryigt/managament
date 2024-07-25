const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Veritabanı bağlantısı
const db = mysql.createConnection({
    host: 'localhost',
    user: 'onur',
    password: 'S8ec87syf2jF',
    database: 'restaurant_management',
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

// Statik dosyalar için
app.use(express.static(path.join(__dirname, 'build')));

// Diğer middleware ve route tanımlamaları

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Dosya yükleme için multer konfigürasyonu
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

const upload = multer({ storage: storage });

// Harcama Raporu Yükleme Endpoint'i
app.post('/api/upload-expense', upload.single('file'), (req, res) => {
    const managerId = req.body.managerId;
    const fileName = req.file.filename;
    const query = 'INSERT INTO expense_reports (manager_id, file_name, upload_date) VALUES (?, ?, NOW())';

    db.query(query, [managerId, fileName], (err, result) => {
        if (err) {
            console.error('Error saving expense report:', err);
            return res.status(500).send('Error saving report');
        }
        res.status(200).send('Report uploaded successfully');
    });
});

// Login Endpoint'i
app.post('/login', (req, res) => {
    const { password } = req.body;
    const query = 'SELECT * FROM users WHERE password = ?';

    db.query(query, [password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length > 0) {
            const token = jwt.sign({ id: results[0].id }, 'your_secret_key', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Şifre yanlış' });
        }
    });
});

// Diğer endpoint'ler burada yer alacak...

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// Gün Sonu Yapma Endpoint'i
app.post('/api/end-of-day', (req, res) => {
    const { managerId, report } = req.body;

    const query = 'INSERT INTO end_of_day_reports (manager_id, report, date) VALUES (?, ?, NOW())';

    db.query(query, [managerId, report], (err, result) => {
        if (err) {
            console.error('Error saving end of day report:', err);
            return res.status(500).send('Error saving report');
        }
        res.status(200).send('Report saved successfully');
    });
});

// Stok Sayımı Yükleme Endpoint'i
app.post('/api/upload-stock', upload.single('file'), (req, res) => {
    const managerId = req.body.managerId;
    const fileName = req.file.filename;

    const query = 'INSERT INTO stock_reports (manager_id, file_name, upload_date) VALUES (?, ?, NOW())';

    db.query(query, [managerId, fileName], (err, result) => {
        if (err) {
            console.error('Error saving stock report:', err);
            return res.status(500).send('Error saving report');
        }
        res.status(200).send('Report uploaded successfully');
    });
});

// Eleman Ekleme Endpoint'i
app.post('/api/add-employee', (req, res) => {
    const { name, phone, role, hourlyRate } = req.body;

    const query = 'INSERT INTO employees (name, phone, role, hourly_rate) VALUES (?, ?, ?, ?)';

    db.query(query, [name, phone, role, hourlyRate], (err, result) => {
        if (err) {
            console.error('Error adding employee:', err);
            return res.status(500).send('Error adding employee');
        }
        res.status(200).send('Employee added successfully');
    });
});

// Elemanları Getirme Endpoint'i
app.get('/api/employees', (req, res) => {
    const query = 'SELECT * FROM employees';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return res.status(500).send('Error fetching employees');
        }
        res.status(200).json(results);
    });
});

// Eleman Güncelleme Endpoint'i
app.put('/api/update-employee/:id', (req, res) => {
    const { id } = req.params;
    const { name, phone, role, hourlyRate } = req.body;

    const query = 'UPDATE employees SET name = ?, phone = ?, role = ?, hourly_rate = ? WHERE id = ?';

    db.query(query, [name, phone, role, hourlyRate, id], (err, result) => {
        if (err) {
            console.error('Error updating employee:', err);
            return res.status(500).send('Error updating employee');
        }
        res.status(200).send('Employee updated successfully');
    });
});

// Eleman Silme Endpoint'i
app.delete('/api/delete-employee/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM employees WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting employee:', err);
            return res.status(500).send('Error deleting employee');
        }
        res.status(200).send('Employee deleted successfully');
    });
});

// Puantaj Ekleme Endpoint'i
app.post('/api/add-punch', (req, res) => {
    const { employeeId, date, hoursWorked } = req.body;

    const query = 'INSERT INTO punch_cards (employee_id, date, hours_worked) VALUES (?, ?, ?)';

    db.query(query, [employeeId, date, hoursWorked], (err, result) => {
        if (err) {
            console.error('Error adding punch card:', err);
            return res.status(500).send('Error adding punch card');
        }
        res.status(200).send('Punch card added successfully');
    });
});

// Puantaj Verilerini Getirme Endpoint'i
app.get('/api/punch-cards', (req, res) => {
    const query = 'SELECT p.id, e.name, p.date, p.hours_worked FROM punch_cards p JOIN employees e ON p.employee_id = e.id';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching punch cards:', err);
            return res.status(500).send('Error fetching punch cards');
        }
        res.status(200).json(results);
    });
});

// Shift Ekleme Endpoint'i
app.post('/api/add-shift', (req, res) => {
    const { employeeId, day, startTime, endTime } = req.body;

    const query = 'INSERT INTO shifts (employee_id, day, start_time, end_time) VALUES (?, ?, ?, ?)';

    db.query(query, [employeeId, day, startTime, endTime], (err, result) => {
        if (err) {
            console.error('Error adding shift:', err);
            return res.status(500).send('Error adding shift');
        }
        res.status(200).send('Shift added successfully');
    });
});

// Shift Verilerini Getirme Endpoint'i
app.get('/api/shifts', (req, res) => {
    const query = 'SELECT s.id, e.name, s.day, s.start_time, s.end_time FROM shifts s JOIN employees e ON s.employee_id = e.id';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching shifts:', err);
            return res.status(500).send('Error fetching shifts');
        }
        res.status(200).json(results);
    });
});

// Müdür Ekleme Endpoint'i
app.post('/api/add-manager', (req, res) => {
    const { name, email, password, restaurant } = req.body;

    const query = 'INSERT INTO managers (name, email, password, restaurant) VALUES (?, ?, ?, ?)';

    db.query(query, [name, email, password, restaurant], (err, result) => {
        if (err) {
            console.error('Error adding manager:', err);
            return res.status(500).send('Error adding manager');
        }
        res.status(200).send('Manager added successfully');
    });
});

// Maaş Girişi Endpoint'i
app.post('/api/salary-entry', (req, res) => {
    const { employeeId, month, salary } = req.body;

    const query = 'INSERT INTO salaries (employee_id, month, salary) VALUES (?, ?, ?)';

    db.query(query, [employeeId, month, salary], (err, result) => {
        if (err) {
            console.error('Error entering salary:', err);
            return res.status(500).send('Error entering salary');
        }
        res.status(200).send('Salary entered successfully');
    });
});

        // Maaş Hesaplama Endpoint'i
app.get('/api/salaries', (req, res) => {
    const query = 'SELECT e.name, s.month, s.salary FROM salaries s JOIN employees e ON s.employee_id = e.id';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching salaries:', err);
            return res.status(500).send('Error fetching salaries');
        }
        res.status(200).json(results);
    });
});

        // Ciro Ekleme Endpoint'i
app.post('/api/add-revenue', (req, res) => {
    const { restaurant, date, amount } = req.body;

    const query = 'INSERT INTO revenues (restaurant, date, amount) VALUES (?, ?, ?)';

    db.query(query, [restaurant, date, amount], (err, result) => {
        if (err) {
            console.error('Error adding revenue:', err);
            return res.status(500).send('Error adding revenue');
        }
        res.status(200).send('Revenue added successfully');
    });
});

        // Ciro Verilerini Getirme Endpoint'i
app.get('/api/revenues', (req, res) => {
    const query = 'SELECT * FROM revenues';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching revenues:', err);
            return res.status(500).send('Error fetching revenues');
        }
        res.status(200).json(results);
    });
});
// Harcama Raporlarını Getirme Endpoint'i
app.get('/api/expenses', (req, res) => {
    const query = 'SELECT * FROM expense_reports';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching expense reports:', err);
            return res.status(500).send('Error fetching expense reports');
        }
        res.status(200).json(results);
    });
});

// Stok Sayım Raporlarını Getirme Endpoint'i
app.get('/api/stock-reports', (req, res) => {
    const query = 'SELECT * FROM stock_reports';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching stock reports:', err);
            return res.status(500).send('Error fetching stock reports');
        }
        res.status(200).json(results);
    });
});

// Zayi Raporlarını Getirme Endpoint'i
app.get('/api/loss-reports', (req, res) => {
    const query = 'SELECT * FROM loss_reports';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching loss reports:', err);
            return res.status(500).send('Error fetching loss reports');
        }
        res.status(200).json(results);
    });
});
// Grafik verilerini döndüren endpoint
app.get('/api/chart-data', (req, res) => {
    const chartData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [
            {
                label: 'Visits',
                data: [12, 19, 3, 5, 2, 3, 9],
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
            },
        ],
    };

    res.json(chartData);
});
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
// Diğer middleware ve route tanımlamaları burada

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});