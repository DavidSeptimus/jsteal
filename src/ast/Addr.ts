import {
  CompiledExpr,
  CompileOptions,
  LeafExpr,
  Ops,
  TealBlock,
  TealOp,
  TealType,
  validAddress,
} from "../internal";

/**
 * An expression that represents an Algorand address.
 */
export class Addr extends LeafExpr {
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
