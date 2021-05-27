import { LeafExpr } from "./LeafExpr";
import { asBigInt, isInt } from "../Util";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealType } from "./Types";
import { Ops } from "../ir/Ops";
import { TealOp } from "../ir/TealOp";
import { TealBlock } from "../ir/TealBlock";
import { TealInputError } from "../Errors";

/**
 * An expression that represents a uint64.
 */
export class Int extends LeafExpr {
  private readonly value: bigint;

  /**
   * Create a new uint64
   *
   * @param value The integer value this uint64 will represent. Must be a positive value less than 2**64.
   */
  public constructor(value: number | bigint) {
    super();
    if (!isInt(value)) {
      throw new TealInputError(`invalid input type ${typeof value} to Int`);
    } else if (value >= 0 && value < 2n ** 64n) {
      this.value = asBigInt(value);
    } else {
      throw new TealInputError(`Int ${value} is out of range`);
    }
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, Ops.int, [this.value]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return TealType.uint64;
  }

  public toString(): string {
    return `(Int: ${this.value})`;
  }
}

/**
 * An expression that represents uint64 enum values.
 */
export class EnumInt extends LeafExpr {
  /**
   * Create an expression to reference a uint64 enum value.
   *
   * @param name The name of the enum value.
   */
  public constructor(private name: string) {
    super();
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, Ops.int, [this.name]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return TealType.uint64;
  }

  public toString(): string {
    return `(IntEnum: ${this.name})`;
  }
}
