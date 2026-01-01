# Pro Investor

Investment management platform with analytics dashboard, backend API, and serverless functions.

## Features

- Investment portfolio analytics dashboard
- Admin panel with user management
- RESTful API with Node.js
- Serverless functions via Netlify
- SQLite database integration
- Responsive frontend interface

## Tech Stack

**Frontend:** React, JavaScript, HTML5, CSS3  
**Backend:** Node.js, Express  
**Database:** SQLite  
**Deployment:** Netlify Functions  
**Tools:** ESLint

## Installation

```bash
git clone https://github.com/maxmutov-nuriddin/pro-investor-main.git
cd pro-investor-main
npm install
```

## Development

Start frontend development server:
```bash
npm run dev
```

Start backend API server:
```bash
node server.js
```

## Database Management

```bash
node seed_data.js      # Seed database with sample data
node debug_admin.js    # Debug admin panel
node force_admin.js    # Create admin user
node fix_db.js         # Fix database issues
```

## Build for Production

```bash
npm run build
```

## Project Structure

```
pro-investor-main/
├── src/                    # Frontend source code
├── netlify/functions/      # Serverless functions
├── public/                 # Static assets
├── server.js               # Backend API server
├── database.db             # SQLite database
├── seed_data.js            # Database seeding script
├── debug_admin.js          # Admin debug utility
├── force_admin.js          # Admin creation utility
├── fix_db.js               # Database fix utility
└── netlify.toml            # Netlify configuration
```

## Environment Variables

Create `.env` file in root directory:

```env
DATABASE_URL=./database.db
PORT=3000
NODE_ENV=development
```

## Deployment

The application is configured for deployment on Netlify with serverless functions. Push to main branch triggers automatic deployment.

## License

MIT

## Author

Nuriddin Maxmutov  
