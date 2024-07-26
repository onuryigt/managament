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

// Gün Sonu Yapma Endpoint'i
app.post('/api/end-of-day', (req, res) => {
  const { managerId, report } = req.body;

  const query = 'INSERT INTO end_of_day_reports (manager_id, report, date) VALUES (?, ?, NOW())';

  connection.query(query, [managerId, report], (err, result) => {
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

  connection.query(query, [managerId, fileName], (err, result) => {
      if (err) {
          console.error('Error saving stock report:', err);
          return res.status(500).send('Error saving report');
      }
      res.status(200).send('Report uploaded successfully');
  });
});
// Maaş Girişi Endpoint'i
app.post('/api/salary-entry', (req, res) => {
  const { employeeId, month, salary } = req.body;

  const query = 'INSERT INTO salaries (employee_id, month, salary) VALUES (?, ?, ?)';

  connection.query(query, [employeeId, month, salary], (err, result) => {
      if (err) {
          console.error('Error entering salary:', err);
          return res.status(500).send('Error entering salary');
      }
      res.status(200).send('Salary entered successfully');
  });
});

// Maaş Hesaplama Endpoint’i
app.get('/api/salaries', (req, res) => {
  const query = 'SELECT e.name, s.month, s.salary FROM salaries s JOIN employees e ON s.employee_id = e.id';

  connection.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching salaries:', err);
          return res.status(500).send('Error fetching salaries');
      }
      res.status(200).json(results);
  });
});

// Ciro Ekleme Endpoint’i
app.post('/api/add-revenue', (req, res) => {
  const { restaurant, date, amount } = req.body;

  const query = 'INSERT INTO revenues (restaurant, date, amount) VALUES (?, ?, ?)';

  connection.query(query, [restaurant, date, amount], (err, result) => {
      if (err) {
          console.error('Error adding revenue:', err);
          return res.status(500).send('Error adding revenue');
      }
      res.status(200).send('Revenue added successfully');
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

// Statik dosyalar için
app.use(express.static(path.join(__dirname, 'build')));

// Veritabanı Test Endpoint'i
app.get('/api/db-test', (req, res) => {
  connection.query('SELECT 1', (err, results) => {
      if (err) {
          console.error('Error testing the database:', err);
          return res.status(500).send('Error testing the database');
      }
      res.status(200).send('Database connection is working');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});