import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { Expr } from "./Expr";
import { requireType, TealType } from "./Types";
import { TealInputError } from "../Errors";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";

/**
 * A control flow expression to represent a sequence of expressions.
 */
export class Seq extends Expr {
  public constructor(public exprs: Array<Expr>) {
    super();

    if (exprs.length == 0) {
      throw new TealInputError("Seq requires children.");
    }

    for (let i = 0; i < exprs.length; i++) {
      if (i + 1 < exprs.length) {
        requireType(exprs[i].typeOf(), TealType.none);
      }
    }
  }

  public teal(options: CompileOptions): CompiledExpr {
    let start;
    let end;
    for (let i = 0; i < this.exprs.length; i++) {
      const { argStart, argEnd } = this.exprs[i].teal(options);
      if (i == 0) {
        start = argStart;
      } else {
        (end as TealSimpleBlock).nextBlock = argStart;
      }
      end = argEnd;
    }
    return { argStart: start as TealBlock, argEnd: end as TealSimpleBlock };
  }

  public typeOf(): TealType {
    return this.exprs.slice(-1)[0].typeOf();
  }

  public toString(): string {
    let retStr = "(Seq";
    for (const a of this.exprs) {
      retStr += " " + a.toString();
    }
    retStr += ")";
    return retStr;
  }
}
