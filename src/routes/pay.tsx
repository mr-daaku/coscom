import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/pay")({
  head: () => ({
    meta: [
      { title: "Pay Invoice — CosMos Pay" },
      {
        name: "description",
        content:
          "Secure crypto checkout: select token, choose network, and pay with live expiry countdown.",
      },
      { property: "og:title", content: "Pay with crypto — CosMos Pay" },
      {
        property: "og:description",
        content:
          "Multi-chain crypto checkout with live countdown and on-chain confirmation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PaymentPage,
});

const TOTAL = 30 * 60;

// ── Token data ──
const tokens = [
  { symbol: "USDT", name: "Tether USD", img: "/assets/usdt.png", price: "$1.00" },
  { symbol: "USDC", name: "USD Coin", img: "/assets/usdc.png", price: "$1.00" },
  { symbol: "BNB", name: "BNB Chain", img: "/assets/bnb.png", price: "$600" },
  { symbol: "ETH", name: "Ethereum", img: "/assets/eth.png", price: "$4,284" },
  { symbol: "TRX", name: "TRON", img: "/assets/pol.png", price: "$0.28" },
  { symbol: "TON", name: "Toncoin", img: "/assets/ton.png", price: "$5.30" },
  { symbol: "BTC", name: "Bitcoin", img: "/assets/btc.png", price: "$112,480" },
];

interface ChainSupport {
  chain: string;
  standard: string;
}

const chainTokens: Record<string, ChainSupport[]> = {
  USDT: [
    { chain: "BSC", standard: "BEP-20" },
    { chain: "Ethereum", standard: "ERC-20" },
    { chain: "TRON", standard: "TRC-20" },
    { chain: "Polygon", standard: "ERC-20" },
    { chain: "Solana", standard: "SPL" },
  ],
  USDC: [
    { chain: "BSC", standard: "BEP-20" },
    { chain: "Ethereum", standard: "ERC-20" },
    { chain: "Polygon", standard: "ERC-20" },
    { chain: "Solana", standard: "SPL" },
  ],
  BNB: [{ chain: "BSC", standard: "Native" }],
  ETH: [{ chain: "Ethereum", standard: "Native" }],
  TRX: [{ chain: "TRON", standard: "Native" }],
  TON: [{ chain: "TON", standard: "Native" }],
  BTC: [{ chain: "Bitcoin", standard: "Native" }],
};

const networkColors: Record<string, string> = {
  BSC: "#F0B90B",
  Ethereum: "#627EEA",
  TRON: "#FF0013",
  Polygon: "#8247E5",
  Solana: "#9945FF",
  TON: "#0098EA",
  Bitcoin: "#F7931A",
};

const networkExplorers: Record<string, string> = {
  BSC: "bscscan.com",
  Ethereum: "etherscan.io",
  TRON: "tronscan.org",
  Polygon: "polygonscan.com",
  Solana: "solscan.io",
  TON: "tonscan.org",
  Bitcoin: "blockchair.com",
};

const chainIcons: Record<string, string> = {
  BSC: "/assets/bnb.png",
  Ethereum: "/assets/eth.png",
  TRON: "/assets/pol.png",
  Polygon: "/assets/pol.png",
  Solana: "/assets/sol.png",
  TON: "/assets/ton.png",
  Bitcoin: "/assets/btc.png",
};

const addresses: Record<string, string> = {
  BSC: "0x51d0f38b17c9a5cd2e7b104f6c9a10c4be92ab77",
  Ethereum: "0x9a71fe0cb42d8ab1e77c02f5d3417ac0be519d34",
  TRON: "TQ9mR4kLp2XcVb7nHs1YuKf3Ze8Aq5Dw7K",
  Polygon: "0x9a71fe0cb42d8ab1e77c02f5d3417ac0be519d34",
  Solana: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  TON: "EQCd7Y1m4pKcRr1Zx8kQfXn0mAe2Rr9uWc71LpKu81mQ",
  Bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
};

const confirmations: Record<string, number> = {
  BSC: 15,
  Ethereum: 12,
  TRON: 19,
  Polygon: 128,
  Solana: 32,
  TON: 1,
  Bitcoin: 3,
};

// ── Animations CSS ──
const animationsCSS = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px color-mix(in oklch, var(--primary) 20%, transparent); }
    50% { box-shadow: 0 0 40px color-mix(in oklch, var(--primary) 40%, transparent); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fade-out {
    from { opacity: 1; transform: translateY(0) scale(1); }
    to { opacity: 0; transform: translateY(-16px) scale(0.98); }
  }
  @keyframes modal-in {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes checkmark {
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes confetti-fall {
    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  .step-enter { animation: fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .step-exit { animation: fade-out 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .modal-enter { animation: modal-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .shimmer-border {
    background: linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 30%, transparent), transparent);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }
  .glow-card:hover { animation: glow-pulse 2s ease-in-out infinite; }
  .token-card {
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .token-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px -8px oklch(0 0 0 / 60%);
  }
  .chain-card {
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .chain-card:hover {
    transform: translateY(-2px);
  }
  .confetti-piece {
    position: fixed;
    width: 8px;
    height: 8px;
    top: -10px;
    animation: confetti-fall 3s linear forwards;
  }
`;

function PaymentPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const [left, setLeft] = useState(TOTAL - 1);
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [animating, setAnimating] = useState(false);

  // TX Hash & Receipt states
  const [showTxModal, setShowTxModal] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<number[]>([]);



  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const navigateTo = (target: 1 | 2 | 3) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(target);
      setAnimating(false);
    }, 250);
  };

  const tokenObj = tokens.find((t) => t.symbol === selectedToken);
  const address = selectedChain ? addresses[selectedChain] ?? "" : "";
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const progress = (left / TOTAL) * 100;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const availableChains = selectedToken ? chainTokens[selectedToken] ?? [] : [];

  const handleSubmitTx = () => {
    if (txHash.trim().length < 10) return;
    setShowTxModal(false);
    // Trigger confetti
    setConfettiPieces(Array.from({ length: 30 }, (_, i) => i));
    setTimeout(() => setConfettiPieces([]), 3500);
    setShowReceipt(true);
  };

  const handleDownloadReceipt = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 800, 1000);
    grad.addColorStop(0, "#0a0a1a");
    grad.addColorStop(0.5, "#111128");
    grad.addColorStop(1, "#0a0a1a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1000);

    // Border
    ctx.strokeStyle = "rgba(124,58,237,0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 760, 960);

    // Header
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(400, 120, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Payment Successful!", 400, 210);

    // Line
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 240);
    ctx.lineTo(740, 240);
    ctx.stroke();

    // Amount
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "12px sans-serif";
    ctx.fillText("AMOUNT PAID", 400, 290);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px monospace";
    ctx.fillText(`250.00 ${selectedToken ?? "USDT"}`, 400, 350);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "14px sans-serif";
    ctx.fillText("≈ $250.00 USD", 400, 380);

    // Details
    const details = [
      ["Invoice", "INV-4821"],
      ["Network", `${selectedChain || "-"} (${selectedStandard || "-"})`],
      ["Tx Hash", txHash.length > 30 ? txHash.slice(0, 15) + "..." + txHash.slice(-10) : txHash],
      ["Date", new Date().toLocaleString()],
      ["Status", "Confirmed ✓"],
    ];
    let y = 440;
    details.forEach(([label, value]) => {
      if (!label || !value) return;
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(label, 80, y);
      ctx.fillStyle = "#fff";
      ctx.font = "14px monospace";
      ctx.textAlign = "right";
      ctx.fillText(value, 720, y);
      y += 40;
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.moveTo(80, y - 15);
      ctx.lineTo(720, y - 15);
      ctx.stroke();
    });

    // Footer
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px sans-serif";
    ctx.fillText("Powered by CosMos Pay", 400, 920);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.font = "10px sans-serif";
    ctx.fillText("This is a virtual receipt for demonstration purposes", 400, 945);

    const link = document.createElement("a");
    link.download = `CosMos-Receipt-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <style>{animationsCSS}</style>

      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background: `
            radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, color-mix(in oklch, var(--primary) 10%, transparent), transparent 50%),
            radial-gradient(600px circle at 10% 0%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 60%),
            radial-gradient(600px circle at 95% 100%, color-mix(in oklch, var(--success) 14%, transparent), transparent 60%)
          `,
        }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-15"
            style={{
              width: `${6 + i * 3}px`,
              height: `${6 + i * 3}px`,
              left: `${10 + i * 18}%`,
              top: `${8 + i * 14}%`,
              background: "linear-gradient(135deg, var(--primary), var(--success))",
              animation: `float ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*                     PAYMENT RECEIPT SCREEN                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {showReceipt && tokenObj && selectedChain && (
        <div className="relative z-50 flex min-h-screen w-full items-center justify-center">
          {/* Confetti */}
          {confettiPieces.map((i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: ["#F0B90B", "#627EEA", "#FF0013", "#8247E5", "#9945FF", "#0098EA", "#F7931A", "#10b981"][i % 8],
                borderRadius: i % 2 === 0 ? "50%" : "2px",
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}

          <div className="w-full max-w-[500px] space-y-4">
            {/* Receipt Card */}
            <div

              className="modal-enter rounded-3xl border border-border p-8"
              style={{
                background: "linear-gradient(145deg, #0a0a1a 0%, #111128 50%, #0a0a1a 100%)",
              }}
            >
              {/* Success Icon */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="flex size-20 items-center justify-center rounded-full bg-success/15">
                    <svg className="size-10 text-success" viewBox="0 0 52 52" fill="none">
                      <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      <path
                        d="M14 27l7 7 16-16"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          strokeDasharray: 100,
                          animation: "checkmark 0.6s ease-out 0.3s forwards",
                          strokeDashoffset: 100,
                        }}
                      />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-bold">Payment Successful!</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your payment has been confirmed on-chain
                </p>
              </div>

              {/* Amount */}
              <div className="mt-6 rounded-2xl bg-surface/40 p-5 text-center">
                <p className="text-[10px] uppercase tracking-wider text-subtle">Amount Paid</p>
                <div className="mt-2 flex items-center justify-center gap-3">
                  <img src={tokenObj.img} alt={tokenObj.symbol} className="size-10 object-contain" />
                  <p className="mono text-4xl font-bold">250.00</p>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      background: `${networkColors[selectedChain]}18`,
                      color: networkColors[selectedChain],
                    }}
                  >
                    {tokenObj.symbol}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">≈ $250.00 USD</p>
              </div>

              {/* Details Grid */}
              <div className="mt-4 space-y-2">
                {[
                  { label: "Invoice", value: "INV-4821" },
                  { label: "Network", value: `${selectedChain} (${selectedStandard})` },
                  { label: "From", value: "0xYour...Wallet" },
                  { label: "To", value: address.slice(0, 12) + "..." + address.slice(-6) },
                  { label: "Tx Hash", value: txHash.slice(0, 16) + "..." + txHash.slice(-8) },
                  { label: "Date", value: new Date().toLocaleString() },
                  { label: "Status", value: "Confirmed", status: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-surface/30 px-4 py-2.5">
                    <span className="text-[11px] text-muted-foreground">{item.label}</span>
                    {"status" in item && item.status ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-success">
                        <span className="size-1.5 rounded-full bg-success" />
                        {item.value}
                      </span>
                    ) : (
                      <span className="mono text-[11px] font-medium">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Powered by */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-subtle">
                <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <ellipse cx="12" cy="12" rx="4" ry="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
                Powered by CosMos Pay
              </div>
            </div>

            {/* Action Buttons */}
            <div className="modal-enter flex gap-3" style={{ animationDelay: "0.2s" }}>
              <button
                onClick={() => {
                  setShowReceipt(false);
                  setTxHash("");
                  setStep(1);
                  setSelectedToken(null);
                  setSelectedChain(null);
                  setSelectedStandard(null);
                  setLeft(TOTAL - 1);
                }}
                className="flex-1 rounded-xl border border-border bg-surface/40 py-3 text-sm font-medium transition-all hover:bg-surface/60"
              >
                Close
              </button>
              <button
                onClick={handleDownloadReceipt}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*                         MAIN PAY FLOW                          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {!showReceipt && (
        <div className="relative z-10 w-full max-w-[1000px]">
          {/* CosMos Brand */}
          <div className="mb-6 flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15">
              <svg className="size-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="4" ry="10" strokeWidth="1.5" />
                <line x1="2" y1="12" x2="22" y2="12" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">CosMos</p>
              <p className="text-[10px] text-subtle">Secure Crypto Payments</p>
            </div>
          </div>

          {/* Back Button */}
          {step > 1 && (
            <button
              onClick={() => {
                if (step === 3) {
                  setLeft(TOTAL - 1);
                  navigateTo(2);
                } else {
                  setSelectedToken(null);
                  navigateTo(1);
                }
              }}
              className="group mb-5 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg className="size-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {step === 3 ? `Back to ${selectedToken} networks` : "Back to token selection"}
            </button>
          )}

          {/* Step Indicator */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                    step >= s ? "bg-primary text-primary-foreground" : "bg-surface text-muted-foreground"
                  }`}
                >
                  {step > s ? (
                    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 3 && (
                  <div className={`h-[2px] w-12 rounded-full transition-all duration-500 ${step > s ? "bg-primary" : "bg-surface"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="mb-6 flex justify-between px-1 text-[10px] uppercase tracking-wider">
            <span className={step >= 1 ? "text-primary" : "text-subtle"}>Token</span>
            <span className={step >= 2 ? "text-primary" : "text-subtle"}>Network</span>
            <span className={step >= 3 ? "text-primary" : "text-subtle"}>Pay</span>
          </div>

          {/* Step Content */}
          <div className={animating ? "step-exit" : "step-enter"}>
            {/* ═══════════ STEP 1: SELECT TOKEN ═══════════ */}
            {step === 1 && (
              <div className="panel p-6">
                <div className="mb-5 text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                    <svg className="size-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold">Select Token</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Choose which cryptocurrency you want to pay with</p>
                </div>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => { setSelectedToken(token.symbol); navigateTo(2); }}
                      className="token-card group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface/30 p-3 hover:border-primary/40 hover:bg-surface/60"
                    >
                      <img src={token.img} alt={token.symbol} className="size-9 object-contain drop-shadow-lg transition-transform group-hover:scale-110" />
                      <div className="text-center">
                        <p className="text-xs font-semibold">{token.symbol}</p>
                        <p className="text-[9px] text-muted-foreground">{token.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════ STEP 2: SELECT CHAIN ═══════════ */}
            {step === 2 && tokenObj && (
              <div className="panel p-6">
                <div className="mb-5 text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                    <img src={tokenObj.img} alt={tokenObj.symbol} className="size-7 object-contain" />
                  </div>
                  <h2 className="text-lg font-semibold">Select Network</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Which chain do you want to send <span className="font-medium text-foreground">{tokenObj.symbol}</span> on?
                  </p>
                </div>
                <div className="space-y-3">
                  {availableChains.map((support) => (
                    <button
                      key={support.chain}
                      onClick={() => {
                        setSelectedChain(support.chain);
                        setSelectedStandard(support.standard);
                        navigateTo(3);
                      }}
                      className="chain-card group flex w-full items-center gap-4 rounded-2xl border border-border bg-surface/30 p-4 text-left hover:border-primary/40 hover:bg-surface/60"
                    >
                      <div className="flex size-12 items-center justify-center rounded-xl" style={{ background: `${networkColors[support.chain]}15`, border: `1px solid ${networkColors[support.chain]}22` }}>
                        <img src={chainIcons[support.chain]} alt={support.chain} className="size-7 object-contain" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{support.chain}</p>
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: `${networkColors[support.chain]}15`, color: networkColors[support.chain] }}>
                            {support.standard}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {confirmations[support.chain]} block confirmations · {networkExplorers[support.chain]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full" style={{ background: networkColors[support.chain] }} />
                        <svg className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════ STEP 3: PAYMENT (DESKTOP 50/50) ═══════════ */}
            {step === 3 && tokenObj && selectedChain && (
              <>
                {/* ── Desktop Layout: 50 / 50 ── */}
                <div className="hidden lg:grid lg:grid-cols-2 lg:gap-5">
                  {/* LEFT 50% — Details */}
                  <div className="space-y-4">
                    {/* Invoice Header */}
                    <div className="panel p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: `${networkColors[selectedChain]}18`, border: `1px solid ${networkColors[selectedChain]}28` }}>
                            <img src={tokenObj.img} alt={tokenObj.symbol} className="size-6 object-contain" />
                          </div>
                          <div>
                            <p className="text-xs text-subtle">Invoice</p>
                            <p className="mono text-sm font-medium">INV-4821</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1">
                          <span className="pulse-dot size-2 rounded-full bg-success" />
                          <span className="text-[11px] font-medium text-success">Awaiting</span>
                        </div>
                      </div>

                      {/* Invoice Details */}
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {[
                          { label: "Description", value: "Pro plan · annual" },
                          { label: "Merchant", value: "CosMos" },
                          { label: "Created", value: "24 Aug 2026" },
                        ].map((item) => (
                          <div key={item.label} className="rounded-xl bg-surface/40 px-3 py-2">
                            <p className="text-[10px] uppercase tracking-wider text-subtle">{item.label}</p>
                            <p className="mt-0.5 text-xs font-medium">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="panel p-5">
                      <div className="text-center">
                        <p className="text-[10px] uppercase tracking-wider text-subtle">Amount to Pay</p>
                        <div className="mt-2 flex items-center justify-center gap-3">
                          <img src={tokenObj.img} alt={tokenObj.symbol} className="size-10 object-contain drop-shadow-lg" />
                          <p className="mono text-4xl font-bold tracking-tight">250.00</p>
                          <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: `${networkColors[selectedChain]}18`, color: networkColors[selectedChain], border: `1px solid ${networkColors[selectedChain]}28` }}>
                            {tokenObj.symbol}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">≈ $250.00 USD</p>
                      </div>
                    </div>

                    {/* Timer */}
                    <div className="panel p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="size-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[11px] text-muted-foreground">Expires in</span>
                        </div>
                        <span className="mono text-lg font-bold text-warning">{mm}:{ss}</span>
                      </div>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, ${progress > 50 ? "var(--success)" : progress > 25 ? "var(--warning)" : "var(--destructive)"}, ${progress > 50 ? "var(--success)" : progress > 25 ? "var(--warning)" : "var(--destructive)"}aa)`,
                          }}
                        />
                      </div>
                    </div>

                    {/* API Info */}
                    <div className="panel p-4">
                      <div className="space-y-2">
                        {[
                          { label: "API Provider", value: "CosMos Pay v2.1" },
                          { label: "Network", value: `${selectedChain} (${selectedStandard})`, icon: chainIcons[selectedChain] },
                          { label: "Explorer", value: networkExplorers[selectedChain], link: `https://${networkExplorers[selectedChain]}` },
                          { label: "Confirmations", value: `${confirmations[selectedChain]} blocks` },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between rounded-lg bg-surface/40 px-3 py-2">
                            <span className="text-[11px] text-muted-foreground">{item.label}</span>
                            {"link" in item ? (
                              <a href={item.link as string} target="_blank" rel="noopener noreferrer" className="mono text-[11px] font-medium text-primary hover:underline">
                                {item.value} ↗
                              </a>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                {"icon" in item && item.icon && <img src={item.icon as string} alt="" className="size-3.5 object-contain" />}
                                <span className="mono text-[11px] font-medium">{item.value}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT 50% — QR + Address + Check Payment */}
                  <div className="space-y-4">
                    {/* QR Code */}
                    <div className="panel glow-card relative overflow-hidden p-6">
                      <div className="shimmer-border absolute inset-x-0 top-0 h-[1px]" />
                      <p className="mb-4 text-center text-[10px] uppercase tracking-wider text-subtle">Scan QR to Pay</p>
                      <div className="mx-auto flex w-fit items-center justify-center rounded-2xl border border-border bg-white p-5">
                        <div className="grid grid-cols-[repeat(11,1fr)] gap-[3px]">
                          {Array.from({ length: 121 }).map((_, i) => {
                            const row = Math.floor(i / 11);
                            const col = i % 11;
                            const isCorner = (row < 3 && col < 3) || (row < 3 && col > 7) || (row > 7 && col < 3);
                            const isBorder = isCorner && (row === 0 || row === 2 || col === 0 || col === 2 || col === 8 || col === 10);
                            const isInner = isCorner && row >= 1 && row <= 1 && col >= 1 && col <= 1;
                            const isRandom = !isCorner && Math.random() > 0.55;
                            return (
                              <div key={i} className="aspect-square rounded-[1px]" style={{ background: isBorder || isInner || isRandom ? "#1a1a2e" : "transparent" }} />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="panel p-5">
                      <p className="mb-2 text-[10px] uppercase tracking-wider text-subtle">
                        Send <span className="font-semibold text-foreground">250.00 {tokenObj.symbol}</span> on{" "}
                        <span className="font-semibold text-foreground">{selectedChain}</span>
                        {selectedStandard && (
                          <span className="ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium" style={{ background: `${networkColors[selectedChain]}15`, color: networkColors[selectedChain] }}>
                            {selectedStandard}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="mono flex-1 overflow-hidden rounded-xl border border-border bg-surface/40 px-3 py-2.5 text-[11px] break-all text-muted-foreground">
                          {address}
                        </div>
                        <button onClick={copy} className="shrink-0 rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-[11px] font-medium transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary">
                          {copied ? "✓ Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Check Payment Button */}
                    <button
                      onClick={() => setShowTxModal(true)}
                      className="w-full rounded-xl py-3.5 text-sm font-semibold transition-all duration-300 hover:brightness-110 hover:shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${networkColors[selectedChain]}, ${networkColors[selectedChain]}cc)`, color: "#fff" }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Check Payment
                      </div>
                    </button>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <svg className="size-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Secure · {confirmations[selectedChain]} confirmations</span>
                      </div>
                      <span>CosMos Pay</span>
                    </div>
                  </div>
                </div>

                {/* ── Mobile Layout ── */}
                <div className="space-y-4 lg:hidden">
                  <div className="panel p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: `${networkColors[selectedChain]}18`, border: `1px solid ${networkColors[selectedChain]}28` }}>
                          <img src={tokenObj.img} alt={tokenObj.symbol} className="size-6 object-contain" />
                        </div>
                        <div>
                          <p className="text-xs text-subtle">Invoice</p>
                          <p className="mono text-sm font-medium">INV-4821</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1">
                        <span className="pulse-dot size-2 rounded-full bg-success" />
                        <span className="text-[11px] font-medium text-success">Awaiting</span>
                      </div>
                    </div>
                  </div>

                  <div className="panel p-5 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-subtle">Amount to Pay</p>
                    <div className="mt-2 flex items-center justify-center gap-3">
                      <img src={tokenObj.img} alt={tokenObj.symbol} className="size-10 object-contain drop-shadow-lg" />
                      <p className="mono text-4xl font-bold tracking-tight">250.00</p>
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: `${networkColors[selectedChain]}18`, color: networkColors[selectedChain] }}>
                        {tokenObj.symbol}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">≈ $250.00 USD</p>
                  </div>

                  <div className="panel p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">Expires in</span>
                      <span className="mono text-lg font-bold text-warning">{mm}:{ss}</span>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-gradient-to-r from-warning to-destructive transition-all duration-1000" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="panel glow-card relative overflow-hidden p-5">
                    <div className="shimmer-border absolute inset-x-0 top-0 h-[1px]" />
                    <p className="mb-3 text-center text-[10px] uppercase tracking-wider text-subtle">Scan QR</p>
                    <div className="mx-auto flex w-fit items-center justify-center rounded-2xl border border-border bg-white p-4">
                      <div className="grid grid-cols-[repeat(9,1fr)] gap-[2px]">
                        {Array.from({ length: 81 }).map((_, i) => {
                          const row = Math.floor(i / 9);
                          const col = i % 9;
                          const isCorner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
                          const isBorder = isCorner && (row === 0 || row === 2 || col === 0 || col === 2 || col === 6 || col === 8);
                          const isInner = isCorner && row === 1 && col === 1;
                          const isRandom = !isCorner && Math.random() > 0.55;
                          return <div key={i} className="aspect-square rounded-[1px]" style={{ background: isBorder || isInner || isRandom ? "#1a1a2e" : "transparent" }} />;
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="panel p-4">
                    <div className="flex items-center gap-2">
                      <div className="mono flex-1 overflow-hidden rounded-xl border border-border bg-surface/40 px-3 py-2.5 text-[11px] break-all text-muted-foreground">
                        {address}
                      </div>
                      <button onClick={copy} className="shrink-0 rounded-xl border border-border bg-surface/60 px-3 py-2.5 text-[11px] font-medium transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary">
                        {copied ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowTxModal(true)}
                    className="w-full rounded-xl py-3.5 text-sm font-semibold transition-all hover:brightness-110"
                    style={{ background: `linear-gradient(135deg, ${networkColors[selectedChain]}, ${networkColors[selectedChain]}cc)`, color: "#fff" }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Check Payment
                    </div>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <svg className="size-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Secure · {confirmations[selectedChain]} confirmations</span>
                    </div>
                    <span>CosMos Pay</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*                      TX HASH MODAL                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowTxModal(false)}>
          <div
            className="modal-enter w-full max-w-[420px] rounded-3xl border border-border p-6"
            style={{ background: "linear-gradient(145deg, #111128 0%, #0a0a1a 100%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Verify Payment</h3>
              <button onClick={() => setShowTxModal(false)} className="flex size-8 items-center justify-center rounded-full bg-surface/60 transition-colors hover:bg-surface">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4 rounded-2xl bg-surface/40 p-4">
              <div className="flex items-center gap-3">
                <img src={tokenObj?.img} alt="" className="size-8 object-contain" />
                <div>
                  <p className="text-sm font-medium">250.00 {selectedToken}</p>
                  <p className="text-[11px] text-muted-foreground">on {selectedChain} ({selectedStandard})</p>
                </div>
              </div>
            </div>

            <p className="mb-2 text-xs text-muted-foreground">Paste your transaction hash to verify payment</p>
            <input
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="Enter transaction hash..."
              className="mono w-full rounded-xl border border-border bg-surface/40 px-4 py-3 text-sm text-foreground placeholder:text-subtle focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />

            <button
              onClick={handleSubmitTx}
              disabled={txHash.trim().length < 10}
              className="mt-4 w-full rounded-xl py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: txHash.trim().length >= 10
                  ? `linear-gradient(135deg, ${networkColors[selectedChain ?? "Ethereum"]}, ${networkColors[selectedChain ?? "Ethereum"]}cc)`
                  : undefined,
                color: txHash.trim().length >= 10 ? "#fff" : undefined,
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit & Verify
              </div>
            </button>

            <p className="mt-3 text-center text-[10px] text-subtle">
              You will receive a payment receipt after successful verification
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
