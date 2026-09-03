import readline from "node:readline";

const RPC_URLS = [
  "https://polygon-bor-rpc.publicnode.com",
  "https://polygon.drpc.org",
];

const CHAIN_NAME = "POLYGON";
const NATIVE_COIN = "POL";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// ========================================
// RPC
// ========================================

async function rpc(method, params = []) {
  let lastError;

  for (const rpcUrl of RPC_URLS) {
    try {
      const response = await fetch(rpcUrl, {
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

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(
          data.error.message || "RPC error"
        );
      }

      return data.result;
    } catch (error) {
      lastError = error;

      console.log(
        `RPC failed: ${rpcUrl}`
      );
    }
  }

  throw new Error(
    `All RPCs failed: ${
      lastError?.message || "Unknown error"
    }`
  );
}

// ========================================
// FORMAT
// ========================================

function formatUnits(value, decimals = 18) {
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

function hexToBigInt(value) {
  return BigInt(value || "0x0");
}

// ========================================
// ERC20 ABI CALLS
// ========================================

async function ethCall(to, data) {
  return rpc("eth_call", [
    {
      to,
      data,
    },
    "latest",
  ]);
}

function decodeABIString(hex) {
  if (!hex || hex === "0x") {
    return "N/A";
  }

  try {
    const clean = hex.slice(2);

    // bytes32 string
    if (clean.length === 64) {
      return Buffer.from(clean, "hex")
        .toString("utf8")
        .replace(/\0/g, "")
        .trim() || "N/A";
    }

    // dynamic string
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
      .replace(/\0/g, "")
      .trim() || "N/A";
  } catch {
    return "N/A";
  }
}

async function getTokenInfo(contract) {
  let name = "Unknown Token";
  let symbol = "UNKNOWN";
  let decimals = 18;

  try {
    name = decodeABIString(
      await ethCall(
        contract,
        "0x06fdde03"
      )
    );
  } catch {}

  try {
    symbol = decodeABIString(
      await ethCall(
        contract,
        "0x95d89b41"
      )
    );
  } catch {}

  try {
    decimals = Number(
      hexToBigInt(
        await ethCall(
          contract,
          "0x313ce567"
        )
      )
    );
  } catch {}

  return {
    name,
    symbol,
    decimals,
  };
}

// ========================================
// TRANSFER EVENT
// ========================================

// keccak256(
//   Transfer(address,address,uint256)
// )
// =
// 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef

const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

function topicAddress(topic) {
  return (
    "0x" +
    topic.slice(-40)
  );
}

// ========================================
// CHECK TRANSACTION
// ========================================

async function checkTransaction(txHash) {
  console.log(
    "\nChecking transaction...\n"
  );

  const tx = await rpc(
    "eth_getTransactionByHash",
    [txHash]
  );

  if (!tx) {
    console.log(
      "❌ Transaction not found."
    );
    return;
  }

  const receipt = await rpc(
    "eth_getTransactionReceipt",
    [txHash]
  );

  let status = "⏳ PENDING";

  if (receipt?.status === "0x1") {
    status = "✅ SUCCESS";
  } else if (receipt?.status === "0x0") {
    status = "❌ FAILED";
  }

  console.log(
    "========================================"
  );

  console.log(
    "       POLYGON TRANSACTION CHECKER"
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
  // TOKEN TRANSFER LOGS
  // ======================================

  const logs = receipt?.logs || [];

  const transferLogs = logs.filter(
    (log) =>
      log.topics &&
      log.topics.length >= 3 &&
      log.topics[0].toLowerCase() ===
        TRANSFER_TOPIC
  );

  if (transferLogs.length > 0) {
    console.log("");

    console.log(
      "Type         : ERC-20 Token Transfer"
    );

    for (
      let i = 0;
      i < transferLogs.length;
      i++
    ) {
      const log =
        transferLogs[i];

      const from =
        topicAddress(log.topics[1]);

      const to =
        topicAddress(log.topics[2]);

      const rawAmount =
        BigInt(log.data);

      const contract =
        log.address;

      const token =
        await getTokenInfo(contract);

      console.log("");

      if (transferLogs.length > 1) {
        console.log(
          `--- Transfer #${i + 1} ---`
        );
      }

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
        `Amount       : ${formatUnits(
          rawAmount,
          token.decimals
        )} ${token.symbol}`
      );

      console.log("");

      console.log(
        `From         : ${from}`
      );

      console.log(
        `To           : ${to}`
      );

      console.log("");

      console.log(
        `Contract     : ${contract}`
      );
    }
  }

  // ======================================
  // NATIVE POL TRANSFER
  // ======================================

  const nativeValue =
    hexToBigInt(tx.value);

  if (
    nativeValue > 0n &&
    transferLogs.length === 0
  ) {
    console.log("");

    console.log(
      "Type         : Native POL Transfer"
    );

    console.log("");

    console.log(
      `Coin         : ${NATIVE_COIN}`
    );

    console.log(
      `Amount       : ${formatUnits(
        nativeValue
      )} POL`
    );

    console.log("");

    console.log(
      `From         : ${tx.from}`
    );

    console.log(
      `To           : ${tx.to || "N/A"}`
    );
  }

  // ======================================
  // CONTRACT TX WITHOUT VALUE
  // ======================================

  if (
    nativeValue === 0n &&
    transferLogs.length === 0
  ) {
    console.log("");

    console.log(
      "Type         : Contract Transaction"
    );

    console.log("");

    console.log(
      `From         : ${tx.from}`
    );

    console.log(
      `To           : ${tx.to || "N/A"}`
    );

    console.log(
      "Amount       : 0 POL"
    );
  }

  // ======================================
  // GAS
  // ======================================

  if (receipt) {
    const gasUsed =
      hexToBigInt(
        receipt.gasUsed
      );

    const gasPrice =
      hexToBigInt(
        receipt.effectiveGasPrice ||
          tx.gasPrice
      );

    const gasFee =
      gasUsed * gasPrice;

    console.log("");

    console.log(
      `Block        : ${hexToBigInt(
        tx.blockNumber
      )}`
    );

    console.log(
      `Gas Used     : ${gasUsed}`
    );

    console.log(
      `Gas Price    : ${formatUnits(
        gasPrice,
        9
      )} Gwei`
    );

    console.log(
      `Gas Fee      : ${formatUnits(
        gasFee
      )} POL`
    );
  }

  console.log("");

  console.log(
    "========================================"
  );
}

// ========================================
// MAIN
// ========================================

async function main() {
  console.log(
    "========================================"
  );

  console.log(
    "       POLYGON TRANSACTION CHECKER"
  );

  console.log(
    "========================================"
  );

  console.log("");

  console.log(
    `RPC: ${RPC_URLS[0]}`
  );

  console.log(
    "Fallback RPC: " +
      RPC_URLS[1]
  );

  console.log("");

  while (true) {
    const txHash = (
      await ask(
        "Enter Polygon TX Hash (or q to quit): "
      )
    ).trim();

    if (
      txHash.toLowerCase() ===
      "q"
    ) {
      break;
    }

    if (
      !/^0x[a-fA-F0-9]{64}$/.test(
        txHash
      )
    ) {
      console.log(
        "\n❌ Invalid transaction hash.\n"
      );

      continue;
    }

    try {
      await checkTransaction(
        txHash
      );
    } catch (error) {
      console.log(
        `\n❌ Error: ${error.message}\n`
      );
    }

    console.log("");
  }

  rl.close();
}

main();