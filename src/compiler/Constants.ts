import { TealComponent } from "../ir/TealComponent";
import { TealOp } from "../ir/TealOp";
import { TealInternalError } from "../Errors";
import { correctBase32Padding, unescapeString } from "../Util";
import encoding from "algosdk";
import { Ops } from "../ir/Ops";
import base32 from "hi-base32";
import { Buffer } from "buffer/";

export const intEnumValues = new Map<string, number>([
  // OnComplete values
  ["NoOp", 0],
  ["OptIn", 1],
  ["CloseOut", 2],
  ["ClearState", 3],
  ["UpdateApplication", 4],
  ["DeleteApplication", 5],
  // TxnType values
  ["unknown", 0],
  ["pay", 1],
  ["keyreg", 2],
  ["acfg", 3],
  ["axfer", 4],
  ["afrz", 5],
  ["appl", 6],
]);

/**
 * Extract the constant value being loaded by a TealOp whose op is Op.int.
 *
 * @param op
 * @return If the op is loading a template variable, returns the name of the variable as a string.
 * Otherwise, returns the integer that the op is loading.
 */
export function extractIntValue(op: TealOp): string | bigint {
  if (
    op.args.length != 1 ||
    (typeof op.args[0] !== "bigint" && typeof op.args[0] !== "string")
  ) {
    throw new TealInternalError(`"Unexpected args in int opcode: ${op.args}`);
  }

  const value = op.args[0];
  if (
    typeof value === "bigint" ||
    (typeof value === "string" && (value as string).startsWith("TMPL_"))
  ) {
    return value;
  }
  if (typeof value === "string" && intEnumValues.get(value) == null) {
    throw new TealInternalError(`Int constant not recognized: ${value}`);
  }
  return BigInt(intEnumValues.get(value as string));
}

/**
 * Extract the constant value being loaded by a TealOp whose op is Op.byte.
 * @param op
 *
 * @return If the op is loading a template variable, returns the name of the variable as a string.
 * Otherwise, returns the byte string that the op is loading.
 */
export function extractBytesValue(op: TealOp): string | Uint8Array {
  if (op.args.length !== 1 || typeof op.args[0] !== "string") {
    throw new TealInternalError(`Unexpected args in byte opcode: ${op.args}`);
  }

  const value = op.args[0] as string;
  if (value.startsWith("TMPL_")) {
    return value;
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    return Uint8Array.from(Buffer.from(unescapeString(value), "utf8"));
  }
  if (value.startsWith("0x")) {
    return Uint8Array.from(Buffer.from(value.slice(2), "hex"));
  }
  if (value.startsWith("base32(")) {
    return Uint8Array.from(
      base32.decode.asBytes(
        correctBase32Padding(value.slice("base32(".length, -1))
      )
    );
  }
  if (value.startsWith("base64(")) {
    return Uint8Array.from(
      Buffer.from(value.slice("base64(".length, -1), "base64")
    );
  }

  throw new TealInternalError(`Unexpected format for byte value: ${value}`);
}

/**
 * Extract the constant value being loaded by a TealOp whose op is Op.addr.
 *
 * @param op
 * @return  If the op is loading a template variable, returns the name of the variable as a string.
 * Otherwise, returns the bytes of the public key of the address that the op is loading.
 */
export function extractAddrValue(op: TealOp): string | Uint8Array {
  if (op.args.length != 1 || typeof op.args[0] != "string") {
    throw new TealInternalError(`Unexpected args in addr opcode: ${op.args}`);
  }

  const value = op.args[0] as string;
  if (!value.startsWith("TMPL_")) {
    return encoding.decodeAddress(value).publicKey;
  }

  return value;
}

/**
 * Convert TEAL code from using pseudo-ops for constants to using assembled constant blocks.
 * This conversion will assemble constants to be as space-efficient as possible.
 *
 * @param ops ops: A list of TealComponents to convert.
 * @return  A list of TealComponent that are functionally the same as the input, but with all constants
 * loaded either through blocks or the `pushint`/`pushbytes` single-use ops.
 */
export function createConstantBlocks(
  ops: Array<TealComponent>
): Array<TealComponent> {
  const intFreqs = new Map<string | bigint, number>();
  const byteFreqs = new Map<string | Uint8Array, number>();

  for (const op of ops) {
    if (!(op instanceof TealOp)) {
      continue;
    }

    const basicOp = op.op;

    if (basicOp == Ops.int) {
      const intValue = extractIntValue(op);
      intFreqs.set(intValue, (intFreqs.get(intValue) || 0) + 1);
    } else if (basicOp == Ops.byte) {
      const byteValue = extractBytesValue(op);
      const byteHex = tryEncodeHexString(byteValue);
      byteFreqs.set(byteHex, (byteFreqs.get(byteHex) || 0) + 1);
    } else if (basicOp == Ops.addr) {
      const addrValue = extractAddrValue(op);
      const addrHex = tryEncodeHexString(addrValue);
      byteFreqs.set(addrHex, (byteFreqs.get(addrHex) || 0) + 1);
    }
  }

  const assembled = [];
  const sortedInts = Array.from(intFreqs.keys()).sort(
    (k1, k2) =>
      (intFreqs.get(k2) || 0) - (intFreqs.get(k1) || 0) ||
      -k1.toString().localeCompare(k2.toString())
  );

  const sortedBytes = Array.from(byteFreqs.keys()).sort(
    (k1, k2) =>
      (byteFreqs.get(k2) || 0) - (byteFreqs.get(k1) || 0) ||
      -tryEncodeHexString(k1).localeCompare(tryEncodeHexString(k2))
  );

  // byteBlock = [('0x'+cast(bytes, b).hex()) if type(b) == bytes else cast(str, b) for b in sortedBytes if byteFreqs[b] > 1]

  const intBlock = sortedInts.filter((i) => (intFreqs.get(i) || 0) > 1);
  const byteBlock = sortedBytes
    .filter((b) => (byteFreqs.get(b) || 0) > 1)
    .map(tryEncodeHexString);

  if (intBlock.length !== 0) {
    assembled.push(new TealOp(undefined, Ops.intcblock, [...intBlock]));
  }

  if (byteBlock.length !== 0) {
    assembled.push(new TealOp(undefined, Ops.bytecblock, [...byteBlock]));
  }

  for (const op of ops) {
    if (op instanceof TealOp) {
      const basicOp = op.op;

      if (basicOp === Ops.int) {
        const intValue = extractIntValue(op);
        if (intFreqs.get(intValue) === 1) {
          assembled.push(
            new TealOp(op.expr, Ops.pushint, [intValue, "//", ...op.args])
          );
          continue;
        }

        const index = sortedInts.indexOf(intValue);
        switch (index) {
        case 0: {
          assembled.push(new TealOp(op.expr, Ops.intc_0, ["//", ...op.args]));
          break;
        }
        case 1: {
          assembled.push(new TealOp(op.expr, Ops.intc_1, ["//", ...op.args]));
          break;
        }
        case 2: {
          assembled.push(new TealOp(op.expr, Ops.intc_2, ["//", ...op.args]));
          break;
        }
        case 3: {
          assembled.push(new TealOp(op.expr, Ops.intc_3, ["//", ...op.args]));
          break;
        }
        default: {
          assembled.push(
            new TealOp(op.expr, Ops.intc, [index, "//", ...op.args])
          );
          break;
        }
        }
        continue;
      }

      if (basicOp === Ops.byte || basicOp === Ops.addr) {
        const byteValue =
          basicOp === Ops.byte ? extractBytesValue(op) : extractAddrValue(op);
        const byteHex = tryEncodeHexString(byteValue);
        if (byteFreqs.get(byteHex) === 1) {
          assembled.push(
            new TealOp(op.expr, Ops.pushbytes, [byteHex, "//", ...op.args])
          );
          continue;
        }

        const index = sortedBytes
          .map(tryEncodeHexString)
          .indexOf(tryEncodeHexString(byteValue));
        switch (index) {
        case 0: {
          assembled.push(
            new TealOp(op.expr, Ops.bytec_0, ["//", ...op.args])
          );
          break;
        }
        case 1: {
          assembled.push(
            new TealOp(op.expr, Ops.bytec_1, ["//", ...op.args])
          );
          break;
        }
        case 2: {
          assembled.push(
            new TealOp(op.expr, Ops.bytec_2, ["//", ...op.args])
          );
          break;
        }
        case 3: {
          assembled.push(
            new TealOp(op.expr, Ops.bytec_3, ["//", ...op.args])
          );
          break;
        }
        default: {
          assembled.push(
            new TealOp(op.expr, Ops.bytec, [index, "//", ...op.args])
          );
          break;
        }
        }
        continue;
      }
    }
    assembled.push(op);
  }
  return assembled;
}

function hex(s: Uint8Array): string {
  return Buffer.from(s).toString("hex");
}

function tryEncodeHexString(b: string | Uint8Array) {
  return b instanceof Uint8Array ? `0x${hex(b)}` : b;
}
