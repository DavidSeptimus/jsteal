import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealType, validBase16, validBase32, validBase64 } from "./Types";
import { escapeString } from "../Util";
import { TealInputError } from "../Errors";
import { TealOp } from "../ir/TealOp";
import { Ops } from "../ir/Ops";
import { TealBlock } from "../ir/TealBlock";
import Expr from "./Expr";

/**
 * An expression that represents a byte string.
 */
export class Bytes extends Expr {
  public base: string;
  public byteStr: string;

  /**
   * "Create a new byte string.
   *   Depending on the encoding, there are different arguments to pass:
   *
   *  For UTF-8 strings:
   *    Pass the string as the only argument. For example, ``new Bytes("content")``.
   *  For base16, base32, or base64 strings:
   *    Pass the base as the first argument and the string as the second argument. For example,
   *    ``new Bytes("base16", "636F6E74656E74")``, ``new Bytes("base32", "ORFDPQ6ARJK")``,
   *    ``new Bytes("base64", "Y29udGVudA==")``.
   *    Special case for base16:
   *  The prefix "0x" may be present in a base16 byte string. For example,
   *  ``new Bytes("base16", "0x636F6E74656E74")``.
   *  `
   * @param {Array<string>} args
   */
  public constructor(args: Array<string> = []) {
    super();

    if (args.length === 1) {
      this.base = "utf8";
      this.byteStr = escapeString(args[0]);
    } else if (args.length == 2) {
      let byteStr;
      [this.base, byteStr] = args;
      if (this.base === "base32") {
        validBase32(byteStr);
        this.byteStr = byteStr;
      } else if (this.base === "base64") {
        validBase64(byteStr);
        this.byteStr = byteStr;
      } else if (this.base === "base16") {
        if (byteStr.startsWith("0x")) {
          this.byteStr = byteStr.slice(2);
        } else {
          this.byteStr = byteStr;
        }
        validBase16(this.byteStr);
      } else {
        throw new TealInputError(
          `invalid base ${this.base}, need to be base32, base64, or base16.`
        );
      }
    } else {
      throw new TealInputError(
        `Only 1 or 2 arguments are expected for Bytes constructor, you provided ${args.length}`
      );
    }
  }

  public teal(options: CompileOptions): CompiledExpr {
    let payload;
    if (this.base === "utf8") {
      payload = this.byteStr;
    } else if (this.base === "base16") {
      payload = "0x" + this.byteStr;
    } else {
      payload = `${this.base}(${this.byteStr})`;
    }
    const op = new TealOp(this, Ops.byte, [payload]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return TealType.bytes;
  }

  public toString(): string {
    return `(${this.base} bytes: ${this.byteStr})`;
  }
}
