import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { verifyAdminLogin } from "@/integrations/cloudflare/d1";

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

    let admin: { username: string; role: string } | null = null;
    try {
      admin = await verifyAdminLogin(username, password);
    } catch (error) {
      // D1 binding missing / DB error — never leak internals to the client.
      console.error("admin login db error", error);
      return { ok: false as const };
    }
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
