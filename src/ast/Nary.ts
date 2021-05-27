import { Expr } from "./Expr";
import { Op, Ops } from "../ir/Ops";
import { requireType, TealType } from "./Types";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealInputError } from "../Errors";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";

/**
 * N-ary expression base class.
 *
 * This type of expression takes an arbitrary number of arguments.
 */
export class NaryExpr extends Expr {
  /**
   * Creates an N-ary expression
   *
   * @param {Op} op
   * @param {TealType} inputType The type of the child expressions in args
   * @param {TealType} outputType
   * @param {Array<Expr>} args must contain at least two child expressions
   */
  public constructor(
    public op: Op,
    inputType: TealType,
    public outputType: TealType,
    public args: Array<Expr>
  ) {
    super();

    if (args.length < 2) {
      throw new TealInputError("NaryExpr requires at least two children.");
    }
    args.forEach((arg) => requireType(arg.typeOf(), inputType));
  }

  public teal(options: CompileOptions): CompiledExpr {
    let start = null;
    let end = null;

    for (let i = 0; i < this.args.length; i++) {
      const { argStart, argEnd } = this.args[i].teal(options);
      if (i == 0) {
        start = argStart;
        end = argEnd;
      } else {
        (end as TealSimpleBlock).nextBlock = argStart;
        const opBlock = new TealSimpleBlock([new TealOp(this, this.op)]);
        argEnd.nextBlock = opBlock;
        end = opBlock;
      }
    }
    return { argStart: start as TealBlock, argEnd: end as TealSimpleBlock };
  }

  public typeOf(): TealType {
    return this.outputType;
  }

  public toString(): string {
    let retStr = "(" + this.op.toString();
    for (const a of this.args) {
      retStr += " " + a.toString();
    }
    retStr += ")";
    return retStr;
  }
}

/**
 * "Logical and expression.
 *
 * Produces 1 if all arguments are nonzero. Otherwise produces 0.
 *
 * All arguments must be PyTeal expressions that evaluate to uint64, and there must be at least two
 * arguments.
 *
 * @example And(Txn.amount() == new Int(500), Txn.fee() <= new Int(10));
 * @param {Array<Expr>} args  the logical operands
 * @return {NaryExpr}
 */
export function And(args: Array<Expr>): NaryExpr {
  return new NaryExpr(Ops.logic_and, TealType.uint64, TealType.uint64, args);
}

/**
 * Logical or expression.
 *
 * Produces 1 if any argument is nonzero. Otherwise produces 0.
 *
 * All arguments must be PyTeal expressions that evaluate to uint64, and there must be at least two arguments.
 *
 * @param {Array<Expr>} args the logical operands
 * @return {NaryExpr}
 */
export function Or(args: Array<Expr>): NaryExpr {
  return new NaryExpr(Ops.logic_or, TealType.uint64, TealType.uint64, args);
}

/**
 *
 * Concatenate byte strings.
 *
 * Produces a new byte string consisting of the contents of each of the passed in byte strings
 * joined together.
 *
 * All arguments must be PyTeal expressions that evaluate to bytes, and there must be at least two
 * arguments.
 *
 * @example
 * Concat(new Bytes("hello"), new Bytes(" "), new Bytes("world"));
 *
 * @param {Array<Expr>} args The array of expressions to concatenate
 * @return {NaryExpr}
 */
export function Concat(args: Array<Expr>): NaryExpr {
  return new NaryExpr(Ops.concat, TealType.bytes, TealType.bytes, args);
}
