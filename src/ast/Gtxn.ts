/**
 * An expression that accesses a transaction field from a transaction in the current group.
 */
import {
  TealInputError,
  verifyFieldVersion,
  verifyTealVersion,
} from "../Errors";
import { TealOp } from "../ir/TealOp";
import { Ops } from "../ir/Ops";
import { TealBlock } from "../ir/TealBlock";
import { requireInt } from "../Util";
import { MAX_GROUP_SIZE } from "../Config";
import { requireType, TealType } from "./Types";
import { TxnaExpr, TxnExpr, TxnField, TxnObject } from "./Txn";
import Expr from "./Expr";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";

export class GtxnExpr extends TxnExpr {
  public constructor(public txnIndex: number | Expr, field: TxnField) {
    super(field);
    if (typeof txnIndex === "number") {
      requireInt(txnIndex);
    }
  }

  public teal(options: CompileOptions): CompiledExpr {
    verifyFieldVersion(
      this.field.argName,
      this.field.minVersion,
      options.version
    );

    if (typeof this.txnIndex === "number") {
      const op = new TealOp(this, Ops.gtxn, [
        this.txnIndex,
        this.field.argName,
      ]);
      return TealBlock.fromOp(options, op);
    }

    verifyTealVersion(
      Ops.gtxns.minVersion,
      options.version,
      "TEAL version too low to index Gtxn with dynamic values"
    );

    const op = new TealOp(this, Ops.gtxns, [this.field.argName]);
    return TealBlock.fromOp(options, op, [this.txnIndex]);
  }

  public toString(): string {
    return `(Gtxn ${this.txnIndex} ${this.field.argName})`;
  }
}

/**
 * An expression that accesses a transaction array field from a transaction in the current group.
 */
export class GtxnaExpr extends TxnaExpr {
  public constructor(
    public txnIndex: number | Expr,
    field: TxnField,
    index: number
  ) {
    super(field, index);
    if (typeof txnIndex === "number") {
      requireInt(txnIndex);
    }
  }

  public teal(options: CompileOptions): CompiledExpr {
    verifyFieldVersion(
      this.field.argName,
      this.field.minVersion,
      options.version
    );

    if (typeof this.txnIndex === "number") {
      const op = new TealOp(this, Ops.gtxna, [
        this.txnIndex,
        this.field.argName,
        this.index,
      ]);
      return TealBlock.fromOp(options, op);
    }

    verifyTealVersion(
      Ops.gtxna.minVersion,
      options.version,
      "TEAL version too low to index Gtxna with dynamic values"
    );

    const op = new TealOp(this, Ops.gtxnsa, [this.field.argName, this.index]);
    return TealBlock.fromOp(options, op, [this.txnIndex]);
  }

  public toString(): string {
    return `(Gtxna ${this.txnIndex} ${this.field.argName} ${this.index})`;
  }
}

/**
 * Represents a group of transactions.
 */
export class TxnGroup {
  public getItem(txnIndex: number | Expr): TxnObject {
    if (typeof txnIndex === "number") {
      requireInt(txnIndex);
      if (txnIndex < 0 || txnIndex >= MAX_GROUP_SIZE) {
        throw new TealInputError(
          `Invalid Gtxn index ${txnIndex}, should be in [0, ${MAX_GROUP_SIZE})`
        );
      }
    } else {
      requireType((txnIndex as Expr).typeOf(), TealType.uint64);
    }
    return new TxnObject(
      (field) => new GtxnExpr(txnIndex, field),
      (field, index) => new GtxnaExpr(txnIndex, field, index)
    );
  }
}

export const Gtxn = new TxnGroup();
