import { useState } from "react";
import { Copy, Check, Terminal, Code2 } from "lucide-react";

export default function DeveloperApiSandbox() {
  const [activeTab, setActiveTab] = useState<"curl" | "typescript" | "python" | "react">("typescript");
  const [copied, setCopied] = useState(false);

  const snippets = {
    typescript: `import { CosmosPay } from "@cosmos-pay/sdk";

const cosmos = new CosmosPay({
  apiKey: process.env.COSMOS_PAY_SECRET_KEY,
  environment: "mainnet",
});

// 1. Create a dynamic crypto checkout session
const invoice = await cosmos.invoices.create({
  amount: 250.00,
  currency: "USD",
  acceptedTokens: ["USDT", "BTC", "ETH", "SOL", "TON"],
  redirectUrl: "https://yourstore.com/order/1092/success",
  webhookUrl: "https://api.yourstore.com/webhooks/cosmos",
  metadata: { orderId: "ORD-1092", customerId: "usr_9981" },
});

console.log("Pay URL:", invoice.checkoutUrl);`,

    curl: `curl -X POST https://api.cosmospay.io/v1/invoices \\
  -H "Authorization: Bearer sk_live_9a8f2e7b1c4d" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 250.00,
    "currency": "USD",
    "acceptedTokens": ["USDT", "BTC", "ETH", "SOL"],
    "webhookUrl": "https://api.yourstore.com/webhooks/cosmos",
    "metadata": { "orderId": "ORD-1092" }
  }'`,

    python: `from cosmospay import CosmosPay

client = CosmosPay(api_key="sk_live_9a8f2e7b1c4d")

# Generate crypto payment invoice
invoice = client.invoices.create(
    amount=250.00,
    currency="USD",
    accepted_tokens=["USDT", "BTC", "ETH", "SOL", "TON"],
    webhook_url="https://api.yourstore.com/webhooks/cosmos",
    metadata={"order_id": "ORD-1092"}
)

print(f"Checkout URL: {invoice.checkout_url}")`,

    react: `import { useCosmosCheckout } from "@cosmos-pay/react";

export function PayButton({ orderTotal }: { orderTotal: number }) {
  const { createCheckout, isPending } = useCosmosCheckout();

  return (
    <button
      onClick={() => createCheckout({ amount: orderTotal, currency: "USD" })}
      disabled={isPending}
      className="btn-primary"
    >
      {isPending ? "Connecting Wallet..." : "Pay with Crypto"}
    </button>
  );
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/25 bg-[#090814] shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border/50 bg-[#121020]/90 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="size-3 rounded-full bg-red-500/80" />
            <span className="size-3 rounded-full bg-yellow-500/80" />
            <span className="size-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <Terminal className="size-3.5 text-primary" />
            <span>developer-quickstart.{activeTab === "curl" ? "sh" : activeTab === "python" ? "py" : activeTab === "react" ? "tsx" : "ts"}</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-black/40 p-1 border border-border/40">
          {(["typescript", "curl", "python", "react"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab === "typescript"
                ? "TypeScript"
                : tab === "curl"
                ? "cURL"
                : tab === "python"
                ? "Python"
                : "React Hook"}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/30 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-white hover:border-primary/40 transition-colors"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-success" />
              <span className="text-success">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="relative overflow-x-auto p-6 text-xs sm:text-sm font-mono leading-relaxed bg-[#060511]">
        <pre className="text-foreground/90 font-mono">
          <code>{snippets[activeTab]}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between border-t border-border/40 bg-[#0d0c1d] px-6 py-3.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-info" />
          <span>Webhook signature verification with HMAC SHA-256</span>
        </div>
        <a
          href="/admin"
          className="text-primary hover:underline font-semibold"
        >
          Explore Full API Documentation &rarr;
        </a>
      </div>
    </div>
  );
}
