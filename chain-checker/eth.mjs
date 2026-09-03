import readline from "node:readline";

const RPC_URL = "https://ethereum-rpc.publicnode.com";

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
// JSON RPC
// ========================================

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

// ========================================
// HELPERS
// ========================================

function hexToNumber(hex) {
  if (!hex) return 0;
  return parseInt(hex, 16);
}

function hexToBigInt(hex) {
  return BigInt(hex || "0x0");
}

function formatETHFromWei(wei) {
  const value = BigInt(wei);

  const whole = value / 1000000000000000000n;
  const fraction = value % 1000000000000000000n;

  const fractionString = fraction
    .toString()
    .padStart(18, "0")
    .replace(/0+$/, "");

  return fractionString
    ? `${whole}.${fractionString}`
    : `${whole}`;
}

function formatETH(hex) {
  return formatETHFromWei(hexToBigInt(hex));
}

function formatTokenAmount(value, decimals) {
  if (decimals === 0) {
    return value.toString();
  }

  const divisor = 10n ** BigInt(decimals);

  const whole = value / divisor;
  const fraction = value % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionString = fraction
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

// ========================================
// CONTRACT CALL
// ========================================

async function contractCall(contract, data) {
  return await rpc("eth_call", [
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
    // name()
    const result = await contractCall(
      contract,
      "0x06fdde03"
    );

    if (!result || result === "0x") {
      return "Unknown Token";
    }

    const hex = result.slice(2);

    if (hex.length >= 128) {
      const offset = parseInt(
        hex.slice(0, 64),
        16
      );

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

    return "Unknown Token";
  } catch {
    return "Unknown Token";
  }
}

// ========================================
// TOKEN SYMBOL
// ========================================

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
      const offset = parseInt(
        hex.slice(0, 64),
        16
      );

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

    return "UNKNOWN";
  } catch {
    return "UNKNOWN";
  }
}

// ========================================
// TOKEN DECIMALS
// ========================================

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

// ========================================
// DECODE ERC20 TRANSFER
// ========================================

function decodeTransferInput(input) {
  if (!input || input.length < 138) {
    return null;
  }

  // transfer(address,uint256)
  const method = input
    .slice(0, 10)
    .toLowerCase();

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

// ========================================
// CHECK TRANSACTION
// ========================================

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
    console.log(
      "⏳ Transaction is still pending."
    );
    return;
  }

  // ======================================
  // STATUS
  // ======================================

  let status = "⏳ UNKNOWN";

  if (receipt.status === "0x1") {
    status = "✅ SUCCESS";
  }

  if (receipt.status === "0x0") {
    status = "❌ FAILED";
  }

  // ======================================
  // GAS
  // ======================================

  const gasUsed = hexToBigInt(
    receipt.gasUsed
  );

  const gasPrice = hexToBigInt(
    tx.gasPrice
  );

  const gasFeeWei =
    gasUsed * gasPrice;

  const gasFeeETH =
    formatETHFromWei(gasFeeWei);

  const blockNumber =
    hexToNumber(tx.blockNumber);

  // ======================================
  // DETECT ERC20
  // ======================================

  const transfer =
    decodeTransferInput(tx.input);

  console.log(
    "========================================"
  );
  console.log(
    "       ETH TRANSACTION CHECKER"
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

  // ======================================
  // ERC20 TOKEN
  // ======================================

  if (transfer) {
    const contract = tx.to;

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
      "Type         : ERC-20 Token Transfer"
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

  // ======================================
  // NATIVE ETH
  // ======================================

  else {
    const amount =
      formatETH(tx.value);

    console.log(
      "Type         : Native ETH Transfer"
    );

    console.log("");

    console.log(
      "Coin         : ETH"
    );

    console.log(
      `Amount       : ${amount} ETH`
    );

    console.log("");

    console.log(
      `From         : ${tx.from}`
    );

    console.log(
      `To           : ${tx.to || "Contract Creation"}`
    );
  }

  // ======================================
  // COMMON DATA
  // ======================================

  console.log("");

  console.log(
    `Block        : ${blockNumber}`
  );

  console.log(
    `Gas Used     : ${gasUsed}`
  );

  console.log(
    `Gas Fee      : ${gasFeeETH} ETH`
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
    "       ETH TRANSACTION CHECKER"
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
        "Enter TX Hash (or q to quit): "
      )
    ).trim();

    if (txHash.toLowerCase() === "q") {
      break;
    }

    if (
      !/^0x[a-fA-F0-9]{64}$/.test(
        txHash
      )
    ) {
      console.log(
        "\n❌ Invalid Ethereum transaction hash.\n"
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