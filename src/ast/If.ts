import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { Expr } from "./Expr";
import { requireType, TealType } from "./Types";
import { TealSimpleBlock } from "../ir/TealBlock";
import { TealConditionalBlock } from "../ir/TealConditionalBlock";

/**
 * Simple two-way conditional expression.
 */
export class If extends Expr {
  /**
     * Create a new If expression.

     When this If expression is executed, the condition will be evaluated, and if it produces a
     true value, thenBranch will be executed and used as the return value for this expression.
     Otherwise, elseBranch will be executed and used as the return value, if it is provided.

     * @param {Expr} cond The condition to check. Must evaluate to uint64.
     * @param {Expr} thenBranch Expression to evaluate if the condition is true.
     * @param {Expr} elseBranch Expression to evaluate if the condition is false.
     * Must evaluate to the same type as thenBranch, if provided. Defaults to None.
     */
  public constructor(
    public cond: Expr,
    public thenBranch: Expr,
    public elseBranch?: Expr
  ) {
    super();
    requireType(cond.typeOf(), TealType.uint64);

    if (!elseBranch) {
      requireType(thenBranch.typeOf(), TealType.none);
    } else {
      requireType(thenBranch.typeOf(), elseBranch.typeOf());
    }
  }

  public teal(options: CompileOptions): CompiledExpr {
    const { argStart: condStart, argEnd: condEnd } = this.cond.teal(options);
    const { argStart: thenStart, argEnd: thenEnd } =
      this.thenBranch.teal(options);
    const end = new TealSimpleBlock([]);

    const branchBlock = new TealConditionalBlock([]);
    branchBlock.trueBlock = thenStart;

    condEnd.nextBlock = branchBlock;
    thenEnd.nextBlock = end;

    if (!this.elseBranch) {
      branchBlock.falseBlock = end;
    } else {
      const { argStart: elseStart, argEnd: elseEnd } =
        this.elseBranch.teal(options);
      branchBlock.falseBlock = elseStart;
      elseEnd.nextBlock = end;
    }

    return { argStart: condStart, argEnd: end };
  }

  public typeOf(): TealType {
    return this.thenBranch.typeOf();
  }

  public toString(): string {
    return `(If ${this.cond} ${this.thenBranch}${
      this.elseBranch ? " " + this.elseBranch.toString() : ""
    }`;
  }
}
