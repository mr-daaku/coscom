import readline from "node:readline";
import crypto from "node:crypto";

const API_URL = "https://toncenter.com/api/v3";

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
// TON CENTER V3
// ========================================

async function api(endpoint, params = {}) {
  const url = new URL(`${API_URL}/${endpoint}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();

    throw new Error(
      `HTTP ${response.status}: ${text}`
    );
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}

// ========================================
// TON FORMAT
// ========================================

function formatTON(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "0";
  }

  const nano = BigInt(value);

  const whole = nano / 1000000000n;
  const fraction = nano % 1000000000n;

  if (fraction === 0n) {
    return whole.toString();
  }

  return `${whole}.${fraction
    .toString()
    .padStart(9, "0")
    .replace(/0+$/, "")}`;
}

// ========================================
// ADDRESS HELPERS
// ========================================

const TON_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

// CRC16-CCITT
function crc16(data) {
  let crc = 0;

  for (const byte of data) {
    crc ^= byte << 8;

    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc =
          ((crc << 1) ^ 0x1021) &
          0xffff;
      } else {
        crc =
          (crc << 1) & 0xffff;
      }
    }
  }

  return crc;
}

function base64url(bytes) {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Convert raw TON address:
// 0:ABCDEF... -> EQ...
async function rawToFriendly(raw) {
  if (!raw) {
    return "N/A";
  }

  if (
    raw.startsWith("EQ") ||
    raw.startsWith("UQ") ||
    raw.startsWith("kQ") ||
    raw.startsWith("0Q")
  ) {
    return raw;
  }

  const match = raw.match(
    /^(-?\d+):([0-9a-fA-F]{64})$/
  );

  if (!match) {
    return raw;
  }

  const workchain =
    Number(match[1]);

  const hash = Buffer.from(
    match[2],
    "hex"
  );

  const tag = 0x11;

  const address = Buffer.alloc(34);

  address[0] = tag;

  address[1] =
    workchain & 0xff;

  hash.copy(address, 2);

  const checksum =
    crc16(address);

  const result = Buffer.alloc(36);

  address.copy(result, 0);

  result.writeUInt16BE(
    checksum,
    34
  );

  return base64url(result);
}

// ========================================
// MEMO / COMMENT
// ========================================

// TON text_comment opcode:
// 0x00000000 + UTF-8 text

function decodeCommentFromBody(body) {
  if (!body) {
    return "N/A";
  }

  let hex = body;

  if (typeof hex !== "string") {
    return "N/A";
  }

  hex = hex.replace(/^0x/, "");

  // text_comment opcode
  if (
    !hex
      .toLowerCase()
      .startsWith("00000000")
  ) {
    return "N/A";
  }

  const commentHex =
    hex.slice(8);

  if (!commentHex) {
    return "N/A";
  }

  try {
    return Buffer.from(
      commentHex,
      "hex"
    )
      .toString("utf8")
      .replace(/\0/g, "")
      .trim() || "N/A";
  } catch {
    return "N/A";
  }
}

// ========================================
// COMMENT FROM OUT MESSAGE
// ========================================

function getMessageComment(msg) {
  if (!msg) {
    return "N/A";
  }

  // Some V3 responses provide decoded body
  if (msg.message) {
    return msg.message;
  }

  if (msg.comment) {
    return msg.comment;
  }

  if (msg.body) {
    return decodeCommentFromBody(
      msg.body
    );
  }

  return "N/A";
}

// ========================================
// CHECK TRANSACTION
// ========================================

async function checkTransaction(txHash) {
  console.log(
    "\nChecking transaction...\n"
  );

  const data = await api(
    "transactions",
    {
      hash: txHash,
      limit: 1,
    }
  );

  const transactions =
    data.transactions || [];

  if (
    transactions.length === 0
  ) {
    console.log(
      "❌ Transaction not found."
    );

    return;
  }

  const tx =
    transactions[0];

  const description =
    tx.description || {};

  const compute =
    description.compute_ph || {};

  const action =
    description.action || {};

  // ======================================
  // STATUS
  // ======================================

  let status = "⏳ UNKNOWN";

  if (
    description.aborted === true ||
    compute.success === false ||
    action.success === false
  ) {
    status = "❌ FAILED";
  } else if (
    compute.success === true ||
    action.success === true ||
    description.aborted === false
  ) {
    status = "✅ SUCCESS";
  }

  // ======================================
  // HEADER
  // ======================================

  console.log(
    "========================================"
  );

  console.log(
    "          TON TRANSACTION CHECKER"
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
    `Transaction  : ${txHash}`
  );

  console.log(
    `Account      : ${await rawToFriendly(
      tx.account
    )}`
  );

  console.log(
    `LT           : ${tx.lt || "N/A"}`
  );

  if (tx.now) {
    console.log(
      `Time         : ${new Date(
        tx.now * 1000
      ).toISOString()}`
    );
  }

  // ======================================
  // INCOMING
  // ======================================

  const inMsg =
    tx.in_msg;

  if (inMsg) {
    const from =
      await rawToFriendly(
        inMsg.source
      );

    const to =
      await rawToFriendly(
        inMsg.destination
      );

    console.log("");

    console.log(
      "Type         : Incoming Transaction"
    );

    console.log("");

    console.log(
      `From         : ${from}`
    );

    console.log(
      `To           : ${to}`
    );

    console.log(
      `Amount       : ${
        inMsg.value
          ? formatTON(inMsg.value)
          : "0"
      } TON`
    );

    console.log(
      `Memo         : ${getMessageComment(
        inMsg
      )}`
    );
  }

  // ======================================
  // OUTGOING
  // ======================================

  const outMsgs =
    tx.out_msgs || [];

  if (
    outMsgs.length > 0
  ) {
    console.log("");

    console.log(
      `Outgoing     : ${outMsgs.length} message(s)`
    );

    console.log("");

    for (
      let i = 0;
      i < outMsgs.length;
      i++
    ) {
      const msg =
        outMsgs[i];

      const from =
        await rawToFriendly(
          msg.source ||
            tx.account
        );

      const to =
        await rawToFriendly(
          msg.destination
        );

      console.log(
        `--- Outgoing #${i + 1} ---`
      );

      console.log(
        `From         : ${from}`
      );

      console.log(
        `To           : ${to}`
      );

      console.log(
        `Amount       : ${
          msg.value
            ? formatTON(msg.value)
            : "0"
        } TON`
      );

      console.log(
        `Memo         : ${getMessageComment(
          msg
        )}`
      );

      if (msg.decoded_opcode) {
        console.log(
          `Opcode       : ${msg.decoded_opcode}`
        );
      }

      console.log("");
    }
  }

  // ======================================
  // FEES
  // ======================================

  console.log(
    `Total Fee    : ${formatTON(
      tx.total_fees
    )} TON`
  );

  if (compute) {
    console.log(
      `Gas Fee      : ${formatTON(
        compute.gas_fees
      )} TON`
    );

    console.log(
      `Gas Used     : ${
        compute.gas_used ??
        "N/A"
      }`
    );
  } else {
    console.log(
      "Gas Fee      : N/A"
    );

    console.log(
      "Gas Used     : N/A"
    );
  }

  if (
    description.storage_ph
  ) {
    console.log(
      `Storage Fee  : ${formatTON(
        description.storage_ph
          .storage_fees_collected
      )} TON`
    );
  } else {
    console.log(
      "Storage Fee  : N/A"
    );
  }

  if (action) {
    console.log(
      `Action Fee   : ${formatTON(
        action.total_action_fees
      )} TON`
    );
  } else {
    console.log(
      "Action Fee   : N/A"
    );
  }

  // ======================================
  // BLOCK
  // ======================================

  if (tx.block_ref) {
    console.log("");

    console.log(
      `Workchain    : ${
        tx.block_ref.workchain ??
        "N/A"
      }`
    );

    console.log(
      `Shard        : ${
        tx.block_ref.shard ??
        "N/A"
      }`
    );

    console.log(
      `Block        : ${
        tx.block_ref.seqno ??
        "N/A"
      }`
    );
  }

  if (tx.trace_id) {
    console.log(
      `Trace ID     : ${tx.trace_id}`
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
    "          TON TRANSACTION CHECKER"
  );

  console.log(
    "========================================"
  );

  console.log("");

  console.log(
    `API: ${API_URL}`
  );

  console.log(
    "API key: Not used"
  );

  console.log(
    "Limit: 1 request/sec"
  );

  console.log("");

  while (true) {
    const txHash = (
      await ask(
        "Enter TON TX Hash (or q to quit): "
      )
    ).trim();

    if (
      txHash.toLowerCase() ===
      "q"
    ) {
      break;
    }

    if (!txHash) {
      console.log(
        "\n❌ Transaction hash required.\n"
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