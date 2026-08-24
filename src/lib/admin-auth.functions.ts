import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";

type AdminSession = { username?: string; role?: string };

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "coscon-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const username = String(data.username ?? "").trim();
    const password = String(data.password ?? "");
    if (!username || !password) return { ok: false as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("verify_admin_login", {
      _username: username,
      _password: password,
    });
    if (error) {
      console.error("admin login error", error.message);
      return { ok: false as const };
    }
    const admin = rows?.[0];
    if (!admin) return { ok: false as const };

    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ username: admin.username, role: admin.role });
    return { ok: true as const, username: admin.username, role: admin.role };
  });

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.username) return { authenticated: false as const };
  return {
    authenticated: true as const,
    username: session.data.username,
    role: session.data.role ?? "Super Admin",
  };
});

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});
