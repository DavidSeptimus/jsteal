import { isInt } from "../Util";
import { TealInputError } from "../Errors";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealType } from "./Types";
import { TealOp } from "../ir/TealOp";
import { Ops } from "../ir/Ops";
import { TealBlock } from "../ir/TealBlock";
import Expr from "./Expr";

/**
 * An expression to get an argument when running in signature verification mode.
 */
export class Arg extends Expr {
  /**
   * Get an argument for this program.
   *
   * Should only be used in signature verification mode. For application mode arguments, see
   * :any:`TxnObject.application_args`.
   *
   * @param index The integer index of the argument to get. Must be between 0 and 255 inclusive.
   */
  public constructor(public index: number) {
    super();

    if (!isInt(index))
      throw new TealInputError(
        `invalid arg input type: ${index} is not an integer`
      );

    if (index < 0 || index > 255)
      throw new TealInputError(`invalid arg index ${index}`);
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, Ops.arg, [this.index]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return TealType.bytes;
  }

  public toString(): string {
    return `(arg ${this.index})`;
  }
}
