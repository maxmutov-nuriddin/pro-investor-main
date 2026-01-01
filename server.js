import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;
const SECRET_KEY = "pro-investor-secret-key-change-me"; // В реальном проекте хранить в .env

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup
const dbPath = join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключено к базе данных SQLite.');
  }
});

// Helper to run migrations
const runMigrations = () => {
  db.serialize(() => {
    // 1. Users Table - Add role if not exists
    db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            fullName TEXT NOT NULL,
            phone TEXT,
            passport TEXT,
            issuedBy TEXT,
            issuedDate TEXT,
            code TEXT,
            gender TEXT,
            birthDate TEXT,
            role TEXT DEFAULT 'user'
        )`);

    try {
      db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`, (err) => {
        // Ignore error if column exists
      });
    } catch (e) { }

    // 2. Accounts Table
    db.run(`CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            accountNumber TEXT NOT NULL,
            balance REAL DEFAULT 0,
            income REAL DEFAULT 0,
            profitPercent REAL DEFAULT 0,
            FOREIGN KEY(userId) REFERENCES users(id)
        )`);

    // 3. Operations Table - Add status if not exists
    db.run(`CREATE TABLE IF NOT EXISTS operations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            account TEXT,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY(userId) REFERENCES users(id)
        )`);

    try {
      db.run(`ALTER TABLE operations ADD COLUMN status TEXT DEFAULT 'pending'`, (err) => {
        // Ignore if exists
      });
    } catch (e) { }

    // Seed Admin
    seedAdmin();
  });
};

const seedAdmin = () => {
  const adminEmail = 'admin@admin.com';
  const adminPass = 'admin';

  db.get(`SELECT * FROM users WHERE email = ?`, [adminEmail], async (err, user) => {
    if (!user) {
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      const sql = `INSERT INTO users (email, password, fullName, role) VALUES (?, ?, ?, ?)`;
      db.run(sql, [adminEmail, hashedPassword, 'Administrator', 'admin'], (err) => {
        if (err) console.error("Error creating admin:", err);
        else console.log("Admin user created: admin@admin.com");
      });
    } else {
      // Ensure role is admin
      if (user.role !== 'admin') {
        db.run(`UPDATE users SET role = 'admin' WHERE id = ?`, [user.id]);
      }
    }
  });
}

// Run migrations on start
runMigrations();


// Helper Functions
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role || 'user' }, SECRET_KEY, { expiresIn: '7d' });
};

// --- ROUTES ---

// 1. Register
app.post('/api/auth/register', async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists
    const checkSql = `SELECT * FROM users WHERE email = ?`;
    db.get(checkSql, [email], (err, row) => {
      if (row) {
        return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
      }

      const sql = `INSERT INTO users (email, password, fullName, role) VALUES (?, ?, ?, 'user')`;
      db.run(sql, [email, hashedPassword, fullName], function (err) {
        if (err) {
          return res.status(500).json({ message: 'Ошибка сервера' });
        }

        const user = { id: this.lastID, email, fullName, role: 'user' };

        // Default Account
        const accNum = '40817' + Math.floor(Math.random() * 1000000000000000);
        const accSql = `INSERT INTO accounts (userId, accountNumber, balance, income, profitPercent) VALUES (?, ?, ?, ?, ?)`;
        db.run(accSql, [user.id, accNum, 0, 0, 0], (err) => {
          if (err) console.error("Error creating default account", err);
        });

        res.status(201).json({ message: "Register success", user });
      });
    });

  } catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// 2. Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Введите e-mail и пароль!' });

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    if (!user) return res.status(400).json({ message: 'Email или пароль неверны' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email или пароль неверны' });

    const token = generateToken(user);
    // Send role in response
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role || 'user' } });
  });
});

// 3. Verify User (Mock 2FA)
app.post('/api/auth/verify-user', (req, res) => {
  const { email, code } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], (err, user) => {
    if (err || !user) return res.status(400).json({ message: 'User not found' });
    const token = generateToken(user);
    res.json({ success: true, token, user: { id: user.id, email: user.email, role: user.role } });
  });
});

// Middleware to verify token
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ message: "Token verification failed" });
    }
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.warn(`Access denied. User: ${req.user?.email}, Role: ${req.user?.role}`);
    res.status(403).json({ message: `Access denied. Admins only. Your role: ${req.user?.role}` });
  }
};

// 4. Get Accounts
app.get('/api/accounts', authenticate, (req, res) => {
  const userId = req.user.id;
  const sql = `SELECT * FROM accounts WHERE userId = ?`;
  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Ошибка сервера' });
    res.json(rows);
  });
});

// 5. Get/Update Current User
app.get('/api/users/me', authenticate, (req, res) => {
  const userId = req.user.id;
  const sql = `SELECT * FROM users WHERE id = ?`;
  db.get(sql, [userId], (err, user) => {
    if (err) return res.status(500).json({ message: 'Error' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...userData } = user;
    res.json(userData);
  });
});

app.patch('/api/users/me', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { fullName, phone, passport, issuedBy, issuedDate, code, gender, birthDate, currentPassword, newPassword } = req.body;

  if (newPassword) {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [userId], async (err, user) => {
      if (err || !user) return res.status(500).json({ message: 'Error' });
      if (!currentPassword) return res.status(400).json({ message: 'Need current password' });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.run(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, userId], (err) => {
        if (err) return res.status(500).json({ message: 'Error updating password' });
        res.json({ message: 'Password updated' });
      });
    });
    return;
  }

  const fieldsToUpdate = {};
  if (fullName) fieldsToUpdate.fullName = fullName;
  if (phone) fieldsToUpdate.phone = phone;
  if (passport) fieldsToUpdate.passport = passport;
  if (issuedBy) fieldsToUpdate.issuedBy = issuedBy;
  if (issuedDate) fieldsToUpdate.issuedDate = issuedDate;
  if (code) fieldsToUpdate.code = code;
  if (gender) fieldsToUpdate.gender = gender;
  if (birthDate) fieldsToUpdate.birthDate = birthDate;

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.json({ message: 'No changes detected' });
  }

  const setClause = Object.keys(fieldsToUpdate).map(key => `${key} = ?`).join(', ');
  const values = Object.values(fieldsToUpdate);
  values.push(userId);

  const sql = `UPDATE users SET ${setClause} WHERE id = ?`;
  db.run(sql, values, (err) => {
    if (err) return res.status(500).json({ message: 'Error updating profile' });
    res.json({ message: 'Profile updated' });
  });
});

// 6. Withdraw / Replenish (Operations)
app.get('/api/operations', authenticate, (req, res) => {
  const userId = req.user.id;
  const sql = `SELECT * FROM operations WHERE userId = ? ORDER BY id DESC`;
  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error' });
    res.json(rows);
  });
});

// NEW: Request Deposit (Status = pending)
const handleDeposit = (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;
  const date = new Date().toISOString();

  let sql = `SELECT * FROM accounts WHERE userId = ? LIMIT 1`;
  let params = [userId];

  if (req.body.accountId) {
    sql = `SELECT * FROM accounts WHERE accountNumber = ? AND userId = ?`;
    params = [req.body.accountId, userId];
  }

  db.get(sql, params, (err, acc) => {
    if (err) return res.status(500).json({ message: 'Error fetching account' });
    if (acc) {
      const depositAmount = parseFloat(amount || 0);

      const sqlOp = `INSERT INTO operations (userId, type, amount, date, account, status) VALUES (?, ?, ?, ?, ?, 'pending')`;
      db.run(sqlOp, [userId, 'deposit', depositAmount, date, acc.accountNumber], (insertErr) => {
        if (insertErr) return res.status(500).json({ message: 'Error recording operation' });
        res.json({ success: true, message: 'Заявка на пополнение создана и ожидает одобрения администратора' });
      });

    } else {
      res.status(404).json({ message: 'Account not found' });
    }
  });
};

app.post('/api/deposit', authenticate, handleDeposit);
app.post('/api/operations/replenish', authenticate, handleDeposit);

// NEW: Request Withdrawal (Status = pending)
app.post('/api/operations/withdrawal', authenticate, (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;
  const date = new Date().toISOString();

  db.get(`SELECT * FROM accounts WHERE userId = ? LIMIT 1`, [userId], (err, acc) => {
    if (acc) {
      const withdrawAmount = parseFloat(amount || 0);

      if (acc.balance < withdrawAmount) {
        return res.status(400).json({ message: "Недостаточно средств" });
      }

      const sql = `INSERT INTO operations (userId, type, amount, date, account, status) VALUES (?, ?, ?, ?, ?, 'pending')`;
      db.run(sql, [userId, 'withdraw', withdrawAmount, date, acc.accountNumber], (err) => {
        if (err) return res.status(500).json({ message: "Error" });
        res.json({ success: true, message: 'Заявка на вывод создана и ожидает одобрения' });
      });
    } else {
      res.status(404).json({ message: "Account not found" });
    }
  });
});

// NEW: Transfer Money (Internal)
console.log("Registering /api/transfer route...");
app.post('/api/transfer', authenticate, (req, res) => {
  const { fromAccountId, toEmail, amount } = req.body;
  const userId = req.user.id;
  const transferAmount = parseFloat(amount || 0);

  if (!toEmail || !amount || transferAmount <= 0) {
    return res.status(400).json({ message: "Invalid data" });
  }

  if (toEmail === req.user.email) {
    return res.status(400).json({ message: "Нельзя переводить самому себе" });
  }

  // 1. Get Sender Account
  db.get(`SELECT * FROM accounts WHERE id = ? AND userId = ?`, [fromAccountId, userId], (err, fromAcc) => {
    if (err || !fromAcc) return res.status(404).json({ message: "Ваш счет не найден" });
    if (fromAcc.balance < transferAmount) return res.status(400).json({ message: "Недостаточно средств" });

    // 2. Get Recipient User (Just validation)
    db.get(`SELECT * FROM users WHERE email = ?`, [toEmail], (err, toUser) => {
      if (err || !toUser) return res.status(404).json({ message: "Получатель не найден" });

      // 3. Create Pending Operation
      const date = new Date().toISOString();
      const sqlOp = `INSERT INTO operations (userId, type, amount, date, account, status) VALUES (?, 'transfer_out', ?, ?, ?, 'pending')`;

      db.run(sqlOp, [userId, transferAmount, date, toUser.email], (err) => {
        if (err) return res.status(500).json({ message: "Ошибка создания заявки" });
        res.json({ success: true, message: "Заявка на перевод создана и ожидает одобрения" });
      });
    });
  });
});


// --- ADMIN ROUTES ---

// Get All Users
app.get('/api/admin/users', authenticate, isAdmin, (req, res) => {
  db.all(`SELECT id, email, fullName, role, phone FROM users`, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json(rows);
  });
});

// Delete User
app.delete('/api/admin/users/:id', authenticate, isAdmin, (req, res) => {
  const userId = req.params.id;

  // Prevent deleting self
  if (parseInt(userId) === req.user.id) {
    return res.status(400).json({ message: "Нельзя удалить самого себя" });
  }

  // 1. Delete Operations
  db.run(`DELETE FROM operations WHERE userId = ?`, [userId], (err) => {
    if (err) return res.status(500).json({ message: "Error deleting operations" });

    // 2. Delete Accounts
    db.run(`DELETE FROM accounts WHERE userId = ?`, [userId], (err) => {
      if (err) return res.status(500).json({ message: "Error deleting accounts" });

      // 3. Delete User
      db.run(`DELETE FROM users WHERE id = ?`, [userId], (err) => {
        if (err) return res.status(500).json({ message: "Error deleting user" });
        res.json({ success: true, message: "Пользователь удален" });
      });
    });
  });
});

// Get Operations (Pending usually)
app.get('/api/admin/operations', authenticate, isAdmin, (req, res) => {
  const { status } = req.query;
  let sql = `SELECT o.*, u.email, u.fullName FROM operations o JOIN users u ON o.userId = u.id`;
  let params = [];

  if (status) {
    sql += ` WHERE o.status = ?`;
    params.push(status);
  }
  sql += ` ORDER BY o.id DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json(rows);
  });
});

// Approve Operation
app.post('/api/admin/operations/:id/approve', authenticate, isAdmin, (req, res) => {
  const opId = req.params.id;

  db.get(`SELECT * FROM operations WHERE id = ?`, [opId], (err, op) => {
    if (err || !op) return res.status(404).json({ message: "Operation not found" });
    if (op.status !== 'pending') return res.status(400).json({ message: "Operation already processed" });

    const amount = op.amount;
    const userId = op.userId;
    const type = op.type;

    if (type === 'transfer_out') {
      // Handle Transfer Approval
      // 1. Check Sender Balance Again
      db.get(`SELECT * FROM accounts WHERE userId = ? LIMIT 1`, [userId], (err, senderAcc) => {
        if (!senderAcc) return res.status(404).json({ message: "Sender account not found" });
        if (senderAcc.balance < amount) return res.status(400).json({ message: "Sender has insufficient funds" });

        // 2. Find Recipient (Email stored in op.account for transfer_out)
        const recipientEmail = op.account;
        db.get(`SELECT * FROM users WHERE email = ?`, [recipientEmail], (err, recipientUser) => {
          if (!recipientUser) return res.status(404).json({ message: "Recipient user not found" });

          // 3. Find Recipient Account
          db.get(`SELECT * FROM accounts WHERE userId = ? LIMIT 1`, [recipientUser.id], (err, recipientAcc) => {
            if (!recipientAcc) return res.status(404).json({ message: "Recipient account not found" });

            // 4. Execute Transfer
            const date = new Date().toISOString();

            // Deduct from Sender
            db.run(`UPDATE accounts SET balance = balance - ? WHERE id = ?`, [amount, senderAcc.id], (err) => {
              if (err) return res.status(500).json({ message: "Error deducting funds" });

              // Add to Recipient
              db.run(`UPDATE accounts SET balance = balance + ?, income = income + ? WHERE id = ?`, [amount, amount, recipientAcc.id], (err) => {
                if (err) console.error("CRITICAL: Money lost during transfer approval", senderAcc.id, recipientAcc.id, amount);

                // Update Original Operation Status
                db.run(`UPDATE operations SET status = 'approved' WHERE id = ?`, [opId], (err) => {

                  // Create Incoming Operation for Recipient
                  // Need Sender Email
                  db.get(`SELECT email FROM users WHERE id = ?`, [userId], (err, senderUser) => {
                    const senderEmail = senderUser ? senderUser.email : 'Unknown';
                    db.run(`INSERT INTO operations (userId, type, amount, date, account, status) VALUES (?, 'transfer_in', ?, ?, ?, 'approved')`,
                      [recipientUser.id, amount, date, senderEmail]);

                    res.json({ success: true, message: "Transfer approved and executed" });
                  });
                });
              });
            });
          });
        });
      });
      return;
    }

    // Handle Deposit / Withdraw
    // Uses op.account which stores the Account Number for these types
    db.get(`SELECT * FROM accounts WHERE accountNumber = ? AND userId = ?`, [op.account, userId], (err, acc) => {
      if (!acc) {
        // Fallback for legacy records or error (try first account)
        console.warn(`Specific account ${op.account} not found, falling back to first account.`);
        db.get(`SELECT * FROM accounts WHERE userId = ? LIMIT 1`, [userId], (err, firstAcc) => {
          if (!firstAcc) return res.status(404).json({ message: "User account not found" });
          processBalanceUpdate(firstAcc);
        });
        return;
      }
      processBalanceUpdate(acc);
    });

    function processBalanceUpdate(acc) {
      let newBalance = acc.balance;
      let newIncome = acc.income;

      if (type === 'deposit') {
        newBalance += amount;
      } else if (type === 'withdraw') {
        if (acc.balance < amount) {
          return res.status(400).json({ message: "User has insufficient funds now" });
        }
        newBalance -= amount;
      }

      // Update Account
      db.run(`UPDATE accounts SET balance = ?, income = ? WHERE id = ?`, [newBalance, newIncome, acc.id], (err) => {
        if (err) return res.status(500).json({ message: "Error updating balance" });

        // Update Operation Status
        db.run(`UPDATE operations SET status = 'approved' WHERE id = ?`, [opId], (err) => {
          if (err) return res.status(500).json({ message: "Error updating status" });
          res.json({ success: true, message: "Operation approved" });
        });
      });
    }
  });
});

// Reject Operation
app.post('/api/admin/operations/:id/reject', authenticate, isAdmin, (req, res) => {
  const opId = req.params.id;
  db.run(`UPDATE operations SET status = 'rejected' WHERE id = ?`, [opId], (err) => {
    if (err) return res.status(500).json({ message: "Error" });
    res.json({ success: true, message: "Operation rejected" });
  });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
