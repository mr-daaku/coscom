export type Status = "completed" | "pending" | "expired" | "underpaid" | "active";

export const stats = [
  { label: "Total Volume", value: "$48,291", delta: "↑ 12.4%", tone: "primary" as const },
  { label: "Completed", value: "1,284", delta: "↑ 8.1%", tone: "success" as const },
  { label: "Pending", value: "24", delta: "4 awaiting", tone: "warning" as const },
  { label: "Expired", value: "38", delta: "↑ 2 today", tone: "danger" as const },
];

export const revenueSeries: Record<string, number[]> = {
  "7D": [42, 68, 55, 88, 72, 96, 61],
  "30D": [58, 44, 79, 63, 91, 52, 84],
  "90D": [70, 82, 48, 95, 66, 58, 77],
};

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const activity = [
  {
    title: "Payment received",
    detail: "250.00 USDT · INV-4821 · BSC",
    time: "2 min ago",
    tone: "success" as const,
  },
  {
    title: "Invoice created",
    detail: "INV-4822 · 1.25 ETH · Ethereum",
    time: "14 min ago",
    tone: "primary" as const,
  },
  {
    title: "Underpaid payment",
    detail: "PMT-9913 · received 180.00 / 200.00 USDT",
    time: "48 min ago",
    tone: "warning" as const,
  },
  {
    title: "Login alert",
    detail: "New admin session from 103.21.44.9",
    time: "3 hours ago",
    tone: "danger" as const,
  },
];

export const networkHealth = [
  { name: "Ethereum", value: 98, status: "Operational" },
  { name: "BSC", value: 95, status: "Operational" },
  { name: "TON", value: 99, status: "Operational" },
  { name: "Tron", value: 72, status: "Degraded" },
];

export const walletBalances = [
  { token: "USDT", balance: "18,420.55", usd: "$18,420.55", status: "Healthy" },
  { token: "BNB", balance: "42.9182", usd: "$25,750.92", status: "Healthy" },
  { token: "TON", balance: "1,204.220", usd: "$6,382.37", status: "Syncing" },
  { token: "TRX", balance: "88,102.10", usd: "$10,572.25", status: "Degraded" },
];

export const payments = [
  {
    id: "PMT-10241",
    invoice: "INV-4821",
    amount: "250.00",
    token: "USDT",
    network: "BSC",
    from: "0x7a3f…9c21",
    time: "2 min ago",
    status: "completed" as Status,
  },
  {
    id: "PMT-10240",
    invoice: "INV-4820",
    amount: "1.2500",
    token: "ETH",
    network: "Ethereum",
    from: "0x18be…44d0",
    time: "26 min ago",
    status: "pending" as Status,
  },
  {
    id: "PMT-10239",
    invoice: "INV-4819",
    amount: "180.00",
    token: "USDT",
    network: "Tron",
    from: "TQ9m…7Kx2",
    time: "48 min ago",
    status: "underpaid" as Status,
  },
  {
    id: "PMT-10238",
    invoice: "INV-4818",
    amount: "500.00",
    token: "USDT",
    network: "Ethereum",
    from: "0x9fd1…0a7e",
    time: "1 hour ago",
    status: "completed" as Status,
  },
  {
    id: "PMT-10237",
    invoice: "INV-4817",
    amount: "12.400",
    token: "TON",
    network: "TON",
    from: "EQCd…u81m",
    time: "2 hours ago",
    status: "expired" as Status,
  },
  {
    id: "PMT-10236",
    invoice: "INV-4816",
    amount: "0.8800",
    token: "BNB",
    network: "BSC",
    from: "0x4c02…be93",
    time: "3 hours ago",
    status: "completed" as Status,
  },
  {
    id: "PMT-10235",
    invoice: "INV-4815",
    amount: "75.00",
    token: "USDT",
    network: "BSC",
    from: "0xaa71…12f5",
    time: "4 hours ago",
    status: "pending" as Status,
  },
  {
    id: "PMT-10234",
    invoice: "INV-4814",
    amount: "320.00",
    token: "USDT",
    network: "Tron",
    from: "TXk4…9dQ1",
    time: "6 hours ago",
    status: "completed" as Status,
  },
  {
    id: "PMT-10233",
    invoice: "INV-4813",
    amount: "2.0000",
    token: "ETH",
    network: "Ethereum",
    from: "0x66ce…31ab",
    time: "9 hours ago",
    status: "expired" as Status,
  },
  {
    id: "PMT-10232",
    invoice: "INV-4812",
    amount: "144.20",
    token: "USDT",
    network: "BSC",
    from: "0x0d5a…7712",
    time: "11 hours ago",
    status: "underpaid" as Status,
  },
];

export const pendingPayments = [
  {
    id: "PMT-10240",
    invoice: "INV-4820",
    expected: "1.2500",
    token: "ETH",
    wallet: "0x18be4471aa0c9b0fd21b09a7b8c1d4e5f6a744d0",
    created: "26 min ago",
    expires: "03:41",
  },
  {
    id: "PMT-10235",
    invoice: "INV-4815",
    expected: "75.00",
    token: "USDT",
    wallet: "0xaa7189cf05b1d3e29c40e6b7ac9218e0e14f12f5",
    created: "4 hours ago",
    expires: "19:12",
  },
];

export const invoices = [
  {
    id: "INV-4821",
    description: "Pro plan · annual",
    amount: "250.00",
    token: "USDT",
    created: "24 Aug 2026",
    expires: "24 Aug 2026, 18:00",
    status: "completed" as Status,
  },
  {
    id: "INV-4820",
    description: "Custom integration retainer",
    amount: "1.2500",
    token: "ETH",
    created: "24 Aug 2026",
    expires: "24 Aug 2026, 17:20",
    status: "pending" as Status,
  },
  {
    id: "INV-4819",
    description: "API overage · July",
    amount: "200.00",
    token: "USDT",
    created: "23 Aug 2026",
    expires: "23 Aug 2026, 22:00",
    status: "underpaid" as Status,
  },
];

export const transactions = [
  {
    hash: "0x9d21ab…7f4c02",
    block: "21,904,551",
    from: "0x7a3f…9c21",
    to: "0x51d0…ab77",
    amount: "250.00 USDT",
    fee: "0.00042 BNB",
    network: "BSC",
    time: "2 min ago",
    status: "completed" as Status,
  },
  {
    hash: "0x4fe0cd…1b9a35",
    block: "21,904,488",
    from: "0x9fd1…0a7e",
    to: "0x51d0…ab77",
    amount: "500.00 USDT",
    fee: "0.00193 ETH",
    network: "Ethereum",
    time: "1 hour ago",
    status: "completed" as Status,
  },
];

export const wallets = [
  {
    icon: "⟠",
    network: "Ethereum",
    address: "0x51d0f38b17c9a5cd2e7b104f6c9a10c4be92ab77",
    balance: "3.9241 ETH",
  },
  {
    icon: "🟡",
    network: "BSC",
    address: "0x51d0f38b17c9a5cd2e7b104f6c9a10c4be92ab77",
    balance: "42.9182 BNB",
  },
  {
    icon: "💎",
    network: "TON",
    address: "EQCd7Y1m4pKcRr1Zx8kQfXn0mAe2Rr9uWc71LpKu81mQ",
    balance: "1,204.220 TON",
  },
];

export const tokens = [
  {
    name: "Tether USD",
    symbol: "USDT",
    network: "BSC",
    contract: "0x55d398326f99059fF775485246999027B3197955",
    decimals: 18,
    price: "$1.00",
    status: "Active",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum",
    contract: "native",
    decimals: 18,
    price: "$3,284.10",
    status: "Active",
  },
  {
    name: "BNB",
    symbol: "BNB",
    network: "BSC",
    contract: "native",
    decimals: 18,
    price: "$600.24",
    status: "Active",
  },
  {
    name: "Toncoin",
    symbol: "TON",
    network: "TON",
    contract: "native",
    decimals: 9,
    price: "$5.30",
    status: "Paused",
  },
];

export const networks = [
  {
    name: "Ethereum",
    status: "Operational",
    chainId: "1",
    blockTime: "12s",
    fee: "18 gwei",
    confirmations: 12,
  },
  {
    name: "BSC",
    status: "Operational",
    chainId: "56",
    blockTime: "3s",
    fee: "3 gwei",
    confirmations: 15,
  },
  {
    name: "TON",
    status: "Operational",
    chainId: "-239",
    blockTime: "5s",
    fee: "0.005 TON",
    confirmations: 1,
  },
  {
    name: "Tron",
    status: "Degraded",
    chainId: "728126428",
    blockTime: "3s",
    fee: "13 TRX",
    confirmations: 19,
  },
];

export const monitorPayments = [
  {
    id: "PMT-10240",
    expected: "1.2500 ETH",
    received: "0.6000 ETH",
    network: "Ethereum",
    progress: 48,
    seconds: 221,
  },
  {
    id: "PMT-10235",
    expected: "75.00 USDT",
    received: "0.00 USDT",
    network: "BSC",
    progress: 0,
    seconds: 1152,
  },
];

export const analyticsStats = [
  { label: "Revenue", value: "$48,291", delta: "↑ 12.4%", tone: "primary" as const },
  { label: "Conversion", value: "78.4%", delta: "↑ 3.2%", tone: "success" as const },
  { label: "Avg Pay Time", value: "4m32s", delta: "↓ 18s", tone: "info" as const },
  { label: "Repeat Payers", value: "34.2%", delta: "↑ 1.1%", tone: "warning" as const },
];

export const revenueByToken = [
  { token: "USDT", pct: 58 },
  { token: "ETH", pct: 25 },
  { token: "BNB", pct: 12 },
  { token: "TON", pct: 5 },
];

export const statusSplit = [
  { status: "Completed", count: 1284, pct: "78.4%" },
  { status: "Pending", count: 24, pct: "1.5%" },
  { status: "Underpaid", count: 92, pct: "5.6%" },
  { status: "Expired", count: 238, pct: "14.5%" },
];

export const notifications = [
  {
    title: "Payment received",
    detail: "250.00 USDT for INV-4821 confirmed on BSC.",
    time: "2 min ago",
    tone: "success" as const,
    unread: true,
  },
  {
    title: "Underpaid payment",
    detail: "PMT-9913 received 180.00 of 200.00 USDT.",
    time: "48 min ago",
    tone: "warning" as const,
    unread: true,
  },
  {
    title: "Invoice expired",
    detail: "INV-4813 expired without payment.",
    time: "9 hours ago",
    tone: "danger" as const,
    unread: false,
  },
  {
    title: "Network alert",
    detail: "Tron RPC latency elevated — monitoring.",
    time: "12 hours ago",
    tone: "info" as const,
    unread: false,
  },
];

export const auditLogs = [
  {
    timestamp: "24 Aug 2026 10:14 UTC",
    admin: "BABA-DAAKU",
    action: "admin.login",
    resource: "session",
    ip: "103.21.44.9",
    status: "Success",
  },
  {
    timestamp: "24 Aug 2026 09:52 UTC",
    admin: "BABA-DAAKU",
    action: "invoice.create",
    resource: "INV-4821",
    ip: "103.21.44.9",
    status: "Success",
  },
  {
    timestamp: "23 Aug 2026 21:08 UTC",
    admin: "system",
    action: "webhook.deliver",
    resource: "payment.completed",
    ip: "10.0.0.4",
    status: "Failed",
  },
];

export const payNetworks = [
  { name: "BSC", address: "0x51d0f38b17c9a5cd2e7b104f6c9a10c4be92ab77" },
  { name: "Ethereum", address: "0x9a71fe0cb42d8ab1e77c02f5d3417ac0be519d34" },
  { name: "TON", address: "EQCd7Y1m4pKcRr1Zx8kQfXn0mAe2Rr9uWc71LpKu81mQ" },
  { name: "Tron", address: "TQ9mR4kLp2XcVb7nHs1YuKf3Ze8Aq5Dw7K" },
];
