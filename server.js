const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Harcama Raporu Yükleme Endpoint'i
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

app.post('/api/upload-expense', upload.single('file'), (req, res) => {
  const managerId = req.body.managerId;
  const fileName = req.file.filename;
  const query = 'INSERT INTO expense_reports (manager_id, file_name, upload_date) VALUES (?, ?, NOW())';

  connection.query(query, [managerId, fileName], (err, result) => {
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

  connection.query(query, [password], (err, results) => {
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
// Eleman Ekleme Endpoint'i
app.post('/api/add-employee', (req, res) => {
  const { name, phone, role, hourlyRate } = req.body;
  const query = 'INSERT INTO employees (name, phone, role, hourly_rate) VALUES (?, ?, ?, ?)';

  connection.query(query, [name, phone, role, hourlyRate], (err, result) => {
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

  connection.query(query, (err, results) => {
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

  connection.query(query, [name, phone, role, hourlyRate, id], (err, result) => {
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

  connection.query(query, [id], (err, result) => {
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

  connection.query(query, [employeeId, date, hoursWorked], (err, result) => {
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

  connection.query(query, (err, results) => {
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

  connection.query(query, [employeeId, day, startTime, endTime], (err, result) => {
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

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching shifts:', err);
      return res.status(500).send('Error fetching shifts');
    }
    res.status(200).json(results);
  });
});
// Ciro Verilerini Getirme Endpoint’i
app.get('/api/revenues', (req, res) => {
  const query = 'SELECT * FROM revenues';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching revenues:', err);
      return res.status(500).send('Error fetching revenues');
    }
    res.status(200).json(results);
  });
});

// Harcama Raporlarını Getirme Endpoint’i
app.get('/api/expenses', (req, res) => {
  const query = 'SELECT * FROM expense_reports';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching expense reports:', err);
      return res.status(500).send('Error fetching expense reports');
    }
    res.status(200).json(results);
  });
});

// Stok Sayım Raporlarını Getirme Endpoint’i
app.get('/api/stock-reports', (req, res) => {
  const query = 'SELECT * FROM stock_reports';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching stock reports:', err);
      return res.status(500).send('Error fetching stock reports');
    }
    res.status(200).json(results);
  });
});

// Zayi Raporlarını Getirme Endpoint’i
app.get('/api/loss-reports', (req, res) => {
  const query = 'SELECT * FROM loss_reports';

  connection.query(query, (err, results) => {
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
// DB Test Endpoint'i
app.get('/api/db-test', (req, res) => {
  connection.query('SELECT 1', (err, results) => {
      if (err) {
          console.error('Error executing query:', err);
          return res.status(500).send('Database connection test failed');
      }
      res.status(200).send('Database connection test succeeded');
  });
});
// Server'ı başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});