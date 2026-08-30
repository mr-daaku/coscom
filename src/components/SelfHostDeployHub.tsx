import { useState } from "react";
import { Copy, Check, Terminal, Server, Container, Cloud, Cpu, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function SelfHostDeployHub() {
  const [activeTab, setActiveTab] = useState<"docker" | "railway" | "vps" | "env">("docker");
  const [copied, setCopied] = useState(false);

  const snippets = {
    docker: `# 1. Clone the repository
git clone https://github.com/mr-daaku/coscom.git
cd coscom

# 2. Configure your private merchant wallet in .env
cp .env.example .env

# 3. Spin up the self-hosted gateway with Docker Compose
docker compose up -d

# Your self-hosted gateway is live at http://localhost:8080
# Admin panel accessible with your ADMIN_SECRET key!`,

    railway: `# Deploy to Railway in 1-Click
# 1. Click "Deploy on Railway" below or run the Railway CLI:
railway login
railway init
railway up

# 2. Set your environment variables:
railway variables set MERCHANT_WALLET_SOL="YourSolanaAddress"
railway variables set MERCHANT_WALLET_EVM="0xYourEthAddress"
railway variables set ADMIN_SECRET="super-secret-password-123"`,

    vps: `# Ubuntu / Debian VPS Deployment
sudo apt update && sudo apt install -y git nodejs npm curl

# Clone & Install dependencies
git clone https://github.com/mr-daaku/coscom.git
cd coscom
npm install

# Build production Nitro SSR server
npm run build

# Run with PM2 for 24/7 uptime & auto-restart
npm install -g pm2
pm2 start npm --name "cosmos-gateway" -- run preview`,

    env: `# Environment Configuration (.env)
PORT=8080
NODE_ENV=production
ADMIN_SECRET=your_ultra_secure_password

# Direct Non-Custodial Merchant Addresses (Where payments land)
MERCHANT_WALLET_EVM=0x71C...B2901aF9
MERCHANT_WALLET_SOL=So11111111111111111111111111111111111111112
MERCHANT_WALLET_TRON=TXw8Q6Z8V2b...3K9pLm1
MERCHANT_WALLET_TON=EQBvW8Z5hu...0D5fE3L

# Custom / Dedicated RPC Endpoints (Optional, defaults to public nodes)
RPC_ETHEREUM=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
RPC_SOLANA=https://api.mainnet-beta.solana.com`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto max-w-5xl rounded-3xl border border-primary/25 bg-[#090815] p-6 sm:p-10 backdrop-blur-2xl shadow-2xl shadow-primary/15">
      {/* Glow Orbs */}
      <div className="pointer-events-none absolute -top-20 -left-20 size-[300px] rounded-full bg-primary/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 size-[300px] rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <Server className="size-3.5" />
            100% Self-Hosted & Non-Custodial
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Deploy In Under 60 Seconds
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Run CosMos Pay on your own servers with zero middlemen, zero telemetry, and 100% data sovereignty.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 rounded-2xl bg-black/50 p-1.5 border border-border/50 self-start sm:self-auto">
          {[
            { id: "docker", label: "Docker Compose", icon: Container },
            { id: "railway", label: "Railway", icon: Cloud },
            { id: "vps", label: "Linux VPS", icon: Cpu },
            { id: "env", label: ".env Config", icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Container */}
      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#05040d] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0d0c1e] px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Terminal className="size-3.5 text-primary" />
            <span>
              {activeTab === "docker"
                ? "docker-deploy.sh"
                : activeTab === "railway"
                ? "railway-cli.sh"
                : activeTab === "vps"
                ? "vps-setup.sh"
                : ".env.production"}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-surface/30 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-white hover:border-primary/40 transition-colors"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-success" />
                <span className="text-success">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy Instructions</span>
              </>
            )}
          </button>
        </div>

        <pre className="overflow-x-auto p-5 text-xs sm:text-sm font-mono text-foreground/90 leading-relaxed">
          <code>{snippets[activeTab]}</code>
        </pre>
      </div>

      {/* Self-Hosting Benefits Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3 pt-6 border-t border-border/40">
        <div className="flex items-start gap-3 rounded-2xl bg-surface/20 border border-border/30 p-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Private Keys Stay Yours</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              No private keys or mnemonic phrases are ever uploaded to any third party.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-surface/20 border border-border/30 p-4">
          <div className="p-2 rounded-xl bg-success/10 text-success border border-success/20 shrink-0">
            <Zap className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Zero Platform Fees</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              Keep 100% of your checkout revenue. No monthly fee or commission cuts.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-surface/20 border border-border/30 p-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <Server className="size-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Infinite Customizability</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              Customize checkout themes, add internal RPCs, and hook custom webhooks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
