# Men Aloho — Website

Official website for **Men Aloho**, a male vocal ensemble based in Chennai, India.

## Structure

```
ma-website/
├── frontend/   React SPA (Create React App)
└── backend/    Django REST API
```

## Quick Start

**Backend** (port 5001):
```bash
cd backend
source venv/bin/activate
python manage.py runserver 5001
```

**Frontend** (port 3000):
```bash
cd frontend
npm start
```

The frontend proxies API calls to `http://localhost:5001`.

## Admin

Navigate to `/login` and enter the passcode to access the admin settings panel.
