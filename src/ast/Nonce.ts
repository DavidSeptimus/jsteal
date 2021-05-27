import { Expr } from "./Expr";
import { TealInputError } from "../Errors";
import { Bytes } from "./Bytes";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealType } from "./Types";
import { Seq } from "./Seq";
import { Pop } from "./UnaryExpr";

/**
 * A meta expression only used to change the hash of a TEAL program.
 */
export class Nonce extends Expr {
  public nonceBytes: Bytes;
  public seq: Seq;

  /**
   * Create a new Nonce.
   *
   * The Nonce expression behaves exactly like the child expression passed into it, except it
   * uses the provided nonce string to alter its structure in a way that does not affect
   * execution.
   *
   * @param {string} base The base of the nonce. Must be one of utf8, base16, base32, or base64.
   * @param {string} nonce An arbitrary nonce string that conforms to base.
   * @param {Expr} child The expression to wrap.
   */
  public constructor(base: string, nonce: string, public child: Expr) {
    super();
    if (!["utf8", "base16", "base32", "base64"].indexOf(base)) {
      throw new TealInputError(`Invalid base: ${base}`);
    }

    if (base == "utf8") {
      this.nonceBytes = new Bytes([nonce]);
    } else {
      this.nonceBytes = new Bytes([base, nonce]);
    }

    this.seq = new Seq([Pop(this.nonceBytes), this.child]);
  }

  public teal(options: CompileOptions): CompiledExpr {
    return this.seq.teal(options);
  }

  public typeOf(): TealType {
    return this.child.typeOf();
  }

  public toString(): string {
    return `(nonce: ${this.nonceBytes}) ${this.child}`;
  }
}
