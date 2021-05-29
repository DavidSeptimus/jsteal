/**
 * An expression that represents an Algorand address.
 */ import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { Ops } from "../ir/Ops";
import { TealType, validAddress } from "./Types";
import { TealBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";
import Expr from "./Expr";

export class Addr extends Expr {
  /**
   * Create a new Addr expression.
   *
   * @param address A string containing a valid base32 Algorand address
   */
  public constructor(public address: string) {
    super();
    validAddress(address);
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, Ops.addr, [this.address]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return TealType.bytes;
  }

  public toString(): string {
    return `(address: ${this.address})`;
  }
}
