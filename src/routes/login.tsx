import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminLogin } from "@/lib/admin-auth.functions";
import { inputClass } from "@/components/admin/primitives";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Sign In — CosCon Pay" },
      {
        name: "description",
        content: "Secure sign-in for the CosCon Pay crypto payment gateway admin panel.",
      },
      { property: "og:title", content: "Admin Sign In — CosCon Pay" },
      { property: "og:description", content: "Secure admin access to the CosCon Pay gateway." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const login = useServerFn(adminLogin);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const res = await login({ data: { username, password } });
    setBusy(false);
    if (res.ok) await navigate({ to: "/admin" });
    else setError(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="panel card-accent w-full max-w-sm p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary/15 text-lg">💎</span>
          <div>
            <p className="text-sm font-semibold">CosCon Pay</p>
            <p className="text-[11px] text-muted-foreground">Admin sign in</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs text-muted-foreground">Username</span>
            <input
              className={`${inputClass} mono`}
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-muted-foreground">Password</span>
            <input
              className={`${inputClass} mono`}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <p className="text-xs text-destructive">Invalid username or password.</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "Verifying…" : "Sign in"}
          </button>
        </div>
      </form>
    </main>
  );
}
