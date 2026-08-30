-- 0001_init.sql — Admin users (replaces the Supabase `public.admin_users` table)
-- Applied with: npm run db:migrate:local | db:migrate:remote

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Super Admin',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Seed the same default super-admin that existed in Supabase.
-- Password: BABATILLU-TO-BABADAAKU (bcrypt, cost 10, `$2a$` — bcryptjs compatible)
INSERT OR IGNORE INTO admin_users (id, username, password_hash, role)
VALUES (
  'seed-baba-daaku',
  'BABA-DAAKU',
  '$2a$10$hPkmL2yB7rPeh24oXh7RVucr5Pu30ftPMKdWM7oYtJuQWt4g0LdLq',
  'Super Admin'
);