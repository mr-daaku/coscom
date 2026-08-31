import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { adminLogout, getAdminSession } from "@/lib/admin-auth.functions";
import { Sidebar, pageTitles, type PageKey } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { PageHeader } from "@/components/admin/primitives";
import * as P from "@/components/admin/pages";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — CosComPay Gateway" },
      {
        name: "description",
        content:
          "CosComPay admin panel: payments, invoices, wallets, tokens, networks, monitoring, analytics and audit logs.",
      },
      { property: "og:title", content: "CosComPay Admin Panel" },
      {
        property: "og:description",
        content: "Manage crypto payments, invoices and on-chain monitoring in one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: async () => {
    const session = await getAdminSession();
    if (!session.authenticated) throw redirect({ to: "/login" });
    return session;
  },
  component: AdminPanel,
});

function AdminPanel() {
  const session = Route.useLoaderData();
  const logout = useServerFn(adminLogout);
  const navigate = useNavigate();
  const [page, setPage] = useState<PageKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const go = (key: PageKey) => {
    setPage(key);
    setSidebarOpen(false);
  };

  const meta = pageTitles[page];

  return (
    <div className="min-h-screen">
      <Sidebar
        active={page}
        onNavigate={go}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        username={session.username ?? "ADMIN"}
        role={session.role ?? "Super Admin"}
      />

      <div className="lg:pl-[260px]">
        <Topbar
          title={meta.title}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          onLogout={async () => {
            await logout();
            await navigate({ to: "/login" });
          }}
        />
        <main className="px-4 py-6 lg:px-6">
          <PageHeader title={meta.title} subtitle={meta.subtitle} />
          {renderPage(page, go)}
        </main>
      </div>
    </div>
  );
}

function renderPage(page: PageKey, go: (key: PageKey) => void) {
  switch (page) {
    case "dashboard":
      return <P.Dashboard onCreateInvoice={() => go("invoices-create")} />;
    case "payments-all":
      return <P.Payments />;
    case "payments-pending":
      return <P.PendingPayments />;
    case "payments-completed":
      return <P.Payments filter="completed" />;
    case "payments-underpaid":
      return <P.Payments filter="underpaid" />;
    case "payments-expired":
      return <P.Payments filter="expired" />;
    case "invoices-all":
      return <P.Invoices />;
    case "invoices-create":
      return <P.CreateInvoice />;
    case "transactions":
      return <P.Transactions />;
    case "wallets":
      return <P.Wallets />;
    case "tokens":
      return <P.Tokens />;
    case "networks":
      return <P.Networks />;
    case "monitor":
      return <P.Monitor />;
    case "analytics":
      return <P.Analytics />;
    case "notifications":
      return <P.Notifications />;
    case "settings":
      return <P.Settings />;
    case "audit-logs":
      return <P.AuditLogs />;
    default:
      return null;
  }
}
