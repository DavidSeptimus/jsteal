import { requireType, TealType } from "./Types";
import { ScratchLoad, ScratchSlot } from "../ir/TealOp";
import { Expr } from "./Expr";

/**
 * Interface around Scratch space, similar to get/put local/global state
 *
 * @Example
 *  ```typescript
 * const myvar = new ScratchVar(TealType.uint64);
 * new Seq([
 *  myvar.store(Int(5)),
 *  Assert(myvar.load() == new Int(5))
 * ]);
 * ```
 */
export class ScratchVar {
  public slot = new ScratchSlot();
  /**
   * Create a new ScratchVar with an optional type.
   *
   * @param {TealType} type (optional): The type that this variable can hold.
   * An error will be thrown if an expression with an incompatible type
   * is stored in this variable. Defaults to TealType.anytype.
   */
  public constructor(private type: TealType = TealType.anytype) {}

  /**
   * Get the type of expressions that can be stored in this ScratchVar.
   *
   * @return {TealType}
   */
  public storageType(): TealType {
    return this.type;
  }

  /**
   * Store value in Scratch Space
   *
   * @param {Expr} value The value to store. Must conform to this ScratchVar's type.
   * @return {Expr}
   */
  public store(value: Expr): Expr {
    requireType(value.typeOf(), this.type);
    return this.slot.store(value);
  }

  /**
   * Load value from Scratch Space
   *
   * @return {ScratchLoad}
   */
  public load(): ScratchLoad {
    return this.slot.load(this.type);
  }
}
