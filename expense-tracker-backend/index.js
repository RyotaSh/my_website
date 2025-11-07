const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
//express → server framework
//mysql2 → connect Node.js to MySQL
//cors → allow frontend (React) to call backend
//body-parser → parse JSON requests

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       
  password: '16703123456',       
  database: 'expense_tracker',
  dateStrings: true 
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Register a new user
app.post('/users', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const query = 'INSERT INTO users (username) VALUES (?)';
  db.query(query, [username], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Username already exists' });
      }
      return res.status(500).json({ error: 'Database error', details: err });
    }
    res.status(201).json({ message: 'User created', userId: result.insertId });
  });
});

// Login by username
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  const query = 'SELECT id FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Login successful', userId: results[0].id });
  });
});

// Add a new expense
app.post('/expenses', (req, res) => {
  const { user_id, amount, category, date, description } = req.body;

  if (!user_id || !amount || !category || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO expenses (user_id, amount, category, date, description) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [user_id, amount, category, date, description || null], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Expense added', expenseId: result.insertId });
  });
});


// Get all expenses
app.get('/expenses', (req, res) => {
  const { user_id } = req.query; //filter by user

  let query = 'SELECT * FROM expenses';
  const params = [];

  if (user_id) {
    query += ' WHERE user_id = ?';
    params.push(user_id);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Update an expense
app.put('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { amount, category, date, description } = req.body;

  const query = 'UPDATE expenses SET amount=?, category=?, date=?, description=? WHERE id=?';
  db.query(query, [amount, category, date, description, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Expense updated' });
  });
});

// Delete an expense
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM expenses WHERE id=?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Expense deleted' });
  });
});


