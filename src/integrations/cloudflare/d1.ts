// Cloudflare D1 (SQLite) integration for CosComPay.
//
// Server-only. On the deployed Worker, Nitro's `cloudflare-module` preset
// exposes the environment bindings via `req.runtime.cloudflare.env` (with
// `globalThis.__env__` set as a fallback). The D1 binding is named `DB` and is
// declared in `wrangler.toml`.

import { getRequest } from "@tanstack/react-start/server";
import bcrypt from "bcryptjs";

/** Minimal D1 types (Cloudflare `workers-types` is intentionally not installed). */
export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta?: Record<string, unknown>;
  error?: string;
}

export interface D1ExecResult extends D1Result {
  count?: number;
  duration?: number;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

/** Env shape produced by the generated wrangler.json (extend as needed). */
export interface CloudflareEnv {
  DB?: D1Database;
  ASSETS?: { fetch(request: Request | string): Promise<Response> };
}

/** Nitro augments the FetchRequest with `runtime.cloudflare` on the Worker. */
interface CloudflareAugmentedRequest extends Request {
  runtime?: {
    name?: string;
    cloudflare?: { env?: Record<string, unknown>; context?: unknown };
  };
}

function resolveCloudflareEnv(): Record<string, unknown> | undefined {
  const req = getRequest() as CloudflareAugmentedRequest;
  if (req.runtime?.cloudflare?.env) return req.runtime.cloudflare.env;
  return (globalThis as { __env__?: Record<string, unknown> }).__env__;
}

/** Get the D1 binding. Throws a descriptive error when unavailable. */
export function getDb(): D1Database {
  const env = resolveCloudflareEnv();
  const db = env?.["DB"] as D1Database | undefined;
  if (!db) {
    throw new Error(
      "D1 binding `DB` is not available. Configure wrangler.toml (d1_databases), " +
        "run through `wrangler dev`, and apply migrations with `npm run db:migrate:local` (or `--remote`).",
    );
  }
  return db;
}

export interface AdminCredentials {
  username: string;
  role: string;
}

interface AdminUserRow {
  id: string;
  username: string;
  password_hash: string;
  role: string;
}

/**
 * Verify an admin's credentials against the D1 `admin_users` table.
 * Returns the admin's public info on success, or `null` on failure.
 */
export async function verifyAdminLogin(
  username: string,
  password: string,
): Promise<AdminCredentials | null> {
  const db = getDb();
  const row = await db
    .prepare("SELECT id, username, password_hash, role FROM admin_users WHERE username = ?")
    .bind(username)
    .first<AdminUserRow>();

  if (!row) return null;
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return null;

  return { username: row.username, role: row.role };
}