import { Op, Ops } from "../ir/Ops";
import { requireType, TealType } from "./Types";
import { Expr } from "./Expr";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";

/**
 * An expression with three arguments.
 */
export class TernaryExpr extends Expr {
  public constructor(
    public op: Op,
    inputTypes: [TealType, TealType, TealType],
    public outputType: TealType,
    public firstArg: Expr,
    public secondArg: Expr,
    public thirdArg: Expr
  ) {
    super();
    requireType(firstArg.typeOf(), inputTypes[0]);
    requireType(secondArg.typeOf(), inputTypes[1]);
    requireType(thirdArg.typeOf(), inputTypes[2]);
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, this.op);
    return TealBlock.fromOp(options, op, [
      this.firstArg,
      this.secondArg,
      this.thirdArg,
    ]);
  }

  public typeOf(): TealType {
    return this.outputType;
  }

  public toString(): string {
    return `(${this.op} ${this.firstArg} ${this.secondArg} ${this.thirdArg})`;
  }
}

/**
 * Verify the ed25519 signature of the concatenation ("ProgData" + hash_of_current_program + data).
 *
 * @param {Expr} data The data signed by the public key. Must evaluate to bytes.
 * @param {Expr} sig The proposed 64-byte signature of the concatenation ("ProgData" + hash_of_current_program + data).
 * Must evaluate to bytes.
 * @param {Expr} key The 32 byte public key that produced the signature. Must evaluate to bytes.
 * @return {TernaryExpr}
 */
export function ed25519Verify(data: Expr, sig: Expr, key: Expr): TernaryExpr {
  return new TernaryExpr(
    Ops.ed25519Verify,
    [TealType.bytes, TealType.bytes, TealType.bytes],
    TealType.uint64,
    data,
    sig,
    key
  );
}

/**
 * Take a substring of a byte string.
 *
 * Produces a new byte string consisting of the bytes starting at start up to but not including end.
 *
 * @param {Expr} string The byte string.
 * @param {Expr} start The starting index for the substring. Must be an integer less than or equal to string.length.
 * @param {Expr} end The ending index for the substring. Must be an integer greater or equal to start, but
 * less than or equal to string.length.
 * @return {TernaryExpr}
 */
export function substring(string: Expr, start: Expr, end: Expr): TernaryExpr {
  return new TernaryExpr(
    Ops.substring3,
    [TealType.bytes, TealType.uint64, TealType.uint64],
    TealType.bytes,
    string,
    start,
    end
  );
}

/**
 * Set the bit value of an expression at a specific index.
 *
 * The meaning of index differs if value is an integer or a byte string.
 *
 * * For integers, bit indexing begins with low-order bits. For example, `setBit(new Int(0), new Int(4), new Int(1))`
 *   yields the integer 16 (2^4). Any integer less than 64 is a valid index.
 *
 * * For byte strings, bit indexing begins at the first byte.
 *   For example, `setBit(new Bytes("base16", "0x00"), new Int(7), new Int(1))`
 *   yields the byte string 0x01. Any integer less than 8*value.length is a valid index.
 *
 * Requires TEAL version 3 or higher.
 * @param {Expr} value The value containing bits. Can evaluate to any type.
 * @param {Expr} index The index of the bit to set. Must evaluate to uint64.
 * @param {Expr} newBitValue The new bit value to set. Must evaluate to the integer 0 or 1.
 * @return {TernaryExpr}
 */
export function setBit(
  value: Expr,
  index: Expr,
  newBitValue: Expr
): TernaryExpr {
  return new TernaryExpr(
    Ops.setbit,
    [TealType.anytype, TealType.uint64, TealType.uint64],
    value.typeOf(),
    value,
    index,
    newBitValue
  );
}

/**
 * Set a single byte in a byte string from an integer value.
 *
 * Similar to SetBit, indexing begins at the first byte.
 *
 * Requires TEAL version 3 or higher.
 *
 * @example
 * `setByte(new Bytes("base16", "0x000000"), new Int(0), new Int(255))` yields the byte string 0xff0000.
 *
 * @param {Expr} value The value containing the bytes. Must evaluate to bytes.
 * @param {Expr} index  The index of the byte to set. Must evaluate to an integer less than Len(value).
 * @param {Expr} newByteValue The new byte value to set. Must evaluate to an integer less than 256.
 * @return {TernaryExpr}
 */
export function setByte(
  value: Expr,
  index: Expr,
  newByteValue: Expr
): TernaryExpr {
  return new TernaryExpr(
    Ops.setbyte,
    [TealType.bytes, TealType.uint64, TealType.uint64],
    TealType.bytes,
    value,
    index,
    newByteValue
  );
}
