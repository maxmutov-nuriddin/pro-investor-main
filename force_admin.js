import sqlite3 from 'sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'database.db');
const db = new sqlite3.Database(dbPath);

const email = 'admin@admin.com';

db.serialize(() => {
   // Check current state
   db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) console.error("Error fetching:", err);
      else console.log("Before update:", row);
   });

   // Force Update
   db.run("UPDATE users SET role = 'admin' WHERE email = ?", [email], function (err) {
      if (err) console.error("Error updating:", err);
      else console.log(`Updated role for ${email}. Changes: ${this.changes}`);
   });

   // Verify
   db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) console.error("Error fetching:", err);
      else console.log("After update:", row);
   });
});
