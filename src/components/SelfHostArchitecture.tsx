import { Server, Globe, Smartphone, Lock, ArrowRight, ShieldCheck, Database, Cpu } from "lucide-react";

export default function SelfHostArchitecture() {
  return (
    <div className="relative mx-auto max-w-5xl rounded-3xl border border-white/[0.08] bg-[#0c0b1e]/80 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-400">
          <Cpu className="size-3.5" />
          Data Sovereignty & Direct Settlement
        </span>
        <h3 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          How Self-Hosted Architecture Works
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          No external middleman servers. You deploy the gateway on your own cloud or VPS, and funds route straight from payers to your private addresses.
        </p>
      </div>

      {/* 4-Node Interactive Architecture Flow */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 relative">
        {/* Node 1: Your Apps */}
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/[0.08] bg-[#121025] relative group hover:border-primary/50 transition-colors">
          <div className="size-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mb-4 shadow-lg">
            <Smartphone className="size-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">Step 1</span>
          <h4 className="text-base font-bold text-white mt-1">Your App / Website</h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Calls your self-hosted API or embeds our React SDK checkout widget.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-foreground/80 bg-white/5 px-2.5 py-1 rounded-lg">
            <code>POST /api/invoices</code>
          </div>
        </div>

        {/* Node 2: Your Self-Hosted Gateway */}
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-primary/40 bg-gradient-to-b from-primary/15 to-[#121025] relative group shadow-xl shadow-primary/10">
          <div className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Server className="size-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Step 2 (Self-Hosted)</span>
          <h4 className="text-base font-bold text-white mt-1">Your CosMos Node</h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Generates on-chain deposit addresses and monitors mempools via WebSocket.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <span>Runs On Your Server</span>
          </div>
        </div>

        {/* Node 3: Blockchain RPCs */}
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/[0.08] bg-[#121025] relative group hover:border-cyan-500/50 transition-colors">
          <div className="size-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg">
            <Globe className="size-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">Step 3</span>
          <h4 className="text-base font-bold text-white mt-1">7+ Blockchains</h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Customer pays via Solana, EVM, TRON, or TON. Block is cryptographically verified.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-foreground/80 bg-white/5 px-2.5 py-1 rounded-lg">
            <span>ZK Block Finality</span>
          </div>
        </div>

        {/* Node 4: Your Private Wallet */}
        <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-emerald-500/30 bg-[#121025] relative group hover:border-emerald-500/60 transition-colors">
          <div className="size-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg">
            <Lock className="size-7" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Step 4</span>
          <h4 className="text-base font-bold text-white mt-1">Your Wallet</h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            100% of customer funds land directly in your cold/hot wallet. 0% middleman fees.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <span>Direct Deposit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
