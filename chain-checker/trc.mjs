import readline from "node:readline";

const RPC_URL = "https://api.trongrid.io/jsonrpc";

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
// JSON-RPC
// ========================================

async function rpc(method, params = []) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(
      data.error.message || "RPC Error"
    );
  }

  return data.result;
}

// ========================================
// HELPERS
// ========================================

function hexToBigInt(hex) {
  return BigInt(hex || "0x0");
}

function hexToNumber(hex) {
  return parseInt(hex || "0x0", 16);
}

function formatTRXFromSun(value) {
  const sun = BigInt(value);

  const whole = sun / 1000000n;
  const fraction = sun % 1000000n;

  if (fraction === 0n) {
    return whole.toString();
  }

  return `${whole}.${fraction
    .toString()
    .padStart(6, "0")
    .replace(/0+$/, "")}`;
}

function formatTokenAmount(value, decimals) {
  const amount = BigInt(value);

  if (decimals === 0) {
    return amount.toString();
  }

  const divisor = 10n ** BigInt(decimals);

  const whole = amount / divisor;
  const fraction = amount % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  return `${whole}.${fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "")}`;
}

// ========================================
// HEX -> TRON ADDRESS
// ========================================

const BASE58 =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

async function sha256(data) {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return new Uint8Array(hash);
}

function base58Encode(bytes) {
  let number = 0n;

  for (const byte of bytes) {
    number =
      number * 256n + BigInt(byte);
  }

  let result = "";

  while (number > 0n) {
    const remainder =
      Number(number % 58n);

    result =
      BASE58[remainder] + result;

    number /= 58n;
  }

  for (const byte of bytes) {
    if (byte === 0) {
      result = "1" + result;
    } else {
      break;
    }
  }

  return result;
}

async function hexToTronAddress(hex) {
  let clean = hex.replace(/^0x/, "");

  clean = clean.slice(-40);

  const addressBytes = Uint8Array.from(
    ("41" + clean).match(/.{2}/g).map(
      (x) => parseInt(x, 16)
    )
  );

  const hash1 = await sha256(addressBytes);
  const hash2 = await sha256(hash1);

  const result = new Uint8Array(
    addressBytes.length + 4
  );

  result.set(addressBytes);
  result.set(
    hash2.slice(0, 4),
    addressBytes.length
  );

  return base58Encode(result);
}

// ========================================
// ERC/TRC-20 CONTRACT CALL
// ========================================

async function contractCall(
  contract,
  data
) {
  return rpc("eth_call", [
    {
      to: contract,
      data,
    },
    "latest",
  ]);
}

// ========================================
// TOKEN NAME
// ========================================

async function getTokenName(contract) {
  try {
    const result = await contractCall(
      contract,
      "0x06fdde03"
    );

    return decodeABIString(result);
  } catch {
    return "Unknown Token";
  }
}

// ========================================
// TOKEN SYMBOL
// ========================================

async function getTokenSymbol(contract) {
  try {
    const result = await contractCall(
      contract,
      "0x95d89b41"
    );

    return decodeABIString(result);
  } catch {
    return "UNKNOWN";
  }
}

// ========================================
// TOKEN DECIMALS
// ========================================

async function getTokenDecimals(contract) {
  try {
    const result = await contractCall(
      contract,
      "0x313ce567"
    );

    return parseInt(result, 16);
  } catch {
    return 6;
  }
}

// ========================================
// ABI STRING DECODER
// ========================================

function decodeABIString(result) {
  if (!result || result === "0x") {
    return "Unknown";
  }

  const hex = result.slice(2);

  // Standard dynamic string
  if (hex.length >= 128) {
    const offset = parseInt(
      hex.slice(0, 64),
      16
    );

    const length = parseInt(
      hex.slice(
        offset * 2,
        offset * 2 + 64
      ),
      16
    );

    const data = hex.slice(
      offset * 2 + 64,
      offset * 2 + 64 + length * 2
    );

    return Buffer.from(
      data,
      "hex"
    )
      .toString("utf8")
      .replace(/\0/g, "");
  }

  return "Unknown";
}

// ========================================
// DECODE TRC-20 TRANSFER
// ========================================

async function decodeTransfer(input) {
  if (!input) {
    return null;
  }

  const clean = input.replace(
    /^0x/,
    ""
  );

  // transfer(address,uint256)
  if (
    clean.slice(0, 8).toLowerCase() !==
    "a9059cbb"
  ) {
    return null;
  }

  const addressWord =
    clean.slice(8, 72);

  const amountWord =
    clean.slice(72, 136);

  if (
    addressWord.length !== 64 ||
    amountWord.length !== 64
  ) {
    return null;
  }

  const to =
    await hexToTronAddress(
      addressWord
    );

  const amount =
    BigInt("0x" + amountWord);

  return {
    to,
    amount,
  };
}

// ========================================
// CHECK TRANSACTION
// ========================================

async function checkTransaction(txHash) {
  console.log("\nChecking transaction...\n");

  // --------------------------------------
  // Transaction
  // --------------------------------------

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

  // --------------------------------------
  // Receipt
  // --------------------------------------

  const receipt = await rpc(
    "eth_getTransactionReceipt",
    [txHash]
  );

  if (!receipt) {
    console.log(
      "⏳ Transaction receipt not available yet."
    );
    return;
  }

  // --------------------------------------
  // Status
  // --------------------------------------

  let status = "⏳ UNKNOWN";

  if (receipt.status === "0x1") {
    status = "✅ SUCCESS";
  }

  if (receipt.status === "0x0") {
    status = "❌ FAILED";
  }

  // --------------------------------------
  // Header
  // --------------------------------------

  console.log(
    "========================================"
  );

  console.log(
    "       TRON TRANSACTION CHECKER"
  );

  console.log(
    "========================================"
  );

  console.log("");

  console.log(
    `Status       : ${status}`
  );

  console.log("");

  console.log(
    `Transaction  : ${tx.hash}`
  );

  // --------------------------------------
  // TRC-20
  // --------------------------------------

  const transfer =
    await decodeTransfer(tx.input);

  if (transfer && tx.to) {
    const contract =
      tx.to;

    const [
      name,
      symbol,
      decimals,
    ] = await Promise.all([
      getTokenName(contract),
      getTokenSymbol(contract),
      getTokenDecimals(contract),
    ]);

    const amount =
      formatTokenAmount(
        transfer.amount,
        decimals
      );

    console.log(
      "Type         : TRC-20 Token Transfer"
    );

    console.log("");

    console.log(
      `Coin         : ${symbol}`
    );

    console.log(
      `Token Name   : ${name}`
    );

    console.log(
      `Symbol       : ${symbol}`
    );

    console.log(
      `Amount       : ${amount} ${symbol}`
    );

    console.log("");

    console.log(
      `From         : ${tx.from}`
    );

    console.log(
      `To           : ${transfer.to}`
    );

    console.log("");

    console.log(
      `Contract     : ${contract}`
    );
  }

  // --------------------------------------
  // Native TRX
  // --------------------------------------

  else {
    const value =
      hexToBigInt(tx.value);

    console.log(
      "Type         : Native TRX Transfer"
    );

    console.log("");

    console.log(
      "Coin         : TRX"
    );

    console.log(
      `Amount       : ${formatTRXFromSun(
        value
      )} TRX`
    );

    console.log("");

    console.log(
      `From         : ${tx.from}`
    );

    console.log(
      `To           : ${tx.to}`
    );
  }

  // --------------------------------------
  // Common
  // --------------------------------------

  const block =
    hexToNumber(tx.blockNumber);

  const gasUsed =
    hexToBigInt(
      receipt.gasUsed
    );

  const gasPrice =
    hexToBigInt(
      receipt.effectiveGasPrice ||
      tx.gasPrice ||
      "0x0"
    );

  console.log("");

  console.log(
    `Block        : ${block}`
  );

  console.log(
    `Gas Used     : ${gasUsed}`
  );

  console.log(
    `Energy Price : ${gasPrice} SUN`
  );

  console.log("");

  console.log(
    "========================================"
  );
}

// ========================================
// CLI
// ========================================

async function main() {
  console.log(
    "========================================"
  );

  console.log(
    "       TRON TRANSACTION CHECKER"
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
    const txHash = (
      await ask(
        "Enter TRX TXID (or q to quit): "
      )
    ).trim();

    if (
      txHash.toLowerCase() === "q"
    ) {
      break;
    }

    if (
      !/^(0x)?[a-fA-F0-9]{64}$/.test(
        txHash
      )
    ) {
      console.log(
        "\n❌ Invalid TRON TXID.\n"
      );

      continue;
    }

    const cleanHash =
      txHash.replace(/^0x/, "");

    try {
      await checkTransaction(
        cleanHash
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