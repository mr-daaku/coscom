import readline from "node:readline";

const RPC_URL = "https://mainnet.base.org";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(q) {
  return new Promise((resolve) => {
    rl.question(q, resolve);
  });
}

async function rpc(method, params = []) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result;
}

function format(value, decimals = 18) {
  const n = BigInt(value || 0);
  const d = 10n ** BigInt(decimals);

  const whole = n / d;
  const fraction = n % d;

  if (fraction === 0n) {
    return whole.toString();
  }

  return `${whole}.${fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "")}`;
}

function decodeAddress(word) {
  return "0x" + word.slice(-40);
}

async function tokenCall(contract, data) {
  return rpc("eth_call", [
    {
      to: contract,
      data,
    },
    "latest",
  ]);
}

function decodeString(hex) {
  if (!hex || hex === "0x") {
    return "Unknown";
  }

  const clean = hex.slice(2);

  try {
    const offset = parseInt(
      clean.slice(0, 64),
      16
    );

    const length = parseInt(
      clean.slice(
        offset * 2,
        offset * 2 + 64
      ),
      16
    );

    const data = clean.slice(
      offset * 2 + 64,
      offset * 2 + 64 + length * 2
    );

    return Buffer.from(data, "hex")
      .toString("utf8")
      .replace(/\0/g, "");
  } catch {
    return "Unknown";
  }
}

async function getTokenInfo(contract) {
  let name = "Unknown Token";
  let symbol = "UNKNOWN";
  let decimals = 18;

  try {
    name = decodeString(
      await tokenCall(
        contract,
        "0x06fdde03"
      )
    );
  } catch {}

  try {
    symbol = decodeString(
      await tokenCall(
        contract,
        "0x95d89b41"
      )
    );
  } catch {}

  try {
    decimals = parseInt(
      await tokenCall(
        contract,
        "0x313ce567"
      ),
      16
    );
  } catch {}

  return {
    name,
    symbol,
    decimals,
  };
}

async function checkTransaction(hash) {
  console.log(
    "\nChecking transaction...\n"
  );

  const tx = await rpc(
    "eth_getTransactionByHash",
    [hash]
  );

  if (!tx) {
    console.log(
      "❌ Transaction not found."
    );
    return;
  }

  const receipt = await rpc(
    "eth_getTransactionReceipt",
    [hash]
  );

  const status =
    receipt?.status === "0x1"
      ? "✅ SUCCESS"
      : receipt?.status === "0x0"
        ? "❌ FAILED"
        : "⏳ PENDING";

  console.log(
    "========================================"
  );

  console.log(
    "         BASE TRANSACTION CHECKER"
  );

  console.log(
    "========================================"
  );

  console.log("");

  console.log(
    `Status       : ${status}`
  );

  console.log(
    `Transaction  : ${tx.hash}`
  );

  // ======================================
  // ERC20
  // ======================================

  if (
    tx.input
      ?.slice(0, 10)
      .toLowerCase() ===
    "0xa9059cbb"
  ) {
    const to =
      decodeAddress(
        tx.input.slice(10, 74)
      );

    const amount =
      BigInt(
        "0x" +
        tx.input.slice(74, 138)
      );

    const token =
      await getTokenInfo(tx.to);

    console.log(
      "Type         : ERC-20 Token Transfer"
    );

    console.log("");

    console.log(
      `Coin         : ${token.symbol}`
    );

    console.log(
      `Token Name   : ${token.name}`
    );

    console.log(
      `Symbol       : ${token.symbol}`
    );

    console.log(
      `Amount       : ${format(
        amount,
        token.decimals
      )} ${token.symbol}`
    );

    console.log("");

    console.log(
      `From         : ${tx.from}`
    );

    console.log(
      `To           : ${to}`
    );

    console.log("");

    console.log(
      `Contract     : ${tx.to}`
    );
  }

  // ======================================
  // NATIVE ETH
  // ======================================

  else {
    console.log(
      "Type         : Native ETH Transfer"
    );

    console.log("");

    console.log(
      "Coin         : ETH"
    );

    console.log(
      `Amount       : ${format(
        BigInt(tx.value || "0x0")
      )} ETH`
    );

    console.log("");

    console.log(
      `From         : ${tx.from}`
    );

    console.log(
      `To           : ${tx.to}`
    );
  }

  // ======================================
  // GAS
  // ======================================

  if (receipt) {
    const gasUsed =
      BigInt(receipt.gasUsed);

    const gasPrice =
      BigInt(
        receipt.effectiveGasPrice ||
        tx.gasPrice ||
        "0x0"
      );

    const fee =
      gasUsed * gasPrice;

    console.log("");

    console.log(
      `Block        : ${BigInt(
        tx.blockNumber
      )}`
    );

    console.log(
      `Gas Used     : ${gasUsed}`
    );

    console.log(
      `Gas Fee      : ${format(
        fee
      )} ETH`
    );
  }

  console.log("");

  console.log(
    "========================================"
  );
}

async function main() {
  console.log(
    "========================================"
  );

  console.log(
    "         BASE TRANSACTION CHECKER"
  );

  console.log(
    "========================================"
  );

  console.log("");

  console.log(
    `RPC: ${RPC_URL}`
  );

  console.log("");

  while (true) {
    const hash = (
      await ask(
        "Enter Base TX Hash (or q to quit): "
      )
    ).trim();

    if (
      hash.toLowerCase() === "q"
    ) {
      break;
    }

    if (
      !/^0x[a-fA-F0-9]{64}$/.test(hash)
    ) {
      console.log(
        "\n❌ Invalid TX hash.\n"
      );

      continue;
    }

    try {
      await checkTransaction(hash);
    } catch (e) {
      console.log(
        `\n❌ Error: ${e.message}\n`
      );
    }

    console.log("");
  }

  rl.close();
}

main();