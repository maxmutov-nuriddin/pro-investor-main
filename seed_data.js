import sqlite3 from 'sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
   // 1. Ensure a regular user exists
   const userEmail = 'test@gmail.com';
   db.get("SELECT * FROM users WHERE email = ?", [userEmail], (err, user) => {
      if (!user) {
         console.log("Test user not found, skipping operation seeding for user.");
      } else {
         console.log("Found test user:", user.id);
         const userId = user.id;

         // 2. Create Pending Deposit
         db.run(`INSERT INTO operations (userId, type, amount, date, account, status) 
                    VALUES (?, 'deposit', 1500, ?, '408170000000100', 'pending')`,
            [userId, new Date().toISOString()],
            (err) => {
               if (err) console.error("Error seeding deposit:", err);
               else console.log("Seeded pending deposit: $1500");
            });

         // 3. Create Pending Withdrawal
         db.run(`INSERT INTO operations (userId, type, amount, date, account, status) 
                    VALUES (?, 'withdraw', 500, ?, '408170000000100', 'pending')`,
            [userId, new Date().toISOString()],
            (err) => {
               if (err) console.error("Error seeding withdrawal:", err);
               else console.log("Seeded pending withdrawal: $500");
            });
      }
   });
});
