import { TealType, validTmpl } from "./Types";
import { Op, Ops } from "../ir/Ops";
import { TealBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import Expr from "./Expr";

export class Tmpl extends Expr {
  public constructor(
    public op: Op,
    public type: TealType,
    public name: string
  ) {
    super();
    validTmpl(name);
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, this.op, [this.name]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return this.type;
  }

  public toString(): string {
    return `(Tmpl ${this.op} ${this.name})`;
  }

  /**
   * Create a new Int template.
   * @param {string} placeholder The name to use for this template variable. Must start with `TMPL_` and
   * only consist of uppercase alphanumeric characters and underscores.
   * @return {Tmpl}
   */
  public static int(placeholder: string): Tmpl {
    return new Tmpl(Ops.int, TealType.uint64, placeholder);
  }

  /**
   * Create a new Bytes template.
   *
   * @param {string} placeholder The name to use for this template variable. Must start with `TMPL_` and
   * only consist of uppercase alphanumeric characters and underscores.
   * @return {Tmpl}
   */
  public static bytes(placeholder: string): Tmpl {
    return new Tmpl(Ops.byte, TealType.bytes, placeholder);
  }

  /**
   * Create a new Addr template.
   *
   * @param {string} placeholder The name to use for this template variable. Must start with `TMPL_` and
   * only consist of uppercase alphanumeric characters and underscores.
   * @return {Tmpl}
   */
  public static addr(placeholder: string): Tmpl {
    return new Tmpl(Ops.addr, TealType.bytes, placeholder);
  }
}
