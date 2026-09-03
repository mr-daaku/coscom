import readline from "node:readline";

const RPC_URL = "https://api.mainnet-beta.solana.com";

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
// SOLANA JSON RPC
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

function formatSOL(lamports) {
  const value = BigInt(lamports || 0);

  const whole = value / 1000000000n;
  const fraction = value % 1000000000n;

  if (fraction === 0n) {
    return whole.toString();
  }

  return `${whole}.${fraction
    .toString()
    .padStart(9, "0")
    .replace(/0+$/, "")}`;
}

function formatTokenAmount(amount, decimals) {
  const value = BigInt(amount || 0);

  if (decimals === 0) {
    return value.toString();
  }

  const divisor = 10n ** BigInt(decimals);

  const whole = value / divisor;
  const fraction = value % divisor;

  if (fraction === 0n) {
    return whole.toString();
  }

  return `${whole}.${fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "")}`;
}

// ========================================
// GET TOKEN ACCOUNT INFO
// ========================================

async function getTokenInfo(address) {
  try {
    const result = await rpc(
      "getAccountInfo",
      [
        address,
        {
          encoding: "jsonParsed",
        },
      ]
    );

    const value = result?.value;

    if (!value) {
      return null;
    }

    const parsed =
      value.data?.parsed;

    if (
      parsed?.type ===
      "account"
    ) {
      return parsed.info;
    }

    return null;
  } catch {
    return null;
  }
}

// ========================================
// MAIN CHECKER
// ========================================

async function checkTransaction(signature) {
  console.log(
    "\nChecking transaction...\n"
  );

  const result = await rpc(
    "getTransaction",
    [
      signature,
      {
        encoding: "jsonParsed",
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      },
    ]
  );

  if (!result) {
    console.log(
      "❌ Transaction not found."
    );
    return;
  }

  const meta = result.meta;

  if (!meta) {
    console.log(
      "❌ Transaction metadata unavailable."
    );
    return;
  }

  // ======================================
  // STATUS
  // ======================================

  const status =
    meta.err === null
      ? "✅ SUCCESS"
      : "❌ FAILED";

  console.log(
    "========================================"
  );

  console.log(
    "       SOLANA TRANSACTION CHECKER"
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
    `Signature    : ${signature}`
  );

  // ======================================
  // SLOT / BLOCK
  // ======================================

  console.log(
    `Slot         : ${result.slot}`
  );

  if (result.blockTime) {
    console.log(
      `Time         : ${new Date(
        result.blockTime * 1000
      ).toISOString()}`
    );
  }

  // ======================================
  // FEE
  // ======================================

  const fee =
    meta.fee || 0;

  console.log(
    `Fee          : ${formatSOL(
      fee
    )} SOL`
  );

  // ======================================
  // ACCOUNT KEYS
  // ======================================

  const accountKeys =
    result.transaction.message
      .accountKeys || [];

  // ======================================
  // SOL TRANSFERS
  // ======================================

  let solTransfers = [];

  const preBalances =
    meta.preBalances || [];

  const postBalances =
    meta.postBalances || [];

  for (
    let i = 0;
    i < accountKeys.length;
    i++
  ) {
    const account =
      typeof accountKeys[i] ===
      "string"
        ? accountKeys[i]
        : accountKeys[i].pubkey;

    const pre =
      BigInt(preBalances[i] || 0);

    const post =
      BigInt(postBalances[i] || 0);

    const difference =
      post - pre;

    if (
      difference !== 0n
    ) {
      solTransfers.push({
        address: account,
        change: difference,
      });
    }
  }

  // ======================================
  // TOKEN TRANSFERS
  // ======================================

  const tokenTransfers = [];

  const preToken =
    meta.preTokenBalances || [];

  const postToken =
    meta.postTokenBalances || [];

  const tokenMap = new Map();

  for (const item of preToken) {
    tokenMap.set(
      `${item.accountIndex}:${item.mint}`,
      {
        pre: item,
        post: null,
      }
    );
  }

  for (const item of postToken) {
    const key =
      `${item.accountIndex}:${item.mint}`;

    if (!tokenMap.has(key)) {
      tokenMap.set(key, {
        pre: null,
        post: item,
      });
    } else {
      tokenMap.get(key).post =
        item;
    }
  }

  for (const item of tokenMap.values()) {
    const preAmount = BigInt(
      item.pre?.uiTokenAmount
        ?.amount || "0"
    );

    const postAmount = BigInt(
      item.post?.uiTokenAmount
        ?.amount || "0"
    );

    const difference =
      postAmount - preAmount;

    if (
      difference === 0n
    ) {
      continue;
    }

    const decimals =
      item.post?.uiTokenAmount
        ?.decimals ??
      item.pre?.uiTokenAmount
        ?.decimals ??
      0;

    const owner =
      item.post?.owner ||
      item.pre?.owner ||
      "Unknown";

    const mint =
      item.post?.mint ||
      item.pre?.mint;

    tokenTransfers.push({
      mint,
      owner,
      amount: difference,
      decimals,
    });
  }

  // ======================================
  // DISPLAY TYPE
  // ======================================

  if (
    tokenTransfers.length > 0
  ) {
    console.log(
      `Type         : SPL Token Transfer`
    );

    console.log("");

    for (
      const token of tokenTransfers
    ) {
      console.log(
        `Token Mint   : ${token.mint}`
      );

      console.log(
        `Owner        : ${token.owner}`
      );

      const amount =
        formatTokenAmount(
          token.amount < 0n
            ? -token.amount
            : token.amount,
          token.decimals
        );

      const direction =
        token.amount > 0n
          ? "RECEIVED"
          : "SENT";

      console.log(
        `Amount       : ${amount}`
      );

      console.log(
        `Direction    : ${direction}`
      );

      console.log(
        `Decimals     : ${token.decimals}`
      );

      console.log("");
    }
  } else {
    // ====================================
    // NATIVE SOL
    // ====================================

    console.log(
      `Type         : Native SOL Transaction`
    );

    console.log("");

    for (
      const transfer of solTransfers
    ) {
      const amount =
        formatSOL(
          transfer.change < 0n
            ? -transfer.change
            : transfer.change
        );

      const direction =
        transfer.change > 0n
          ? "RECEIVED"
          : "SENT";

      console.log(
        `Address      : ${transfer.address}`
      );

      console.log(
        `Amount       : ${amount} SOL`
      );

      console.log(
        `Direction    : ${direction}`
      );

      console.log("");
    }
  }

  // ======================================
  // PROGRAMS
  // ======================================

  const instructions =
    result.transaction.message
      .instructions || [];

  const programs = [];

  for (
    const instruction of instructions
  ) {
    if (instruction.program) {
      programs.push(
        instruction.program
      );
    }
  }

  if (programs.length > 0) {
    console.log(
      `Programs     : ${[
        ...new Set(programs)
      ].join(", ")}`
    );
  }

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
    "       SOLANA TRANSACTION CHECKER"
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
    const signature = (
      await ask(
        "Enter SOL TX Signature (or q to quit): "
      )
    ).trim();

    if (
      signature.toLowerCase() === "q"
    ) {
      break;
    }

    if (
      !/^[1-9A-HJ-NP-Za-km-z]{32,100}$/.test(
        signature
      )
    ) {
      console.log(
        "\n❌ Invalid Solana transaction signature.\n"
      );

      continue;
    }

    try {
      await checkTransaction(
        signature
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