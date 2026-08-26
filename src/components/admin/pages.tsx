import { useMemo, useState } from "react";
import {
  ActionButton,
  Badge,
  Field,
  Panel,
  ProgressBar,
  StatCard,
  StatusBadge,
  Table,
  Td,
  inputClass,
  statusTone,
  type Tone,
} from "./primitives";
import * as data from "@/lib/mockData";

/* ---------------- Dashboard ---------------- */

export function Dashboard({ onCreateInvoice }: { onCreateInvoice: () => void }) {
  const [range, setRange] = useState<"7D" | "30D" | "90D">("7D");
  const [bars, setBars] = useState<number[]>(data.revenueSeries["7D"]!);

  const pick = (r: "7D" | "30D" | "90D") => {
    setRange(r);
    setBars(data.revenueSeries[r]!.map((b) => Math.max(18, Math.round(b * (0.6 + Math.random())))));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ActionButton onClick={onCreateInvoice}>＋ New Invoice</ActionButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="p-5 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Revenue</h3>
            <div className="flex gap-1 rounded-lg border border-border p-1">
              {(["7D", "30D", "90D"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => pick(r)}
                  className={`rounded-md px-2.5 py-1 text-[11px] transition-all duration-200 ${
                    range === r ? "bg-primary/15 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex h-48 items-end gap-3">
            {bars.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-primary/25 to-primary transition-all duration-200"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{data.weekDays[i]}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel tone="success" className="p-5">
          <h3 className="mb-5 text-sm font-semibold">Recent Activity</h3>
          <ol className="relative space-y-5 border-l border-border pl-5">
            {data.activity.map((a) => (
              <li key={a.title + a.time} className="relative">
                <span
                  className="absolute top-1.5 -left-[26px] size-2.5 rounded-full"
                  style={{ background: `var(--${a.tone === "danger" ? "destructive" : a.tone})` }}
                />
                <p className="text-sm font-medium">{a.title}</p>
                <p className="mono mt-0.5 text-[11px] text-muted-foreground">{a.detail}</p>
                <p className="mt-1 text-[10px] text-subtle">{a.time}</p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel tone="info" className="p-5">
          <h3 className="mb-5 text-sm font-semibold">Network Health</h3>
          <div className="space-y-4">
            {data.networkHealth.map((n) => (
              <div key={n.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span>{n.name}</span>
                  <span className="mono text-muted-foreground">
                    {n.value}% · {n.status}
                  </span>
                </div>
                <ProgressBar value={n.value} tone={n.value > 90 ? "success" : "warning"} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel tone="warning" className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Wallet Balances</h3>
          <Table head={["Token", "Balance", "USD Value", "Status"]}>
            {data.walletBalances.map((w) => (
              <tr key={w.token}>
                <Td className="mono">{w.token}</Td>
                <Td className="mono">{w.balance}</Td>
                <Td className="mono text-muted-foreground">{w.usd}</Td>
                <Td>
                  <StatusBadge status={w.status} />
                </Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- Payments ---------------- */

export function Payments({ filter }: { filter?: data.Status }) {
  const [q, setQ] = useState("");
  const [network, setNetwork] = useState("all");
  const [status, setStatus] = useState<string>(filter ?? "all");

  const rows = useMemo(
    () =>
      data.payments.filter(
        (p) =>
          (filter ? p.status === filter : true) &&
          (status === "all" || p.status === status) &&
          (network === "all" || p.network === network) &&
          (q === "" ||
            `${p.id} ${p.invoice} ${p.from}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, network, status, filter],
  );

  return (
    <Panel className="p-5">
      <div className="mb-5 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search payment, invoice or address"
          className={`${inputClass} sm:max-w-xs`}
        />
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className={`${inputClass} sm:w-40`}
        >
          <option value="all">All networks</option>
          {["Ethereum", "BSC", "TON", "Tron"].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        {!filter ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`${inputClass} sm:w-40`}
          >
            <option value="all">All statuses</option>
            {["completed", "pending", "underpaid", "expired"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <Table
        head={[
          "Payment ID",
          "Invoice",
          "Amount",
          "Token",
          "Network",
          "From",
          "Time",
          "Status",
        ]}
      >
        {rows.map((p) => (
          <tr key={p.id}>
            <Td className="mono text-primary">{p.id}</Td>
            <Td className="mono">{p.invoice}</Td>
            <Td className="mono">{p.amount}</Td>
            <Td className="mono">{p.token}</Td>
            <Td>{p.network}</Td>
            <Td className="mono text-muted-foreground">{p.from}</Td>
            <Td className="text-muted-foreground">{p.time}</Td>
            <Td>
              <StatusBadge status={p.status} />
            </Td>
          </tr>
        ))}
      </Table>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          Showing 1–{rows.length} of <span className="mono">1,284</span>
        </span>
        <div className="flex gap-1.5">
          <ActionButton variant="ghost" className="px-3 py-1 text-xs">
            Previous
          </ActionButton>
          <ActionButton variant="ghost" className="px-3 py-1 text-xs">
            Next
          </ActionButton>
        </div>
      </div>
    </Panel>
  );
}

export function PendingPayments() {
  return (
    <Panel tone="warning" className="p-5">
      <Table
        head={[
          "Payment ID",
          "Invoice",
          "Expected",
          "Token",
          "Wallet",
          "Created",
          "Expires",
          "Action",
        ]}
      >
        {data.pendingPayments.map((p) => (
          <tr key={p.id}>
            <Td className="mono text-primary">{p.id}</Td>
            <Td className="mono">{p.invoice}</Td>
            <Td className="mono">{p.expected}</Td>
            <Td className="mono">{p.token}</Td>
            <Td className="mono text-muted-foreground">
              {p.wallet.slice(0, 10)}…{p.wallet.slice(-6)}
            </Td>
            <Td className="text-muted-foreground">{p.created}</Td>
            <Td className="mono text-warning">{p.expires}</Td>
            <Td>
              <ActionButton variant="ghost" className="px-3 py-1 text-xs">
                Check chain
              </ActionButton>
            </Td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}

/* ---------------- Invoices ---------------- */

export function Invoices() {
  return (
    <Panel className="p-5">
      <Table
        head={["Invoice ID", "Description", "Amount", "Token", "Created", "Expires", "Status", "Action"]}
      >
        {data.invoices.map((i) => (
          <tr key={i.id}>
            <Td className="mono text-primary">{i.id}</Td>
            <Td>{i.description}</Td>
            <Td className="mono">{i.amount}</Td>
            <Td className="mono">{i.token}</Td>
            <Td className="text-muted-foreground">{i.created}</Td>
            <Td className="text-muted-foreground">{i.expires}</Td>
            <Td>
              <StatusBadge status={i.status} />
            </Td>
            <Td>
              <ActionButton variant="ghost" className="px-3 py-1 text-xs">
                View
              </ActionButton>
            </Td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}

const emptyInvoice = {
  description: "",
  amount: "",
  token: "USDT",
  network: "BSC",
  expiry: "1hr",
  notes: "",
  tolerance: "1",
};

export function CreateInvoice() {
  const [form, setForm] = useState(emptyInvoice);
  const [generated, setGenerated] = useState<string | null>(null);

  const set = (k: keyof typeof emptyInvoice, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Panel className="p-5">
        <div className="space-y-4">
          <Field label="Description">
            <input
              className={inputClass}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Pro plan · annual"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount">
              <input
                className={`${inputClass} mono`}
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="250.00"
              />
            </Field>
            <Field label="Token">
              <select
                className={inputClass}
                value={form.token}
                onChange={(e) => set("token", e.target.value)}
              >
                {["USDT", "ETH", "BNB", "TON"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Network">
              <select
                className={inputClass}
                value={form.network}
                onChange={(e) => set("network", e.target.value)}
              >
                {["BSC", "Ethereum", "TON", "Tron"].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </Field>
            <Field label="Expires In">
              <select
                className={inputClass}
                value={form.expiry}
                onChange={(e) => set("expiry", e.target.value)}
              >
                {["30min", "1hr", "6hr", "24hr", "7days"].map((e2) => (
                  <option key={e2}>{e2}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Notes">
            <textarea
              rows={3}
              className={inputClass}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Internal notes for this invoice"
            />
          </Field>
          <Field label="Underpayment Tolerance %">
            <input
              className={`${inputClass} mono`}
              value={form.tolerance}
              onChange={(e) => set("tolerance", e.target.value)}
            />
          </Field>

          <div className="flex gap-2 pt-1">
            <ActionButton
              onClick={() =>
                setGenerated(`INV-${Math.floor(4823 + Math.random() * 200)}`)
              }
            >
              Generate Invoice
            </ActionButton>
            <ActionButton
              variant="ghost"
              onClick={() => {
                setForm(emptyInvoice);
                setGenerated(null);
              }}
            >
              Reset
            </ActionButton>
          </div>
          {generated ? (
            <p className="mono text-xs text-success">✓ Invoice {generated} created (demo)</p>
          ) : null}
        </div>
      </Panel>

      <div className="space-y-4">
        <Panel tone="success" className="p-5">
          <p className="text-xs text-muted-foreground">Preview</p>
          <p className="mono mt-3 text-3xl font-semibold">
            {form.amount || "0.00"} {form.token}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {form.description || "No description"} · {form.network} · expires in {form.expiry}
          </p>
        </Panel>
        <Panel tone="info" className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Quick Stats</h3>
          <ul className="space-y-3 text-xs">
            {[
              ["Total invoices", "1,638"],
              ["Conversion rate", "78.4%"],
              ["Avg pay time", "4m32s"],
            ].map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="mono">{v}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- Other pages ---------------- */

export function Transactions() {
  return (
    <Panel tone="info" className="p-5">
      <Table
        head={["Tx Hash", "Block", "From", "To", "Amount", "Fee", "Network", "Time", "Status"]}
      >
        {data.transactions.map((t) => (
          <tr key={t.hash}>
            <Td className="mono text-primary">{t.hash}</Td>
            <Td className="mono">{t.block}</Td>
            <Td className="mono text-muted-foreground">{t.from}</Td>
            <Td className="mono text-muted-foreground">{t.to}</Td>
            <Td className="mono">{t.amount}</Td>
            <Td className="mono text-muted-foreground">{t.fee}</Td>
            <Td>{t.network}</Td>
            <Td className="text-muted-foreground">{t.time}</Td>
            <Td>
              <StatusBadge status={t.status} />
            </Td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}

export function Wallets() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.wallets.map((w) => (
        <Panel key={w.network} className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-lg">
              {w.icon}
            </span>
            <p className="text-sm font-semibold">{w.network}</p>
          </div>
          <p className="mono mt-4 text-[11px] break-all text-muted-foreground">
            {w.address.slice(0, 18)}…{w.address.slice(-10)}
          </p>
          <p className="mono mt-3 text-xl font-semibold text-success">{w.balance}</p>
        </Panel>
      ))}
    </div>
  );
}

export function Tokens() {
  return (
    <Panel tone="warning" className="p-5">
      <Table head={["Token", "Symbol", "Network", "Contract", "Decimals", "Price", "Status"]}>
        {data.tokens.map((t) => (
          <tr key={t.symbol}>
            <Td>{t.name}</Td>
            <Td className="mono">{t.symbol}</Td>
            <Td>{t.network}</Td>
            <Td className="mono text-muted-foreground">
              {t.contract === "native"
                ? "native"
                : `${t.contract.slice(0, 10)}…${t.contract.slice(-6)}`}
            </Td>
            <Td className="mono">{t.decimals}</Td>
            <Td className="mono">{t.price}</Td>
            <Td>
              <StatusBadge status={t.status} />
            </Td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}

export function Networks() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.networks.map((n) => (
        <Panel key={n.name} tone={statusTone(n.status)} className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{n.name}</p>
            <StatusBadge status={n.status} />
          </div>
          <ul className="mt-4 space-y-2 text-xs">
            {[
              ["Chain ID", n.chainId],
              ["Block Time", n.blockTime],
              ["Fee / Gas", n.fee],
              ["Confirmations", String(n.confirmations)],
            ].map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k}</span>
                <span className="mono">{v}</span>
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </div>
  );
}

function useCountdown(initial: number) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  return [left, setLeft] as const;
}

export function Monitor() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-success">
        <span className="pulse-dot size-2.5 rounded-full bg-success" />
        Live · watching 2 payments
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.monitorPayments.map((p) => (
          <MonitorCard key={p.id} payment={p} />
        ))}
      </div>
    </div>
  );
}

function MonitorCard({ payment }: { payment: (typeof data.monitorPayments)[number] }) {
  const [left] = useCountdown(payment.seconds);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return (
    <Panel tone="info" className="p-5">
      <div className="flex items-center justify-between">
        <p className="mono text-sm text-primary">{payment.id}</p>
        <Badge tone="info">{payment.network}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-muted-foreground">Expected</p>
          <p className="mono mt-1 text-sm">{payment.expected}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Received</p>
          <p className="mono mt-1 text-sm text-success">{payment.received}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
          <span>Progress</span>
          <span className="mono">{payment.progress}%</span>
        </div>
        <ProgressBar value={payment.progress} tone="success" />
      </div>
      <p className="mono mt-4 text-xs text-warning">
        Expires in {mm}:{ss}
      </p>
    </Panel>
  );
}

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.analyticsStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <h3 className="mb-5 text-sm font-semibold">Revenue by Token</h3>
          <div className="space-y-4">
            {data.revenueByToken.map((r, i) => (
              <div key={r.token}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="mono">{r.token}</span>
                  <span className="mono text-muted-foreground">{r.pct}%</span>
                </div>
                <ProgressBar
                  value={r.pct}
                  tone={(["primary", "success", "warning", "info"] as Tone[])[i]}
                />
              </div>
            ))}
          </div>
        </Panel>
        <Panel tone="success" className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Payment Status Split</h3>
          <Table head={["Status", "Count", "Share"]}>
            {data.statusSplit.map((s) => (
              <tr key={s.status}>
                <Td>
                  <StatusBadge status={s.status} />
                </Td>
                <Td className="mono">{s.count.toLocaleString()}</Td>
                <Td className="mono text-muted-foreground">{s.pct}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      </div>
    </div>
  );
}

export function Notifications() {
  const [items, setItems] = useState(data.notifications);
  return (
    <Panel className="p-5">
      <div className="mb-4 flex justify-end">
        <ActionButton
          variant="ghost"
          onClick={() => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))}
        >
          Mark all read
        </ActionButton>
      </div>
      <ul className="divide-y divide-border/60">
        {items.map((n) => (
          <li key={n.title + n.time} className="flex items-start gap-3 py-4">
            <span
              className="mt-1.5 size-2.5 shrink-0 rounded-full"
              style={{ background: `var(--${n.tone === "danger" ? "destructive" : n.tone})` }}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">{n.title}</p>
                {n.unread ? <Badge tone="primary">New</Badge> : null}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
            </div>
            <span className="text-[10px] whitespace-nowrap text-subtle">{n.time}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [tested, setTested] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ActionButton onClick={() => setSaved(true)}>Save Changes</ActionButton>
      </div>
      {saved ? <p className="mono text-xs text-success">✓ Settings saved (demo)</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <h3 className="mb-5 text-sm font-semibold">General</h3>
          <div className="space-y-4">
            <Field label="Gateway Name">
              <input className={inputClass} defaultValue="CosCon Pay" />
            </Field>
            <Field label="Default Currency">
              <select className={inputClass} defaultValue="USD">
                {["USD", "EUR", "INR", "GBP"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Default Expiry">
              <select className={inputClass} defaultValue="1hr">
                {["30min", "1hr", "6hr", "24hr", "7days"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Underpayment Tolerance %">
              <input className={`${inputClass} mono`} defaultValue="1" />
            </Field>
          </div>
        </Panel>

        <Panel tone="info" className="p-5">
          <h3 className="mb-5 text-sm font-semibold">Webhooks</h3>
          <div className="space-y-4">
            <Field label="Webhook URL">
              <input className={inputClass} defaultValue="https://example.com/hooks/coscon" />
            </Field>
            <Field label="Secret Key">
              <input className={`${inputClass} mono`} type="password" defaultValue="whsec_demo_key" />
            </Field>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Events</p>
              {["payment.completed", "payment.underpaid", "payment.expired", "invoice.created"].map(
                (ev) => (
                  <label key={ev} className="mono flex items-center gap-2 text-xs">
                    <input type="checkbox" defaultChecked className="accent-[var(--primary)]" />
                    {ev}
                  </label>
                ),
              )}
            </div>
            <ActionButton variant="ghost" onClick={() => setTested(true)}>
              Test Webhook
            </ActionButton>
            {tested ? <p className="mono text-xs text-success">✓ 200 OK · 142ms</p> : null}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function AuditLogs() {
  return (
    <Panel tone="danger" className="p-5">
      <Table head={["Timestamp", "Admin", "Action", "Resource", "IP", "Status"]}>
        {data.auditLogs.map((l) => (
          <tr key={l.timestamp + l.action}>
            <Td className="mono text-muted-foreground">{l.timestamp}</Td>
            <Td className="mono">{l.admin}</Td>
            <Td className="mono text-primary">{l.action}</Td>
            <Td className="mono">{l.resource}</Td>
            <Td className="mono text-muted-foreground">{l.ip}</Td>
            <Td>
              <StatusBadge status={l.status} />
            </Td>
          </tr>
        ))}
      </Table>
    </Panel>
  );
}
