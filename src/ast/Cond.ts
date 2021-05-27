/**
 * A chainable branching expression that supports an arbitrary number of conditions.
 */
import Expr from "./Expr";
import { requireType, TealType } from "./Types";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { Ops } from "../ir/Ops";
import { TealInputError } from "../Errors";
import { TealConditionalBlock } from "../ir/TealConditionalBlock";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";

export class Cond extends Expr {
  public valueType: TealType;

  /**
   * At least one argument must be provided, and each argument must be a list with two elements.
   *  The first element is a condition which evaluates to uint64, and the second is the body of the
   *  condition, which will execute if that condition is true. All condition bodies must have the
   *  same return type. During execution, each condition is tested in order, and the first
   *  condition to evaluate to a true value will cause its associated body to execute and become
   *  the value for this Cond expression. If no condition evaluates to a true value, the Cond
   *  expression produces an error and the TEAL program terminates.
   *   Example:
   *   ```typescript
   *   new Cond([Globals.groupSize().eq(new Int(5)), bid],
   *  [Globals.groupSize().eq(new Int(4)), redeem],
   *  [Globals.groupSize().eq(new Int(1)), wrapup])
   *  ```
   * @param args
   */
  public constructor(public args: Array<Array<Expr>>) {
    super();

    if (args.length < 1) {
      throw new TealInputError("Cond requires at least one [condition, value]");
    }

    let valueType;

    for (const arg of args) {
      if (arg.length !== 2) {
        throw new TealInputError(
          `Cond should be in the form of Cond([cond1, value1], [cond2, value2], ...), error in ${arg}`
        );
      }

      requireType(arg[0].typeOf(), TealType.uint64);

      if (valueType == null) {
        // the types of all branches should be the same
        valueType = arg[1].typeOf();
      } else {
        requireType(arg[1].typeOf(), valueType);
      }
    }

    this.valueType = valueType as TealType;
  }

  public teal(options: CompileOptions): CompiledExpr {
    let start;
    const end = new TealSimpleBlock([]);
    let prevBranch = null;
    for (let i = 0; i < this.args.length; i++) {
      const [cond, pred] = this.args[i];
      const { argStart: condStart, argEnd: condEnd } = cond.teal(options);
      const { argStart: predStart, argEnd: predEnd } = pred.teal(options);

      const branchBlock = new TealConditionalBlock([]);
      branchBlock.trueBlock = predStart;

      condEnd.nextBlock = branchBlock;
      predEnd.nextBlock = end;

      if (i == 0) {
        start = condStart;
      } else {
        (prevBranch as TealConditionalBlock).falseBlock = condStart;
      }
      prevBranch = branchBlock;
    }

    const errBlock = new TealSimpleBlock([new TealOp(this, Ops.err)]);
    (prevBranch as TealConditionalBlock).falseBlock = errBlock;
    return { argStart: start as TealBlock, argEnd: end };
  }

  public typeOf(): TealType {
    return this.valueType;
  }

  public toString(): string {
    let retStr = "(Cond";
    for (const a in this.args) {
      retStr += ` [${a[0]}, ${a[1]}]`;
    }
    retStr += ")";
    return retStr;
  }
}
