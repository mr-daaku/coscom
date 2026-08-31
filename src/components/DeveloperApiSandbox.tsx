import { useState } from "react";
import { Copy, Check, Terminal, Code2 } from "lucide-react";

export default function DeveloperApiSandbox() {
  const [activeTab, setActiveTab] = useState<"react" | "typescript" | "curl" | "python">("react");
  const [copied, setCopied] = useState(false);

  const snippets = {
    react: `// 1. Embed Drop-in React / Next.js Checkout Component
import { CosComPayPaymentWidget } from "@coscompay/react";

export function CheckoutModal({ orderId, totalUSD }: { orderId: string; totalUSD: number }) {
  return (
    <CosComPayPaymentWidget
      endpoint="https://pay.yourdomain.com" // Your Self-Hosted Gateway
      amountUSD={totalUSD}
      orderId={orderId}
      acceptedTokens={["USDT", "USDC", "BTC", "ETH", "SOL", "TON"]}
      onSuccess={(txHash) => console.log("Paid on-chain:", txHash)}
      theme="dark"
    />
  );
}`,

    typescript: `// 2. Node.js / TypeScript Server SDK
import { CosComPayGateway } from "@coscompay/sdk";

const coscompay = new CosComPayGateway({
  endpoint: "https://pay.yourdomain.com", // Your Self-Hosted Instance
  adminSecret: process.env.COSCOMPAY_ADMIN_SECRET,
});

// Create a dynamic multi-chain crypto invoice
const invoice = await coscompay.invoices.create({
  amountUSD: 99.00,
  acceptedChains: ["solana", "tron", "bsc", "ethereum", "ton"],
  metadata: { orderId: "ORD-9912", userId: "usr_401" },
  webhookUrl: "https://api.yourdomain.com/webhooks/coscompay",
});

console.log("Deposit Address:", invoice.payAddress);`,

    curl: `# 3. Standard REST API Call to Your Gateway
curl -X POST https://pay.yourdomain.com/api/v1/invoices \\
  -H "Authorization: Bearer YOUR_ADMIN_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amountUSD": 99.00,
    "acceptedTokens": ["USDT", "BTC", "ETH", "SOL"],
    "webhookUrl": "https://api.yourdomain.com/webhooks/coscompay",
    "metadata": { "orderId": "ORD-9912" }
  }'`,

    python: `# 4. Python / Django / FastAPI SDK
from coscompay import CosComPayGateway

client = CosComPayGateway(
    endpoint="https://pay.yourdomain.com",
    admin_secret=os.getenv("COSCOMPAY_ADMIN_SECRET")
)

# Generate payment session
invoice = client.invoices.create(
    amount_usd=99.00,
    accepted_tokens=["USDT", "BTC", "ETH", "SOL", "TON"],
    webhook_url="https://api.yourdomain.com/webhooks/coscompay",
    metadata={"order_id": "ORD-9912"}
)

print(f"Pay URI: {invoice.checkout_url}")`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090814] shadow-2xl">
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
            <span>embed-gateway.{activeTab === "curl" ? "sh" : activeTab === "python" ? "py" : activeTab === "react" ? "tsx" : "ts"}</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-black/40 p-1 border border-border/40">
          {(["react", "typescript", "curl", "python"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab === "react"
                ? "React Widget"
                : tab === "typescript"
                ? "TypeScript SDK"
                : tab === "curl"
                ? "cURL"
                : "Python"}
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
      <div className="relative overflow-x-auto p-6 text-xs sm:text-sm font-mono leading-relaxed bg-[#05040f]">
        <pre className="text-foreground/90 font-mono">
          <code>{snippets[activeTab]}</code>
        </pre>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between border-t border-border/40 bg-[#0d0c1d] px-6 py-3.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Code2 className="size-4 text-cyan-400" />
          <span>Compatible with Next.js, Remix, Vite, React Native, Node.js & Python</span>
        </div>
        <span className="font-mono text-emerald-400 text-xs">
          Direct to your private RPCs
        </span>
      </div>
    </div>
  );
}
