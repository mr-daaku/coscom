import readline from "node:readline";

const RPC_URL = "https://bsc-dataseed.bnbchain.org";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// --------------------------------------------------
// JSON-RPC
// --------------------------------------------------

async function rpc(method, params = []) {
  const response = await fetch(RPC_URL, {
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
    throw new Error(`RPC HTTP Error: ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "RPC Error");
  }

  return data.result;
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function hexToNumber(hex) {
  if (!hex) return 0;
  return parseInt(hex, 16);
}

function hexToBigInt(hex) {
  return BigInt(hex || "0x0");
}

function formatBNB(hex) {
  const wei = hexToBigInt(hex);

  const whole = wei / 1000000000000000000n;
  const fraction = wei % 1000000000000000000n;

  const fractionString = fraction
    .toString()
    .padStart(18, "0")
    .replace(/0+$/, "");

  return fractionString
    ? `${whole}.${fractionString}`
    : `${whole}`;
}

function formatTokenAmount(value, decimals) {
  const divisor = 10n ** BigInt(decimals);

  const whole = value / divisor;
  const fraction = value % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  let fractionString = fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");

  return `${whole}.${fractionString}`;
}

function decodeAddress(word) {
  return "0x" + word.slice(-40);
}

function decodeUint256(word) {
  return BigInt("0x" + word);
}

function cleanString(hex) {
  try {
    let value = hex.startsWith("0x") ? hex.slice(2) : hex;

    value = value.replace(/00+$/, "");

    return Buffer.from(value, "hex").toString("utf8");
  } catch {
    return null;
  }
}

// --------------------------------------------------
// ERC-20 contract calls
// --------------------------------------------------

async function contractCall(contract, data) {
  return await rpc("eth_call", [
    {
      to: contract,
      data,
    },
    "latest",
  ]);
}

async function getTokenName(contract) {
  try {
    // name()
    const result = await contractCall(
      contract,
      "0x06fdde03"
    );

    if (!result || result === "0x") {
      return "Unknown Token";
    }

    const hex = result.slice(2);

    // ABI dynamic string
    if (hex.length >= 128) {
      const offset = parseInt(hex.slice(0, 64), 16);
      const length = parseInt(
        hex.slice(offset * 2, offset * 2 + 64),
        16
      );

      const data = hex.slice(
        offset * 2 + 64,
        offset * 2 + 64 + length * 2
      );

      return Buffer.from(data, "hex")
        .toString("utf8")
        .replace(/\0/g, "");
    }

    return cleanString(result) || "Unknown Token";
  } catch {
    return "Unknown Token";
  }
}

async function getTokenSymbol(contract) {
  try {
    // symbol()
    const result = await contractCall(
      contract,
      "0x95d89b41"
    );

    if (!result || result === "0x") {
      return "UNKNOWN";
    }

    const hex = result.slice(2);

    if (hex.length >= 128) {
      const offset = parseInt(hex.slice(0, 64), 16);

      const length = parseInt(
        hex.slice(offset * 2, offset * 2 + 64),
        16
      );

      const data = hex.slice(
        offset * 2 + 64,
        offset * 2 + 64 + length * 2
      );

      return Buffer.from(data, "hex")
        .toString("utf8")
        .replace(/\0/g, "");
    }

    return cleanString(result) || "UNKNOWN";
  } catch {
    return "UNKNOWN";
  }
}

async function getTokenDecimals(contract) {
  try {
    // decimals()
    const result = await contractCall(
      contract,
      "0x313ce567"
    );

    return parseInt(result, 16);
  } catch {
    return 18;
  }
}

// --------------------------------------------------
// Decode transfer(address,uint256)
// --------------------------------------------------

function decodeTransferInput(input) {
  if (!input || input.length < 138) {
    return null;
  }

  // transfer(address,uint256)
  const method = input.slice(0, 10).toLowerCase();

  if (method !== "0xa9059cbb") {
    return null;
  }

  const data = input.slice(10);

  const addressWord = data.slice(0, 64);
  const amountWord = data.slice(64, 128);

  if (
    addressWord.length !== 64 ||
    amountWord.length !== 64
  ) {
    return null;
  }

  return {
    to: decodeAddress(addressWord),
    amount: decodeUint256(amountWord),
  };
}

// --------------------------------------------------
// Main transaction checker
// --------------------------------------------------

async function checkTransaction(txHash) {
  console.log("\nChecking transaction...\n");

  const tx = await rpc(
    "eth_getTransactionByHash",
    [txHash]
  );

  if (!tx) {
    console.log("❌ Transaction not found.");
    return;
  }

  const receipt = await rpc(
    "eth_getTransactionReceipt",
    [txHash]
  );

  if (!receipt) {
    console.log("⏳ Transaction is still pending.");
    return;
  }

  // ------------------------------------------------
  // Status
  // ------------------------------------------------

  let status = "⏳ UNKNOWN";

  if (receipt.status === "0x1") {
    status = "✅ SUCCESS";
  } else if (receipt.status === "0x0") {
    status = "❌ FAILED";
  }

  // ------------------------------------------------
  // Gas
  // ------------------------------------------------

  const gasUsed = hexToBigInt(receipt.gasUsed);
  const gasPrice = hexToBigInt(tx.gasPrice);

  const gasFeeWei = gasUsed * gasPrice;

  const gasFeeBNB = formatBNB(
    "0x" + gasFeeWei.toString(16)
  );

  const blockNumber = hexToNumber(
    tx.blockNumber
  );

  // ------------------------------------------------
  // Detect BEP-20 transfer
  // ------------------------------------------------

  const transfer = decodeTransferInput(tx.input);

  console.log("========================================");
  console.log("       BSC TRANSACTION CHECKER");
  console.log("========================================");
  console.log("");

  console.log(`Status       : ${status}`);
  console.log("");

  console.log(`Transaction  : ${tx.hash}`);

  // ------------------------------------------------
  // BEP-20
  // ------------------------------------------------

  if (transfer) {
    const contract = tx.to;

    const [name, symbol, decimals] =
      await Promise.all([
        getTokenName(contract),
        getTokenSymbol(contract),
        getTokenDecimals(contract),
      ]);

    const amount = formatTokenAmount(
      transfer.amount,
      decimals
    );

    console.log(
      `Type         : BEP-20 Token Transfer`
    );

    console.log("");

    console.log(`Coin         : ${symbol}`);
    console.log(`Token Name   : ${name}`);
    console.log(`Symbol       : ${symbol}`);
    console.log(`Amount       : ${amount} ${symbol}`);

    console.log("");

    console.log(`From         : ${tx.from}`);
    console.log(`To           : ${transfer.to}`);

    console.log("");

    console.log(`Contract     : ${contract}`);
  }

  // ------------------------------------------------
  // Native BNB
  // ------------------------------------------------

  else {
    const amount = formatBNB(tx.value);

    console.log(
      `Type         : Native BNB Transfer`
    );

    console.log("");

    console.log(`Coin         : BNB`);
    console.log(`Amount       : ${amount} BNB`);

    console.log("");

    console.log(`From         : ${tx.from}`);
    console.log(`To           : ${tx.to}`);
  }

  // ------------------------------------------------
  // Common information
  // ------------------------------------------------

  console.log("");

  console.log(`Block        : ${blockNumber}`);
  console.log(`Gas Used     : ${gasUsed}`);
  console.log(`Gas Fee      : ${gasFeeBNB} BNB`);

  console.log("");

  console.log("========================================");
}

// --------------------------------------------------
// CLI
// --------------------------------------------------

async function main() {
  console.log("========================================");
  console.log("       BSC TRANSACTION CHECKER");
  console.log("========================================");
  console.log("");
  console.log(`RPC: ${RPC_URL}`);
  console.log("");

  while (true) {
    const txHash = (
      await ask("Enter TX Hash (or q to quit): ")
    ).trim();

    if (txHash.toLowerCase() === "q") {
      break;
    }

    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      console.log(
        "\n❌ Invalid transaction hash.\n"
      );
      continue;
    }

    try {
      await checkTransaction(txHash);
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
