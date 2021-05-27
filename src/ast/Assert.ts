import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { Expr } from "./Expr";
import { requireType, TealType } from "./Types";
import { Ops } from "../ir/Ops";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";
import { TealConditionalBlock } from "../ir/TealConditionalBlock";

/**
 * A control flow expression to verify that a condition is true.
 */
export class Assert extends Expr {
  /**
   * Create an assert statement that raises an error if the condition is false.
   *
   * @param cond The condition to evaluate
   */
  public constructor(public cond: Expr) {
    super();
    requireType(cond.typeOf(), TealType.uint64);
  }

  public teal(options: CompileOptions): CompiledExpr {
    if (options.version >= Ops.assert_.minVersion) {
      // use assert op if available
      return TealBlock.fromOp(options, new TealOp(this, Ops.assert_), [
        this.cond,
      ]);
    }
    // if assert op is not available, use branches and err
    const { argStart: condStart, argEnd: condEnd } = this.cond.teal(options);

    const end = new TealSimpleBlock([]);
    const errBlock = new TealSimpleBlock([new TealOp(this, Ops.err)]);

    const branchBlock = new TealConditionalBlock([]);
    branchBlock.trueBlock = end;
    branchBlock.falseBlock = errBlock;

    condEnd.nextBlock = branchBlock;

    return { argStart: condStart, argEnd: end };
  }

  public typeOf(): TealType {
    return TealType.none;
  }

  public toString(): string {
    return `(Assert ${this.cond})`;
  }
}
