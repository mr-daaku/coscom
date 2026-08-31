import { useState } from "react";
import { cn } from "@/lib/utils";

export type PageKey =
  | "dashboard"
  | "payments-all"
  | "payments-pending"
  | "payments-completed"
  | "payments-underpaid"
  | "payments-expired"
  | "invoices-all"
  | "invoices-create"
  | "transactions"
  | "wallets"
  | "tokens"
  | "networks"
  | "monitor"
  | "analytics"
  | "notifications"
  | "settings"
  | "audit-logs";

type Item = {
  key?: PageKey;
  icon: string;
  label: string;
  badge?: number;
  children?: { key: PageKey; label: string; badge?: number }[];
};

type Section = { label: string; items: Item[] };

export const sections: Section[] = [
  {
    label: "Main",
    items: [
      { key: "dashboard", icon: "🏠", label: "Dashboard" },
      {
        icon: "💳",
        label: "Payments",
        children: [
          { key: "payments-all", label: "All Payments" },
          { key: "payments-pending", label: "Pending", badge: 4 },
          { key: "payments-completed", label: "Completed" },
          { key: "payments-underpaid", label: "Underpaid" },
          { key: "payments-expired", label: "Expired" },
        ],
      },
      {
        icon: "🧾",
        label: "Invoices",
        children: [
          { key: "invoices-all", label: "All Invoices" },
          { key: "invoices-create", label: "Create Invoice" },
        ],
      },
      { key: "transactions", icon: "🔗", label: "Transactions" },
      { key: "wallets", icon: "👛", label: "Wallets" },
      { key: "tokens", icon: "🪙", label: "Tokens" },
      { key: "networks", icon: "🌐", label: "Networks" },
    ],
  },
  {
    label: "Reports",
    items: [
      { key: "monitor", icon: "📡", label: "Payment Monitor", badge: 2 },
      { key: "analytics", icon: "📊", label: "Analytics" },
      { key: "notifications", icon: "🔔", label: "Notifications", badge: 7 },
    ],
  },
  {
    label: "System",
    items: [
      { key: "settings", icon: "⚙️", label: "Settings" },
      {
        icon: "🔐",
        label: "Security",
        children: [{ key: "audit-logs", label: "Audit Logs" }],
      },
    ],
  },
];

export const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Live overview of your crypto payment gateway" },
  "payments-all": { title: "All Payments", subtitle: "Every payment across all networks" },
  "payments-pending": { title: "Pending Payments", subtitle: "Awaiting on-chain confirmation" },
  "payments-completed": { title: "Completed Payments", subtitle: "Fully settled payments" },
  "payments-underpaid": { title: "Underpaid Payments", subtitle: "Below expected amount" },
  "payments-expired": { title: "Expired Payments", subtitle: "Payment windows that lapsed" },
  "invoices-all": { title: "All Invoices", subtitle: "Issued payment requests" },
  "invoices-create": { title: "Create Invoice", subtitle: "Generate a new crypto payment request" },
  transactions: { title: "Transactions", subtitle: "Raw on-chain transaction feed" },
  wallets: { title: "Wallets", subtitle: "Receiving wallets per network" },
  tokens: { title: "Tokens", subtitle: "Accepted tokens and contracts" },
  networks: { title: "Networks", subtitle: "Chain configuration and health" },
  monitor: { title: "Payment Monitor", subtitle: "Real-time payment watcher" },
  analytics: { title: "Analytics", subtitle: "Revenue and conversion insights" },
  notifications: { title: "Notifications", subtitle: "Gateway events and alerts" },
  settings: { title: "Settings", subtitle: "Gateway configuration and webhooks" },
  "audit-logs": { title: "Audit Logs", subtitle: "Admin activity trail" },
};

export function Sidebar({
  active,
  onNavigate,
  open,
  onClose,
  username,
  role,
}: {
  active: PageKey;
  onNavigate: (key: PageKey) => void;
  open: boolean;
  onClose: () => void;
  username: string;
  role: string;
}) {
  const [expanded, setExpanded] = useState<string[]>(["Payments"]);

  const toggle = (label: string) =>
    setExpanded((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );

  return (
    <>
      {open ? (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/70 lg:hidden"
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-border bg-sidebar transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="glow-line pointer-events-none absolute inset-y-0 left-0 w-px" />

        <div className="flex items-center gap-3 px-5 py-4">
          <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-lg">💎</span>
          <div>
            <p className="text-sm font-semibold">CosComPay</p>
            <p className="text-[11px] text-muted-foreground">Payment Gateway</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {sections.map((section) => (
            <div key={section.label} className="mb-4">
              <p className="px-3 py-2 text-[10px] font-semibold tracking-widest text-subtle uppercase">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isOpen = expanded.includes(item.label);
                  const childActive = item.children?.some((c) => c.key === active);
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => (item.children ? toggle(item.label) : onNavigate(item.key!))}
                        className={cn(
                          "relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                          item.key === active || childActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-surface/60 hover:text-foreground",
                        )}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge ? (
                          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                            {item.badge}
                          </span>
                        ) : null}
                        {item.children ? (
                          <span
                            className={cn(
                              "text-[10px] transition-transform duration-200",
                              isOpen && "rotate-90",
                            )}
                          >
                            ▶
                          </span>
                        ) : null}
                        {item.key === active ? (
                          <span className="absolute top-1/2 right-0 h-5 w-[3px] -translate-y-1/2 rounded-l bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
                        ) : null}
                      </button>

                      {item.children && isOpen ? (
                        <ul className="mt-0.5 ml-6 space-y-0.5 border-l border-border pl-3">
                          {item.children.map((child) => (
                            <li key={child.key}>
                              <button
                                onClick={() => onNavigate(child.key)}
                                className={cn(
                                  "relative flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[13px] transition-all duration-200",
                                  child.key === active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground",
                                )}
                              >
                                <span className="flex-1 text-left">{child.label}</span>
                                {child.badge ? (
                                  <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] text-warning">
                                    {child.badge}
                                  </span>
                                ) : null}
                                {child.key === active ? (
                                  <span className="absolute top-1/2 right-0 h-4 w-[3px] -translate-y-1/2 rounded-l bg-primary shadow-[0_0_10px_2px_var(--primary)]" />
                                ) : null}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3 border-t border-border px-5 py-4">
          <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-success text-sm font-semibold text-primary-foreground">
            {username.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{username}</p>
            <p className="text-[11px] text-muted-foreground">{role}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
