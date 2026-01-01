# Pro Investor

**Pro Investor** — веб-приложение для управления инвестициями и аналитики с современным UI, серверными функциями и локальной базой данных.

---

## 🛠 Tech Stack

- **Frontend:** Vite, JavaScript, HTML5, CSS3  
- **Backend:** Node.js  
- **Serverless:** Netlify Functions  
- **Database:** SQLite  
- **Tools:** ESLint, Vite Config  
- **Deployment:** Netlify  

---

## 🚀 Features

- Панель аналитики по инвестициям  
- Интерактивный фронтенд с современным UI  
- Админские скрипты для управления базой данных:
  - `debug_admin.js` — отладка админки  
  - `force_admin.js` — создание админа  
  - `fix_db.js` — исправление базы данных  
- Серверный код для API (`server.js`)  
- Serverless функции через Netlify Functions  
- Локальная база SQLite для хранения данных  
- Адаптивный дизайн и кроссбраузерность  

---

## 📁 Project Structure

pro-investor-main/
├─ src/ # Фронтенд компоненты и JS
├─ public/ # index.html, изображения и статические файлы
├─ netlify/functions/ # Serverless функции
├─ server.js # Backend API / сервер
├─ database.db # Локальная база SQLite
├─ seed_data.js # Скрипт для наполнения БД
├─ debug_admin.js # Скрипт админки
├─ force_admin.js # Скрипт админки
├─ fix_db.js # Скрипт исправления БД
├─ package.json # Зависимости и скрипты
├─ vite.config.js # Конфигурация Vite
├─ eslint.config.js # Настройка ESLint
├─ netlify.toml # Настройка деплоя
└─ .env / .env.production # Переменные окружения

---

## ▶️ Run Locally

1. Клонируем репозиторий:

```bash
git clone https://github.com/maxmutov-nuriddin/pro-investor-main.git
cd pro-investor-main
npm install
npm run dev
node server.js
node debug_admin.js
node force_admin.js
node fix_db.js


