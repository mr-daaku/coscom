import { Check, X, Shield, Zap, Lock, DollarSign } from "lucide-react";

export default function ComparisonMatrix() {
  const comparisons = [
    {
      feature: "Merchant Processing Fee",
      cosmos: "0.0% (Zero Fee)",
      stripe: "2.9% + $0.30 / tx",
      custodial: "1.0% - 1.5%",
      highlight: true,
    },
    {
      feature: "Settlement Speed",
      cosmos: "Instant (< 1 Second)",
      stripe: "2 - 7 Business Days",
      custodial: "Daily / Weekly Batch",
      highlight: true,
    },
    {
      feature: "Fund Custody & Control",
      cosmos: "100% Non-Custodial",
      stripe: "Frozen Account Risk",
      custodial: "Third-Party Held",
      highlight: true,
    },
    {
      feature: "Chargeback & Fraud Risk",
      cosmos: "0% (Mathematically Zero)",
      stripe: "High Chargeback Risk",
      custodial: "Low",
      highlight: false,
    },
    {
      feature: "Multi-Chain Support",
      cosmos: "7+ Chains (EVM, Solana, TON)",
      stripe: "None / Restricted",
      custodial: "1-2 Chains Only",
      highlight: false,
    },
    {
      feature: "Customer Friction & KYC",
      cosmos: "Zero KYC, 1-Click Pay",
      stripe: "Card, Billing & 3DS",
      custodial: "Account Verification",
      highlight: false,
    },
  ];

  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-primary/20 bg-[#0d0c1d]/80 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Zap className="size-3.5" />
          The Unfair Advantage
        </span>
        <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Why Merchants Choose <span className="gradient-text">CosMos Pay</span>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
          Eliminate processor middlemen, prevent predatory chargebacks, and receive crypto directly into your private wallet.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="pb-4 pt-2 font-semibold">Feature / Metric</th>
              <th className="pb-4 pt-2 font-bold text-primary">
                <div className="flex items-center gap-2">
                  <span className="flex size-2 rounded-full bg-success animate-ping" />
                  <span>CosMos Pay</span>
                </div>
              </th>
              <th className="pb-4 pt-2 font-semibold">Stripe / PayPal</th>
              <th className="pb-4 pt-2 font-semibold">BitPay / Custodial</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-sm">
            {comparisons.map((item, idx) => (
              <tr
                key={item.feature}
                className={`transition-colors hover:bg-white/[0.02] ${
                  item.highlight ? "bg-primary/[0.04]" : ""
                }`}
              >
                <td className="py-4 font-medium text-foreground pr-4">
                  {item.feature}
                </td>
                <td className="py-4 font-bold text-success font-mono">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-success shrink-0" />
                    <span>{item.cosmos}</span>
                  </div>
                </td>
                <td className="py-4 text-muted-foreground font-mono">
                  <div className="flex items-center gap-2">
                    <X className="size-4 text-destructive shrink-0" />
                    <span>{item.stripe}</span>
                  </div>
                </td>
                <td className="py-4 text-muted-foreground font-mono">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-warning shrink-0" />
                    <span>{item.custodial}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Trust Badges Bar */}
      <div className="mt-10 grid grid-cols-2 gap-4 border-t border-border/40 pt-8 sm:grid-cols-4">
        {[
          { icon: <Lock className="size-4 text-primary" />, title: "Self-Custodial", desc: "Your Keys, Your Coins" },
          { icon: <Zap className="size-4 text-success" />, title: "Sub-Second", desc: "Instant Confirmation" },
          { icon: <Shield className="size-4 text-info" />, title: "Zero Gas For Merchants", desc: "Payer covers network fee" },
          { icon: <DollarSign className="size-4 text-warning" />, title: "0% Commission", desc: "Transparent & Free" },
        ].map((badge) => (
          <div key={badge.title} className="flex flex-col items-center text-center p-3 rounded-2xl bg-surface/20 border border-border/30">
            <div className="mb-2 p-2 rounded-xl bg-card border border-border/50">{badge.icon}</div>
            <p className="text-xs font-bold text-white">{badge.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
