import { Op } from "../ir/Ops";
import { TealType } from "./Types";
import { Expr } from "./Expr";
import { ScratchLoad, ScratchSlot, TealOp } from "../ir/TealOp";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealBlock } from "../ir/TealBlock";

/**
 * Represents a get operation returning a value that may not exist.
 */
export class MaybeValue extends Expr {
  public slotValue: ScratchSlot;
  public slotOk: ScratchSlot;
  public immediateArgs: Array<number | string | bigint>;
  public args: Array<Expr>;

  /**
   * Create a new MaybeValue.
   *
   * @param op The operation that returns values.
   * @param type The type of the returned value.
   * @param immediateArgs (optional) Immediate arguments for the op. Defaults to None.
   * @param args (optional) Stack arguments for the op. Defaults to None.
   */
  public constructor(
    public op: Op,
    public type: TealType,
    immediateArgs?: Array<bigint | number | string>,
    args?: Array<Expr>
  ) {
    super();
    this.immediateArgs = immediateArgs ? immediateArgs : [];
    this.args = args ? args : [];
    this.slotOk = new ScratchSlot();
    this.slotValue = new ScratchSlot();
  }

  /**
   * Check if the value exists.
   *
   * @return 1 if the value exists, otherwise 0.
   */
  public hasValue(): ScratchLoad {
    return this.slotOk.load(TealType.uint64);
  }

  /**
   * Get the value.
   *
   * @return the value will be returned if it exists. Otherwise, the zero value for this type will be
   * returned (i.e. either 0 or an empty byte string, depending on the type).
   */
  public value(): ScratchLoad {
    return this.slotValue.load(this.type);
  }

  public teal(options: CompileOptions): CompiledExpr {
    const tealOp = new TealOp(this, this.op, [...this.immediateArgs]);
    const { argStart: callStart, argEnd: callEnd } = TealBlock.fromOp(
      options,
      tealOp,
      [...this.args]
    );

    const storeOk = this.slotOk.store();
    const storeValue = this.slotValue.store();

    const { argStart: storeOkStart, argEnd: storeOkEnd } =
      storeOk.teal(options);
    const { argStart: storeValueStart, argEnd: storeValueEnd } =
      storeValue.teal(options);

    callEnd.nextBlock = storeOkStart;
    storeOkEnd.nextBlock = storeValueStart;

    return { argStart: callStart, argEnd: storeValueEnd };
  }

  public typeOf(): TealType {
    return TealType.none;
  }

  public toString(): string {
    let retStr = `((${this.op}`;
    this.immediateArgs.forEach((a) => (retStr += " " + a.toString()));
    this.args.forEach((a) => (retStr += " " + a.toString()));
    retStr += ")";

    const storeOk = this.slotOk.store();
    const storeValue = this.slotValue.store();

    retStr += `${storeOk} ${storeValue})`;
    return retStr;
  }
}
