import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CosCon Pay — Self-Hosted Crypto Payment Gateway" },
      {
        name: "description",
        content:
          "CosCon Pay is a multi-chain, self-hosted crypto payment gateway with an admin panel for invoices, payments and on-chain monitoring.",
      },
      { property: "og:title", content: "CosCon Pay — Crypto Payment Gateway" },
      {
        property: "og:description",
        content: "Multi-chain, self-hosted crypto payments with a real-time admin panel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px circle at 15% 10%, color-mix(in oklch, var(--primary) 22%, transparent), transparent 60%), radial-gradient(700px circle at 85% 90%, color-mix(in oklch, var(--success) 18%, transparent), transparent 60%)",
        }}
      />
      <div className="relative text-center">
        <div
          className="mx-auto grid size-24 place-items-center rounded-3xl bg-primary/12 text-5xl"
          style={{ boxShadow: "0 0 60px -10px var(--primary)" }}
        >
          💎
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">CosCon Pay</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Personal crypto payment gateway — multi-chain, self-hosted
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:brightness-110"
          >
            🔐 Admin Panel
          </Link>
          <Link
            to="/pay"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/60 px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-surface"
          >
            💳 Demo Payment
          </Link>
        </div>
      </div>
    </main>
  );
}
