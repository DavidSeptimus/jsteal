import { Expr } from "./Expr";
import { Op, Ops } from "../ir/Ops";
import { requireType, TealType } from "./Types";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";

/**
 * An expression with a single argument.
 */
export class UnaryExpr extends Expr {
  public constructor(
    public op: Op,
    inputType: TealType,
    public outputType: TealType,
    public arg: Expr
  ) {
    super();
    requireType(arg.typeOf(), inputType);
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, this.op);
    return TealBlock.fromOp(options, op, [this.arg]);
  }

  public typeOf(): TealType {
    return this.outputType;
  }

  public toString(): string {
    return `(${this.op} ${this.arg})`;
  }
}

/**
 * Convert a byte string to a uint64.
 **/
export function Btoi(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.btoi, TealType.bytes, TealType.uint64, arg);
}

/**
 * Convert a uint64 string to a byte string.
 **/
export function Itob(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.itob, TealType.uint64, TealType.bytes, arg);
}

/**
 * Get the length of a byte string.
 **/
export function Len(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.len, TealType.bytes, TealType.uint64, arg);
}

/**
 * Get the SHA-256 hash of a byte string.
 **/
export function Sha256(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.sha256, TealType.bytes, TealType.bytes, arg);
}

/**
 * Get the SHA-512/256 hash of a byte string.
 **/
export function Sha512_256(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.sha512_256, TealType.bytes, TealType.bytes, arg);
}

/**
 *Get the KECCAK-256 hash of a byte string.
 **/
export function Keccak256(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.keccak256, TealType.bytes, TealType.bytes, arg);
}

/**
 * Get the logical inverse of a uint64.
 *
 *If the argument is 0, then this will produce 1. Otherwise this will produce 0.
 **/
export function Not(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.logic_not, TealType.uint64, TealType.uint64, arg);
}

/**
 *Get the bitwise inverse of a uint64.
 *
 * Produces ~arg.
 **/
export function BitwiseNot(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.bitwise_not, TealType.uint64, TealType.uint64, arg);
}

/**
 * Pop a value from the stack.
 **/
export function Pop(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.pop, TealType.anytype, TealType.none, arg);
}

/**
 * Immediately exit the program with the given success value.
 **/
export function Return(arg: Expr): UnaryExpr {
  return new UnaryExpr(Ops.return_, TealType.uint64, TealType.none, arg);
}

/**
 * Get the balance of a user in microAlgos.
 *
 * Argument must be an index into Txn.Accounts that corresponds to the account to read from. It
 * must evaluate to uint64.
 *
 * This operation is only permitted in application mode.
 **/
export function Balance(account: Expr): UnaryExpr {
  return new UnaryExpr(Ops.balance, TealType.uint64, TealType.uint64, account);
}

/**
 * Get the minimum balance of a user in microAlgos.
 *
 * For more information about minimum balances, see: https://developer.algorand.org/docs/features/accounts/#minimum-balance
 *
 * Argument must be an index into Txn.Accounts that corresponds to the account to read from. It
 * must evaluate to uint64.
 *
 *Requires TEAL version 3 or higher. This operation is only permitted in application mode.
 **/
export function MinBalance(account: Expr): UnaryExpr {
  return new UnaryExpr(
    Ops.min_balance,
    TealType.uint64,
    TealType.uint64,
    account
  );
}
