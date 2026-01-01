import sqlite3 from 'sqlite3';
import { join } from 'path';
import bcrypt from 'bcryptjs';

const dbPath = join(process.cwd(), 'database.db');
const db = new sqlite3.Database(dbPath);

const checkAdmin = async () => {
   const email = 'admin@admin.com';
   const password = 'admin';

   db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
         console.error("Error fetching user:", err);
         return;
      }

      if (!user) {
         console.log("Admin user NOT found. Creating...");
         const hashedPassword = await bcrypt.hash(password, 10);
         db.run("INSERT INTO users (email, password, fullName, role) VALUES (?, ?, ?, ?)", [email, hashedPassword, 'Administrator', 'admin'], (err) => {
            if (err) console.error("Error creating:", err);
            else console.log("Admin created.");
         });
      } else {
         console.log("Admin user found:", user);
         const isMatch = await bcrypt.compare(password, user.password);
         console.log("Password match:", isMatch);

         if (!isMatch) {
            console.log("Resetting password...");
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, user.id], (err) => {
               if (err) console.error("Error updating:", err);
               else console.log("Password reset to 'admin'");
            });
         }
      }
   });
};

checkAdmin();
