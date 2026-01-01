import sqlite3 from 'sqlite3';
import { join } from 'path';
import bcrypt from 'bcryptjs';

const dbPath = join(process.cwd(), 'database.db');
const db = new sqlite3.Database(dbPath);

console.log("Starting migration...");

db.serialize(() => {
   // 1. Add role to users
   db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`, (err) => {
      if (err) {
         if (err.message.includes('duplicate column name')) {
            console.log("Column 'role' already exists in users.");
         } else {
            console.error("Error adding 'role' column:", err.message);
         }
      } else {
         console.log("Added 'role' column to users.");
      }
   });

   // 2. Add status to operations
   db.run(`ALTER TABLE operations ADD COLUMN status TEXT DEFAULT 'pending'`, (err) => {
      if (err) {
         if (err.message.includes('duplicate column name')) {
            console.log("Column 'status' already exists in operations.");
         } else {
            console.error("Error adding 'status' column:", err.message);
         }
      } else {
         console.log("Added 'status' column to operations.");
      }
   });

   // 3. Seed Admin
   const email = 'admin@admin.com';
   const password = 'admin';

   // Wait a bit for ALTER to propogate (though serialized should handle it)
   setTimeout(() => {
      db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
         if (err) {
            console.error("Error checking admin:", err);
            return;
         }

         if (!user) {
            console.log("Creating admin user...");
            const hashedPassword = await bcrypt.hash(password, 10);
            // Ensure role column exists now
            db.run("INSERT INTO users (email, password, fullName, role) VALUES (?, ?, ?, ?)", [email, hashedPassword, 'Administrator', 'admin'], (err) => {
               if (err) console.error("Error inserting admin:", err);
               else console.log("Admin user created successfully.");
            });
         } else {
            console.log("Admin user already exists. Updating role/password...");
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run("UPDATE users SET role = 'admin', password = ? WHERE id = ?", [hashedPassword, user.id], (err) => {
               if (err) console.error("Error updating admin:", err);
               else console.log("Admin updated.");
            });
         }
      });
   }, 1000);
});
