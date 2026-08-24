import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone = "primary" | "success" | "warning" | "danger" | "info" | "muted";

const toneText: Record<Tone, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  muted: "text-muted-foreground",
};

const toneBg: Record<Tone, string> = {
  primary: "bg-primary/12 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  danger: "bg-destructive/12 text-destructive",
  info: "bg-info/12 text-info",
  muted: "bg-muted text-muted-foreground",
};

const toneVar: Record<Tone, string> = {
  primary: "var(--primary)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--destructive)",
  info: "var(--info)",
  muted: "var(--muted-foreground)",
};

export function Panel({
  children,
  className,
  tone = "primary",
  accent = true,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  accent?: boolean;
}) {
  return (
    <div
      className={cn("panel relative overflow-hidden", accent && "card-accent", className)}
      style={{ ["--accent-color" as string]: toneVar[tone] }}
    >
      {children}
    </div>
  );
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        toneBg[tone],
      )}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  switch (status.toLowerCase()) {
    case "completed":
    case "success":
    case "operational":
    case "healthy":
    case "active":
      return "success";
    case "pending":
    case "underpaid":
    case "syncing":
    case "paused":
      return "warning";
    case "expired":
    case "failed":
    case "degraded":
      return "danger";
    default:
      return "info";
  }
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone(status)}>{status}</Badge>;
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-60",
        variant === "primary"
          ? "bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_var(--primary)] hover:brightness-110"
          : "border border-border bg-surface/60 text-foreground hover:bg-surface",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function StatCard({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  tone: Tone;
}) {
  return (
    <Panel tone={tone} className="p-5">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className={cn("mono mt-3 text-2xl font-semibold", toneText[tone])}>{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{delta}</p>
    </Panel>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="row-hover w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {head.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 whitespace-nowrap", className)}>{children}</td>;
}

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: Tone }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
      <div
        className="h-full rounded-full transition-all duration-200"
        style={{ width: `${value}%`, background: toneVar[tone] }}
      />
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border bg-surface/60 px-3 py-2 text-sm text-foreground outline-none transition-all duration-200 placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/30";
