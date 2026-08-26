import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { payNetworks } from "@/lib/mockData";

export const Route = createFileRoute("/pay")({
  head: () => ({
    meta: [
      { title: "Pay Invoice INV-4821 — CosCon Pay" },
      {
        name: "description",
        content:
          "Secure crypto checkout page: pay 250.00 USDT on BSC, Ethereum, TON or Tron with live expiry countdown.",
      },
      { property: "og:title", content: "Pay with crypto — CosCon Pay" },
      {
        property: "og:description",
        content: "Multi-chain crypto checkout with live countdown and on-chain confirmation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentPage,
});

const TOTAL = 30 * 60;

function PaymentPage() {
  const [network, setNetwork] = useState(payNetworks[0]!.name);
  const [left, setLeft] = useState(TOTAL - 1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const address = payNetworks.find((n) => n.name === network)!.address;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px circle at 10% 0%, color-mix(in oklch, var(--primary) 20%, transparent), transparent 60%), radial-gradient(600px circle at 95% 100%, color-mix(in oklch, var(--success) 16%, transparent), transparent 60%)",
        }}
      />
      <div className="relative w-full max-w-[440px]">
        <div className="panel card-accent relative overflow-hidden p-6">
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div>
              <p className="text-subtle">Invoice</p>
              <p className="mono mt-0.5">INV-4821</p>
            </div>
            <div>
              <p className="text-subtle">Description</p>
              <p className="mt-0.5">Pro plan</p>
            </div>
            <div>
              <p className="text-subtle">Merchant</p>
              <p className="mt-0.5">CosCon</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="mono text-3xl font-semibold">250.00 USDT</p>
            <p className="mt-1 text-xs text-muted-foreground">≈ $250.00 USD</p>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {payNetworks.map((n) => (
              <button
                key={n.name}
                onClick={() => setNetwork(n.name)}
                className={`rounded-full px-3 py-1.5 text-[11px] transition-all duration-200 ${
                  network === n.name
                    ? "bg-primary/15 text-primary"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.name}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-1.5 flex justify-between text-[11px]">
              <span className="text-muted-foreground">Expires in</span>
              <span className="mono text-warning">
                {mm}:{ss}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-warning to-destructive transition-all duration-1000"
                style={{ width: `${(left / TOTAL) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-surface/40 p-4">
            <div className="mx-auto grid w-fit grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className={`size-8 rounded-sm ${i % 3 === 1 ? "bg-foreground/80" : "bg-foreground/25"}`}
                />
              ))}
            </div>
            <p className="mono mt-4 text-center text-[11px] break-all text-muted-foreground">
              {address}
            </p>
            <button
              onClick={copy}
              className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:brightness-110"
            >
              {copied ? "✓ Copied!" : "Copy Address"}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-warning">
            <span className="pulse-dot size-2.5 rounded-full bg-warning" />
            Waiting for payment…
          </div>

          <p className="mt-5 text-center text-[10px] text-subtle">Powered by CosCon Pay</p>
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          🔒 Payment confirmed after 12 block confirmations
        </p>
      </div>
    </main>
  );
}
