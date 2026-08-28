import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import ScrollReveal from "../components/ScrollReveal";
import ScrollProgressBar from "../components/ScrollProgressBar";
import Navbar from "../components/Navbar";
import AuroraBackground from "../components/AuroraBackground";
import InteractivePaymentDemo from "../components/InteractivePaymentDemo";
import SpotlightCard from "../components/SpotlightCard";
import ComparisonMatrix from "../components/ComparisonMatrix";
import DeveloperApiSandbox from "../components/DeveloperApiSandbox";
import {
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  ArrowRight,
  ChevronDown,
  Layers,
  Code,
  Sparkles,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Cpu,
  Coins,
  Receipt,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CosMos Pay — The Next-Gen Multi-Chain Crypto Payment Gateway" },
      {
        name: "description",
        content:
          "CosMos Pay is an ultra-fast, non-custodial multi-chain crypto payment gateway supporting USDT, USDC, BTC, ETH, SOL, TON, and BNB with instant settlement and 0% merchant fees.",
      },
      { property: "og:title", content: "CosMos Pay — Multi-Chain Crypto Payment Gateway" },
      {
        property: "og:description",
        content:
          "Accept crypto payments across 7+ networks with sub-second settlement, non-custodial wallet routing, and real-time on-chain analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const tokens = [
  { symbol: "USDT", name: "Tether USD", price: "$1.00", change: "+0.01%", img: "/assets/usdt.png" },
  { symbol: "USDC", name: "USD Coin", price: "$1.00", change: "0.00%", img: "/assets/usdc.png" },
  { symbol: "BTC", name: "Bitcoin", price: "$96,540", change: "+3.42%", img: "/assets/btc.png" },
  { symbol: "ETH", name: "Ethereum", price: "$3,450", change: "+2.15%", img: "/assets/eth.png" },
  { symbol: "SOL", name: "Solana", price: "$214.80", change: "+5.68%", img: "/assets/sol.png" },
  { symbol: "BNB", name: "BNB Chain", price: "$645.20", change: "+1.20%", img: "/assets/bnb.png" },
  { symbol: "TON", name: "Toncoin", price: "$6.85", change: "+4.10%", img: "/assets/ton.png" },
  { symbol: "POL", name: "Polygon", price: "$0.58", change: "+1.85%", img: "/assets/pol.png" },
  { symbol: "BASE", name: "Base L2", price: "L2 Protocol", change: "+8.90%", img: "/assets/base.png" },
];

const networks = [
  {
    name: "Solana",
    tps: "65,000 TPS",
    avgFee: "$0.00025",
    blockTime: "400ms",
    status: "Operational",
    color: "#9945FF",
    icon: "/assets/sol.png",
  },
  {
    name: "TRON (TRC-20)",
    tps: "2,000 TPS",
    avgFee: "$0.80",
    blockTime: "3s",
    status: "Operational",
    color: "#FF0013",
    icon: "/assets/pol.png",
  },
  {
    name: "BNB Smart Chain",
    tps: "2,200 TPS",
    avgFee: "$0.04",
    blockTime: "3s",
    status: "Operational",
    color: "#F0B90B",
    icon: "/assets/bnb.png",
  },
  {
    name: "Ethereum",
    tps: "30+ TPS",
    avgFee: "Dynamic Gas",
    blockTime: "12s",
    status: "Operational",
    color: "#627EEA",
    icon: "/assets/eth.png",
  },
  {
    name: "Polygon PoS",
    tps: "7,000 TPS",
    avgFee: "$0.005",
    blockTime: "2s",
    status: "Operational",
    color: "#8247E5",
    icon: "/assets/pol.png",
  },
  {
    name: "TON Blockchain",
    tps: "100,000+ TPS",
    avgFee: "$0.002",
    blockTime: "5s",
    status: "Operational",
    color: "#0098EA",
    icon: "/assets/ton.png",
  },
  {
    name: "Bitcoin Core",
    tps: "7 TPS",
    avgFee: "On-Chain Fee",
    blockTime: "10m",
    status: "Operational",
    color: "#F7931A",
    icon: "/assets/btc.png",
  },
  {
    name: "Base Network",
    tps: "4,000 TPS",
    avgFee: "$0.001",
    blockTime: "2s",
    status: "Operational",
    color: "#0052FF",
    icon: "/assets/base.png",
  },
];

const faqs = [
  {
    q: "How do non-custodial payments work with CosMos Pay?",
    a: "Unlike custodial processors like BitPay or Stripe where funds are held in third-party bank accounts, CosMos Pay generates dynamic on-chain deposit addresses linked straight to your merchant wallet. Payments go directly from the payer to your private keys.",
  },
  {
    q: "What fees does CosMos Pay charge merchants?",
    a: "Zero percent (0.0%). We charge no merchant transaction fees, no setup fees, and no monthly subscriptions. The network gas fee is covered by the customer during transaction broadcast.",
  },
  {
    q: "How fast are payments confirmed?",
    a: "On networks like Solana, BSC, TRON, and Polygon, transactions are confirmed and finalized within 400ms to 3 seconds. Instant webhooks notify your backend immediately.",
  },
  {
    q: "Can I integrate CosMos Pay with my existing e-commerce or custom stack?",
    a: "Yes! We offer a full REST API, Webhooks with HMAC SHA-256 signatures, TypeScript / Node.js SDK, Python SDK, and React drop-in components. Integration takes less than 15 minutes.",
  },
];

function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="relative min-h-screen bg-[#060813] text-foreground selection:bg-primary/40 selection:text-white">
      <ScrollProgressBar />
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════════
          HERO SECTION (Aurora Background + Glass Cards + Fluid Lighting)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Soft Fluid Aurora Ambient Lighting */}
        <AuroraBackground />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Top Live Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-[#121025]/90 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-lg shadow-primary/10 transition-transform hover:scale-105 cursor-default">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-80" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span>Next-Gen Multi-Chain Crypto Gateway</span>
            <span className="text-white/30">•</span>
            <span className="text-foreground/80 font-medium">Instant Non-Custodial Settlement</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.02] text-white">
            Accept Crypto
            <span className="block gradient-text mt-2">Without Middlemen</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            The self-hosted, non-custodial payment infrastructure for global merchants.
            Accept <span className="font-semibold text-white">USDT, USDC, BTC, ETH, SOL, TON</span> across
            <span className="font-semibold text-white"> 7+ networks</span> with <span className="text-success font-semibold">0% fees</span> and sub-second settlement.
          </p>

          {/* Interactive Floating Token Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 max-w-2xl mx-auto">
            {tokens.map((t, idx) => (
              <div
                key={t.symbol}
                className="group flex items-center gap-2 rounded-2xl border border-border/50 bg-[#110f22]/80 px-3.5 py-2 backdrop-blur-md transition-all duration-300 hover:scale-108 hover:border-primary/60 hover:bg-primary/15 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <img src={t.img} alt={t.symbol} className="size-5 object-contain transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold text-white">{t.symbol}</span>
                <span className="text-[10px] font-mono text-success font-semibold">{t.change}</span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-primary/50 active:scale-95 cursor-pointer"
            >
              <Sparkles className="size-4" />
              <span>Try Live Checkout Demo</span>
              <ArrowRight className="size-4" />
            </a>

            <Link
              to="/admin"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-[#121020]/80 px-7 py-4 text-sm font-bold text-white backdrop-blur-md hover:border-primary/50 hover:bg-primary/15 transition-all duration-200 cursor-pointer"
            >
              <Cpu className="size-4 text-primary" />
              <span>Merchant Admin Portal</span>
            </Link>

            <Link
              to="/pay"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-success/40 bg-success/10 px-7 py-4 text-sm font-bold text-success backdrop-blur-md hover:bg-success/20 transition-all duration-200 cursor-pointer"
            >
              <Receipt className="size-4" />
              <span>Live Pay Link</span>
            </Link>
          </div>

          {/* Real-Time Live Network Counters */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto border-t border-border/40 pt-10">
            {[
              { label: "Supported Blockchains", value: "7+ Chains", sub: "EVM, Solana, TON" },
              { label: "Merchant Commission", value: "0.0%", sub: "100% Free Gateway" },
              { label: "Settlement Speed", value: "< 1s", sub: "Instant On-Chain" },
              { label: "Custody Architecture", value: "100%", sub: "Non-Custodial" },
            ].map((stat) => (
              <div key={stat.label} className="p-3 text-center">
                <p className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold text-primary mt-1">{stat.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#060813] to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          LIVE MULTI-CHAIN TOKEN TICKER MARQUEE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-6 border-y border-border/40 bg-[#0a0918]/60 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#060813] via-transparent to-[#060813] z-10" />
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {[...tokens, ...tokens, ...tokens].map((coin, i) => (
            <div
              key={`${coin.symbol}-${i}`}
              className="mx-4 flex items-center gap-3 rounded-2xl border border-border/40 bg-[#121025]/70 px-5 py-2.5 backdrop-blur-md transition-all hover:border-primary/40 hover:scale-105 cursor-pointer"
            >
              <img src={coin.img} alt={coin.symbol} className="size-6 object-contain" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{coin.symbol}</span>
                  <span className="font-mono text-xs text-foreground/80">{coin.price}</span>
                </div>
                <span className="text-[10px] font-mono text-success font-semibold">{coin.change}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          LIVE INTERACTIVE CHECKOUT DEMO
      ══════════════════════════════════════════════════════════════════ */}
      <section id="demo" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="scale">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Hands-On Simulation
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              Test The Checkout Engine Live
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Simulate creating a dynamic payment invoice, broadcasting a transaction, and receiving an instant on-chain settlement receipt.
            </p>
          </div>

          <InteractivePaymentDemo />
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BENTO GRID FEATURES (21st.dev + UI-UX Pro Max Style)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Layers className="size-3.5" />
                Cutting-Edge Capabilities
              </span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
                Engineered for <span className="gradient-text">Absolute Freedom</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                Built from the ground up for high-volume merchants, SaaS platforms, and Web3 apps needing friction-free crypto payments.
              </p>
            </div>
          </ScrollReveal>

          {/* Bento Grid Layout */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* Feature 1: Non-Custodial */}
            <ScrollReveal direction="up" className="md:col-span-8">
              <SpotlightCard className="h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/30 mb-6">
                      <Lock className="size-7" />
                    </div>
                    <span className="text-xs font-bold font-mono text-primary uppercase tracking-wider">
                      Zero Counterparty Risk
                    </span>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
                      100% Non-Custodial Architecture
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                      Your keys, your crypto. CosMos Pay routes incoming transactions directly into your private addresses without holding, freezing, or delaying your earnings. No third-party account holds ever.
                    </p>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border/40 pt-6">
                    <div className="rounded-xl bg-surface/30 p-3 border border-border/30">
                      <p className="text-xs font-bold text-white">Direct Payouts</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Straight to cold storage</p>
                    </div>
                    <div className="rounded-xl bg-surface/30 p-3 border border-border/30">
                      <p className="text-xs font-bold text-white">0% Holdback</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">No rolling reserves</p>
                    </div>
                    <div className="rounded-xl bg-surface/30 p-3 border border-border/30">
                      <p className="text-xs font-bold text-white">Immunity</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Zero account freezing</p>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Feature 2: Sub-Second Settlement */}
            <ScrollReveal direction="up" delay={150} className="md:col-span-4">
              <SpotlightCard className="h-full">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-success/15 text-success border border-success/30 mb-6">
                  <Zap className="size-7" />
                </div>
                <span className="text-xs font-bold font-mono text-success uppercase tracking-wider">
                  Real-Time On-Chain
                </span>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-white">
                  Sub-Second Settlement
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Real-time mempool scanning and zero-knowledge confirmation listeners detect and verify payments in milliseconds across high-speed chains.
                </p>
                <div className="mt-6 rounded-2xl bg-success/10 border border-success/30 p-3 text-center">
                  <span className="text-2xl font-black font-mono text-success">&lt; 400ms</span>
                  <span className="text-[11px] text-muted-foreground block">Solana & L2 Finality</span>
                </div>
              </SpotlightCard>
            </ScrollReveal>

            {/* Feature 3: Zero Commission */}
            <ScrollReveal direction="up" delay={100} className="md:col-span-4">
              <SpotlightCard className="h-full">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-warning/15 text-warning border border-warning/30 mb-6">
                  <DollarSign className="size-7" />
                </div>
                <span className="text-xs font-bold font-mono text-warning uppercase tracking-wider">
                  Transparent Pricing
                </span>
                <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-white">
                  0% Merchant Processing
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Never pay 2.9% + $0.30 to credit card processors or 1% to custodial crypto gateways. 100% of the customer payment reaches your wallet.
                </p>
              </SpotlightCard>
            </ScrollReveal>

            {/* Feature 4: Real-Time Webhooks & Analytics */}
            <ScrollReveal direction="up" delay={200} className="md:col-span-8">
              <SpotlightCard className="h-full">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-info/15 text-info border border-info/30 mb-6">
                      <TrendingUp className="size-7" />
                    </div>
                    <span className="text-xs font-bold font-mono text-info uppercase tracking-wider">
                      Automated Workflows
                    </span>
                    <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
                      Instant Webhook Engine & Analytics
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                      Automate order fulfillment with cryptographically signed HMAC webhooks. Track conversion funnels, volume by token, and transaction throughput in your real-time admin dashboard.
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {["HMAC SHA-256 Signatures", "Auto-Retry Pipeline", "Custom Metadata Payloads", "Discord & Telegram Alerts"].map(
                      (tag) => (
                        <span key={tag} className="rounded-lg border border-border/60 bg-surface/30 px-3 py-1 text-xs font-medium text-foreground/80">
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          MULTI-CHAIN ECOSYSTEM EXPLORER
      ══════════════════════════════════════════════════════════════════ */}
      <section id="networks" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 bg-[#080718]/60 border-y border-border/40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3.5 py-1 text-xs font-semibold text-success">
                <Globe2 className="size-3.5" />
                Interoperability
              </span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
                7+ Blockchains. <span className="gradient-text">One Unified Gateway.</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                No need to manage 7 different wallet nodes or API integrations. CosMos Pay aggregates all major networks seamlessly.
              </p>
            </div>
          </ScrollReveal>

          {/* Networks Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {networks.map((net) => (
              <SpotlightCard key={net.name} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex size-12 items-center justify-center rounded-2xl p-2.5"
                      style={{
                        background: `${net.color}18`,
                        border: `1px solid ${net.color}35`,
                      }}
                    >
                      <img src={net.icon} alt={net.name} className="size-full object-contain" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-success/10 px-2.5 py-0.5 rounded-full border border-success/20">
                      <span className="size-1.5 rounded-full bg-success animate-ping" />
                      {net.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{net.name}</h3>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Throughput:</span>
                      <span className="font-mono font-semibold text-foreground">{net.tps}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Avg Fee:</span>
                      <span className="font-mono font-semibold text-success">{net.avgFee}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Finality:</span>
                      <span className="font-mono font-semibold text-info">{net.blockTime}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Zero Merchant Gas</span>
                  <CheckCircle2 className="size-3.5 text-success" />
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TRANSACTION WORKFLOW PIPELINE (4-Step Animated Journey)
      ══════════════════════════════════════════════════════════════════ */}
      <section id="process" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal direction="up">
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Cpu className="size-3.5" />
                Streamlined Protocol
              </span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
                How It <span className="gradient-text">Works</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                From checkout initiation to final wallet receipt in 4 automated steps.
              </p>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Center Laser Connecting Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-info to-success hidden md:block -translate-x-1/2 shadow-[0_0_12px_rgba(124,58,237,0.8)]" />

            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Dynamic Invoice Generation",
                  desc: "Merchant app or website calls CosMos Pay API. A unique one-time blockchain deposit address is generated with locked real-time exchange rates.",
                  color: "#8B5CF6",
                },
                {
                  step: "02",
                  title: "1-Click Customer Payment",
                  desc: "Customer scans the QR code or connects any Web3 wallet (MetaMask, Phantom, Tonkeeper, Trust Wallet) and signs the transaction.",
                  color: "#38BDF8",
                },
                {
                  step: "03",
                  title: "On-Chain Zero-Knowledge Proof",
                  desc: "CosMos Pay high-throughput nodes capture the mempool broadcast and verify cryptographic block confirmations across the target chain.",
                  color: "#10B981",
                },
                {
                  step: "04",
                  title: "Instant Wallet Credit & Webhook",
                  desc: "100% of the funds are deposited directly to your private cold/hot wallet. Webhooks fire instantly to unlock customer order access.",
                  color: "#F59E0B",
                },
              ].map((item, idx) => (
                <ScrollReveal key={item.step} direction={idx % 2 === 0 ? "left" : "right"}>
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                    <div className="flex-1 w-full text-center md:text-left">
                      <div className="rounded-3xl border border-border/50 bg-[#0d0c1d]/90 p-8 backdrop-blur-xl hover:border-primary/40 transition-colors shadow-xl">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                          <span
                            className="flex size-9 items-center justify-center rounded-xl text-xs font-black font-mono text-white"
                            style={{ background: item.color }}
                          >
                            {item.step}
                          </span>
                          <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    {/* Center glowing node */}
                    <div className="hidden md:flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-[#060813] shadow-lg z-10">
                      <div className="size-4 rounded-full" style={{ background: item.color }} />
                    </div>

                    <div className="flex-1 hidden md:block" />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          COMPARISON MATRIX SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="compare" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="scale">
          <ComparisonMatrix />
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          DEVELOPER API SANDBOX
      ══════════════════════════════════════════════════════════════════ */}
      <section id="developers" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 bg-[#070617]/70 border-y border-border/40">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-info/30 bg-info/10 px-3.5 py-1 text-xs font-semibold text-info">
              <Code className="size-3.5" />
              Built For Builders
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
              Integrate in <span className="gradient-text">&lt; 15 Minutes</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Clean SDKs, robust webhooks, and predictable RESTful endpoints designed for high developer productivity.
            </p>
          </div>

          <DeveloperApiSandbox />
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FAQ ACCORDION SECTION
      ══════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                Frequently Asked
              </span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black text-white tracking-tight">
                Got Questions?
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-border/50 bg-[#0d0c1d]/80 backdrop-blur-xl overflow-hidden transition-colors hover:border-primary/40"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                  >
                    <span className="text-base font-bold text-white pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`size-5 text-primary shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HIGH-CONVERSION GLASS CTA BANNER
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-28 px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="scale">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-primary/40 bg-gradient-to-br from-[#15122e] via-[#0d0b20] to-[#080718] p-10 sm:p-16 text-center backdrop-blur-2xl shadow-2xl shadow-primary/20">
            {/* Inner Glow Orbs */}
            <div className="pointer-events-none absolute -top-32 -left-32 size-[400px] rounded-full bg-primary/20 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 size-[350px] rounded-full bg-success/15 blur-[100px]" />

            <div className="relative z-10">
              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent text-white shadow-xl shadow-primary/30 mb-8">
                <ShieldCheck className="size-8" />
              </div>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
                Ready to Upgrade Your
                <span className="block gradient-text mt-2">Payment Infrastructure?</span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
                Join modern businesses collecting crypto payments with zero fees and instant non-custodial settlements.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent px-10 py-4 text-base font-extrabold text-white shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-primary/50 active:scale-95 cursor-pointer"
                >
                  <span>Launch Merchant Portal</span>
                  <ArrowRight className="size-5" />
                </Link>

                <Link
                  to="/pay"
                  className="inline-flex items-center gap-2 rounded-2xl border border-primary/40 bg-[#151329]/80 px-8 py-4 text-base font-bold text-white backdrop-blur-md hover:bg-primary/20 transition-all duration-200 cursor-pointer"
                >
                  <span>Test Checkout Gateway</span>
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-success" /> Non-Custodial
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-success" /> 0% Transaction Fees
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-success" /> 7+ Chains Live
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FUTURISTIC WEB3 FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <footer className="relative border-t border-border/40 bg-[#04050d] px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Col 1: Brand & Status */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <ellipse cx="12" cy="12" rx="4" ry="10" strokeWidth="1.8" />
                    <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" />
                  </svg>
                </div>
                <span className="text-xl font-black text-white">CosMos Pay</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                The next-generation, non-custodial crypto payment gateway for global commerce. Instant settlement, multi-chain support, and zero merchant commissions.
              </p>
              <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success w-max">
                <span className="size-2 rounded-full bg-success animate-ping" />
                All Systems Operational (99.99%)
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-4">Platform</p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a></li>
                <li><a href="#networks" className="hover:text-white transition-colors cursor-pointer">Supported Chains</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors cursor-pointer">Live Demo</a></li>
                <li><a href="#process" className="hover:text-white transition-colors cursor-pointer">Workflow</a></li>
                <li><a href="#compare" className="hover:text-white transition-colors cursor-pointer">Comparison</a></li>
              </ul>
            </div>

            {/* Col 3: Portal Links */}
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-4">Portals</p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><Link to="/pay" className="hover:text-white transition-colors cursor-pointer">Checkout Gateway</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors cursor-pointer">Merchant Dashboard</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors cursor-pointer">Admin Sign In</Link></li>
                <li><a href="#developers" className="hover:text-white transition-colors cursor-pointer">API Docs</a></li>
              </ul>
            </div>

            {/* Col 4: Networks */}
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-4">Chains</p>
              <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                {networks.slice(0, 5).map((n) => (
                  <li key={n.name} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full" style={{ background: n.color }} />
                    {n.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground">
            <p>© 2026 CosMos Pay. Built for non-custodial global crypto commerce.</p>
            <div className="flex items-center gap-4">
              <span className="text-foreground/80 font-mono">Status: Mainnet Live</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
