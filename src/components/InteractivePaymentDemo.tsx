import { useState, useEffect } from "react";
import { CheckCircle2, Copy, ArrowRight, ShieldCheck, RefreshCw, Sparkles, ExternalLink } from "lucide-react";

interface TokenOption {
  symbol: string;
  name: string;
  network: string;
  icon: string;
  rate: number; // USD per token
  address: string;
  color: string;
}

const tokens: TokenOption[] = [
  {
    symbol: "USDT",
    name: "Tether USD",
    network: "TRON (TRC20)",
    icon: "/assets/usdt.png",
    rate: 1.0,
    address: "TXw8Q6Z8V2b...3K9pLm1",
    color: "#26A17B",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    network: "Solana",
    icon: "/assets/usdc.png",
    rate: 1.0,
    address: "EPjFWdd5Auf...u7e716C",
    color: "#2775CA",
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    network: "Bitcoin Core",
    icon: "/assets/btc.png",
    rate: 96500,
    address: "bc1qxy2kgdyg...8942k9",
    color: "#F7931A",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    network: "Ethereum (ERC20)",
    icon: "/assets/eth.png",
    rate: 3450,
    address: "0x71C...B2901aF9",
    color: "#627EEA",
  },
  {
    symbol: "SOL",
    name: "Solana",
    network: "Solana Mainnet",
    icon: "/assets/sol.png",
    rate: 215,
    address: "So1111111...11111112",
    color: "#9945FF",
  },
  {
    symbol: "TON",
    name: "Toncoin",
    network: "TON Blockchain",
    icon: "/assets/ton.png",
    rate: 6.8,
    address: "EQBvW8Z5hu...0D5fE3L",
    color: "#0098EA",
  },
];

export default function InteractivePaymentDemo() {
  const [selectedToken, setSelectedToken] = useState<TokenOption>(tokens[0]);
  const [fiatAmount, setFiatAmount] = useState<number>(150);
  const [isSimulating, setIsSimulating] = useState(false);
  const [step, setStep] = useState<"idle" | "detecting" | "confirming" | "settled">("idle");
  const [confirmations, setConfirmations] = useState(0);
  const [copied, setCopied] = useState(false);

  const cryptoAmount = (fiatAmount / selectedToken.rate).toFixed(
    selectedToken.symbol === "BTC" ? 6 : selectedToken.symbol === "ETH" ? 4 : 2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedToken.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setStep("detecting");
    setConfirmations(0);

    setTimeout(() => {
      setStep("confirming");
      let count = 1;
      setConfirmations(1);

      const interval = setInterval(() => {
        count += 3;
        if (count >= 12) {
          clearInterval(interval);
          setConfirmations(12);
          setStep("settled");
          setIsSimulating(false);
        } else {
          setConfirmations(count);
        }
      }, 400);
    }, 1200);
  };

  const resetDemo = () => {
    setStep("idle");
    setConfirmations(0);
    setIsSimulating(false);
  };

  return (
    <div className="relative mx-auto max-w-5xl rounded-3xl border border-primary/30 bg-[#0d0c1d]/90 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-primary/20">
      {/* Decorative Neon Halo */}
      <div className="pointer-events-none absolute -top-20 -left-20 size-[320px] rounded-full bg-primary/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 size-[320px] rounded-full bg-success/10 blur-[90px]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            Live Checkout Simulator
          </div>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">
            Experience the 1-Second Payment Flow
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Test our real-time invoice generation and non-custodial on-chain settlement pipeline.
          </p>
        </div>

        {step !== "idle" && (
          <button
            onClick={resetDemo}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-surface/40 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-white hover:border-primary/40 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="size-3.5" />
            Reset Simulator
          </button>
        )}
      </div>

      {/* Main Sandbox Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side: Controls & Token Selection */}
        <div className="lg:col-span-5 space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Invoice Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">$</span>
              <input
                type="number"
                min="5"
                max="100000"
                value={fiatAmount}
                onChange={(e) => setFiatAmount(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-2xl border border-border/60 bg-[#151329] py-3.5 pl-9 pr-4 text-xl font-bold text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="mt-2 flex gap-2">
              {[50, 150, 500, 1000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setFiatAmount(preset)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    fiatAmount === preset
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-surface/30 text-muted-foreground hover:text-white"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Select Cryptocurrency */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
              Select Payment Currency
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {tokens.map((t) => {
                const isSelected = selectedToken.symbol === t.symbol;
                return (
                  <button
                    key={t.symbol}
                    onClick={() => {
                      setSelectedToken(t);
                      if (step === "settled") resetDemo();
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/15 shadow-md shadow-primary/10"
                        : "border-border/40 bg-surface/20 hover:border-border/80 hover:bg-surface/40"
                    }`}
                  >
                    <img src={t.icon} alt={t.symbol} className="size-7 object-contain" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{t.symbol}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground block truncate max-w-[90px]">
                        {t.network}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Conversion Summary */}
          <div className="rounded-2xl border border-border/40 bg-surface/20 p-4">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Payable Crypto:</span>
              <span className="font-mono font-bold text-white">
                {cryptoAmount} {selectedToken.symbol}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Merchant Fee (CosComPay):</span>
              <span className="font-semibold text-success">0% (Zero)</span>
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Settlement Speed:</span>
              <span className="text-info font-medium">&lt; 1 Second</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Invoice Card & Simulator */}
        <div className="lg:col-span-7">
          <div className="relative rounded-3xl border border-primary/25 bg-[#121024] p-6 sm:p-8 shadow-xl">
            {/* Top Invoice Bar */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-2 rounded-full bg-success animate-ping" />
                <span className="text-xs font-mono text-muted-foreground">INV-849204-LIVE</span>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary">
                Awaiting Payment
              </span>
            </div>

            {/* QR Code & Pay Details View */}
            {step === "idle" && (
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-6">
                {/* Simulated QR Code with Cyber Grid */}
                <div className="relative flex size-36 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/30 bg-black p-3 shadow-inner">
                  {/* Stylized QR placeholder with center token icon */}
                  <div className="grid size-full grid-cols-5 gap-1 p-1 bg-white/5 rounded-lg">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          i === 0 || i === 4 || i === 20 || i === 24 || i === 12 || i % 3 === 0
                            ? "bg-white"
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-9 rounded-full bg-[#121024] p-1 border border-primary/50 shadow-md">
                      <img src={selectedToken.icon} alt={selectedToken.symbol} className="size-full object-contain" />
                    </div>
                  </div>
                </div>

                {/* Address & Pay instructions */}
                <div className="flex-1 w-full space-y-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Send exact amount:</span>
                    <p className="text-2xl font-black text-white font-mono">
                      {cryptoAmount} <span className="text-primary">{selectedToken.symbol}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground">Deposit Address ({selectedToken.network}):</span>
                    <div className="mt-1 flex items-center justify-between rounded-xl border border-border/50 bg-black/40 px-3 py-2">
                      <span className="font-mono text-xs text-foreground/90 truncate max-w-[200px]">
                        {selectedToken.address}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="ml-2 text-primary hover:text-primary/80 transition-colors p-1"
                        title="Copy Address"
                      >
                        {copied ? <CheckCircle2 className="size-4 text-success" /> : <Copy className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* In-Flight Simulation Progress */}
            {step !== "idle" && (
              <div className="mt-6 py-4 text-center space-y-6">
                {step === "detecting" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="inline-flex size-14 items-center justify-center rounded-full bg-info/10 text-info border border-info/30">
                      <RefreshCw className="size-7 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Detecting Mempool Broadcast...</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Scanning {selectedToken.network} nodes for incoming tx hash...
                      </p>
                    </div>
                  </div>
                )}

                {step === "confirming" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="inline-flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/30">
                      <ShieldCheck className="size-8 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        Confirming On-Chain ({confirmations}/12 Blocks)
                      </h4>
                      <div className="mx-auto mt-3 h-2 max-w-xs rounded-full bg-surface/50 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-info transition-all duration-300"
                          style={{ width: `${(confirmations / 12) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === "settled" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="inline-flex size-16 items-center justify-center rounded-full bg-success/20 text-success border border-success/40 shadow-lg shadow-success/20">
                      <CheckCircle2 className="size-10" />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-white">Payment Confirmed & Settled!</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Funds credited directly to your non-custodial wallet with 0% fee deduction.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-success/30 bg-success/5 p-4 text-left font-mono text-xs space-y-1.5 max-w-md mx-auto">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tx Hash:</span>
                        <span className="text-foreground truncate max-w-[180px]">0x8f3c4e...9b1a07</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="text-white font-bold">{cryptoAmount} {selectedToken.symbol} (${fiatAmount} USD)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="text-success font-bold">100% Finalized</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Trigger Button */}
            <div className="mt-8 pt-4 border-t border-border/40">
              {step === "idle" && (
                <button
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className="group relative w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/40 active:scale-[0.99]"
                >
                  <Sparkles className="size-4" />
                  <span>Simulate Instant On-Chain Payment</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}

              {step === "settled" && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={resetDemo}
                    className="flex-1 rounded-xl border border-border/60 bg-surface/30 py-3 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
                  >
                    Test Another Currency
                  </button>
                  <a
                    href="/pay"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                  >
                    <span>Launch Live Gateway</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
