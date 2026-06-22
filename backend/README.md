# Men Aloho — Backend

Django REST API serving admin data for the Men Aloho website.

## Stack

- **Django 5** + **Django REST Framework**
- **PyJWT** for token auth
- **django-cors-headers** for cross-origin requests
- JSON file storage (no database)

## Getting Started

```bash
# First time
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Every time
source venv/bin/activate
python manage.py runserver 5001
```

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/login` | — | Exchange passcode for JWT |
| `GET` | `/api/verify` | — | Check if token is valid |
| `GET/POST` | `/api/gallery` | POST requires token | Gallery photos |
| `GET/POST` | `/api/videos` | POST requires token | YouTube videos |
| `GET/POST` | `/api/news` | POST requires token | News items |
| `GET/POST` | `/api/music-overrides` | POST requires token | Spotify track overrides |
| `GET/POST` | `/api/group-photo` | POST requires token | Group photo URL |
| `POST` | `/api/upload` | Token required | Upload image file |
| `GET` | `/uploads/<filename>` | — | Serve uploaded file |

## Auth

Send the token from `/api/login` as `Authorization: Bearer <token>` on all write requests.

## Data

All content is stored as JSON files in `data/`. Uploaded images go to `uploads/`. Both directories are git-ignored.

## Project Layout

```
backend/
├── config/         Django project settings & URLs
├── api/            Views and URL routing
├── data/           JSON data files (git-ignored)
├── uploads/        Uploaded images (git-ignored)
├── venv/           Python virtualenv (git-ignored)
└── manage.py
```
