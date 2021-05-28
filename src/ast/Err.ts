import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { LeafExpr } from "./LeafExpr";
import { TealType } from "./Types";
import { TealOp } from "../ir/TealOp";
import { Ops } from "../ir/Ops";
import { TealBlock } from "../ir/TealBlock";

/**
 * Expression that causes the program to immediately fail when executed.
 */
export class Err extends LeafExpr {
  public constructor() {
    super();
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, Ops.err);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return TealType.none;
  }
}
