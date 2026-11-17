# Velvet Whispers — Project layout

```
WhispVelvet/
├── robots.txt              # SEO crawlers (root)
├── sitemap.xml
├── index.html              # Redirect → frontend
├── *.jpeg / *.png / …      # Posters & assets (root — do not move)
├── frontend/
│   ├── *.html
│   ├── css/
│   └── js/
├── backend/
│   ├── config/             # DB + bootstrap
│   ├── auth/               # register.php, login.php
│   └── api/                # movies, series, movie, search, related
└── docs/
    ├── env.example
    ├── ROADMAP.md
    └── .htaccess
```

## Run locally (XAMPP)

1. Copy `docs/env.example` → `docs/.env` and set PostgreSQL credentials.
2. Place project under `htdocs/WhispVelvet`.
3. Enable `mod_rewrite` and `pdo_pgsql` in PHP.
4. Import / use your existing `movies_series` table in database `vampires`.
5. Open `http://localhost/WhispVelvet/` — home loads `frontend/movieinfo.html`.
6. API: `http://localhost/WhispVelvet/backend/api/movies.php`

## Auth

- `POST /backend/auth/register.php` — JSON `{ email, password, full_name }`
- `POST /backend/auth/login.php` — JSON `{ email, password }`
- Creates `users` table automatically on first registration.

## Next steps

- [ ] Add `media_type` column (`movie` | `series`) on `movies_series` for cleaner filtering
- [ ] Session cookies / JWT instead of localStorage-only auth
- [ ] Netlify: static frontend only; host PHP API on XAMPP or a PHP host
