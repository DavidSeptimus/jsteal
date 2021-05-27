import { Expr } from "./Expr";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { requireType, TealType } from "./Types";
import { Op, Ops } from "../ir/Ops";
import { TealBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";

export class BinaryExpr extends Expr {
  public constructor(
    public op: Op,
    inputType: TealType | [TealType, TealType],
    public outputType: TealType,
    public argLeft: Expr,
    public argRight: Expr
  ) {
    super();

    const leftType =
      inputType instanceof Array
        ? (inputType as TealType[])[0]
        : (inputType as TealType);

    const rightType =
      inputType instanceof Array
        ? (inputType as TealType[])[1]
        : (inputType as TealType);
    requireType(argLeft.typeOf(), leftType);
    requireType(argRight.typeOf(), rightType);
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, this.op);
    return TealBlock.fromOp(options, op, [this.argLeft, this.argRight]);
  }

  public typeOf(): TealType {
    return this.outputType;
  }

  public toString(): string {
    return `(${this.op} ${this.argLeft} ${this.argRight})`;
  }
}

/**
 * Add two numbers. Produces left + right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Add(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.add, TealType.uint64, TealType.uint64, left, right);
}

/**
 * Subtract two numbers. Produces left - right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Minus(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(
    Ops.minus,
    TealType.uint64,
    TealType.uint64,
    left,
    right
  );
}

/**
 * Multiply two numbers. Produces left * right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Mul(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.mul, TealType.uint64, TealType.uint64, left, right);
}

/**
 * Divide two numbers. Produces left / right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Div(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.div, TealType.uint64, TealType.uint64, left, right);
}

/**
 * Modulo expression. Produces left % right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Mod(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.mod, TealType.uint64, TealType.uint64, left, right);
}

/**
 * Bitwise and expression. Produces left & right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function BitwiseAnd(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(
    Ops.bitwise_and,
    TealType.uint64,
    TealType.uint64,
    left,
    right
  );
}

/**
 * Bitwise or expression. Produces left | right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function BitwiseOr(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(
    Ops.bitwise_or,
    TealType.uint64,
    TealType.uint64,
    left,
    right
  );
}

/**
 * Bitwise xor expression. Produces left ^ right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function BitwiseXor(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(
    Ops.bitwise_xor,
    TealType.uint64,
    TealType.uint64,
    left,
    right
  );
}

/**
 * Equality expression. Checks if left == right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Eq(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.eq, right.typeOf(), TealType.uint64, left, right);
}

/**
 * "Difference expression. Checks if left != right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Neq(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.neq, right.typeOf(), TealType.uint64, left, right);
}

/**
 * Less than expression. Checks if left < right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Lt(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.lt, TealType.uint64, TealType.uint64, left, right);
}

/**
 * Less than or equal to expression. Checks if left <= right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Le(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.le, TealType.uint64, TealType.uint64, left, right);
}

/**
 * Greater than expression. Checks if left > right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Gt(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.gt, TealType.uint64, TealType.uint64, left, right);
}

/**
 * Greater than or equal to expression. Checks if left >= right.
 *
 * @param left Must evaluate to uint64.
 * @param right Must evaluate to uint64.
 */
export function Ge(left: Expr, right: Expr): BinaryExpr {
  return new BinaryExpr(Ops.ge, TealType.uint64, TealType.uint64, left, right);
}

/**
 * Get the bit value of an expression at a specific index.
 * The meaning of index differs if value is an integer or a byte string.
 *
 *   * For integers, bit indexing begins with low-order bits. For example, :code:`GetBit(Int(16), Int(4))`
 *     yields 1. Any other valid index would yield a bit value of 0. Any integer less than 64 is a
 *     valid index.
 *
 *   * For byte strings, bit indexing begins at the first byte. For example, :code:`GetBit(Bytes("base16", "0xf0"), Int(0))`
 *     yields 1. Any index less than 4 would yield 1, and any valid index 4 or greater would yield 0.
 *     Any integer less than 8*Len(value) is a valid index.
 *
 * Requires TEAL version 3 or higher.
 * @param value The value containing bits. Can evaluate to any type.
 * @param index The index of the bit to extract. Must evaluate to uint64.
 */
export function GetBit(value: Expr, index: Expr): BinaryExpr {
  return new BinaryExpr(
    Ops.getbit,
    [TealType.anytype, TealType.uint64],
    TealType.uint64,
    value,
    index
  );
}

/**
 * Extract a single byte as an integer from a byte string.
 *
 * Similar to GetBit, indexing begins at the first byte. For example, :code:`GetByte(Bytes("base16", "0xff0000"), Int(0))`
 * yields 255. Any other valid index would yield 0.
 *
 * Requires TEAL version 3 or higher.
 *
 * @param value The value containing the bytes. Must evaluate to bytes.
 * @param index The index of the byte to extract. Must evaluate to an integer less than Len(value).
 */
export function GetByte(value: Expr, index: Expr): BinaryExpr {
  return new BinaryExpr(
    Ops.getbyte,
    [TealType.bytes, TealType.uint64],
    TealType.uint64,
    value,
    index
  );
}
