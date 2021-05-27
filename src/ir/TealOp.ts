import { TealComponent } from "./TealComponent";
import { Expr } from "../ast/Expr";
import { TealInternalError } from "../Errors";
import { Op, Ops } from "./Ops";
import { TealType } from "../ast/Types";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealBlock } from "./TealBlock";

export class TealOp extends TealComponent {
  /**
   * Creates a TealOp
   *
   * args of type `number` are converted to `bigint`.
   *
   * @param {Expr | undefined} expr
   * @param {Op} _op
   * @param {Array<bigint | number | string | ScratchSlot>} args
   */
  public constructor(
    expr: Expr | undefined,
    private _op: Op,
    public args: Array<bigint | number | string | ScratchSlot> = []
  ) {
    super(expr);
    this.args = args.map((a) => (typeof a === "number" ? BigInt(a) : a));
  }

  public get op(): Op {
    return this._op;
  }

  public getSlots(): Array<ScratchSlot> {
    return this.args
      .filter((a) => a instanceof ScratchSlot)
      .map((a) => a as ScratchSlot);
  }

  public assignSlot(slot: ScratchSlot, location: number): void {
    for (let i = 0; i < this.args.length; i++) {
      if (slot.equals(this.args[i])) {
        this.args[i] = location;
      }
    }
  }

  public assemble(): string {
    const parts = [this._op.toString()];
    for (const arg of this.args) {
      if (arg instanceof ScratchSlot) {
        throw new TealInternalError(`Slot not assigned: ${arg}`);
      }
      parts.push(arg.toString());
    }
    return parts.join(" ");
  }

  public toString(): string {
    return `TealOp(${this.expr}, ${this.args.join(",")})`;
  }

  public equals(other: any): boolean {
    if (!(other instanceof TealOp)) {
      return false;
    }
    if (TealComponent.checkExpr && this.expr !== other.expr) {
      return false;
    }

    if (
      !(
        this.args.length === other.args.length &&
        this.args.every((v, i) =>
          typeof v === "number" || typeof v === "bigint"
            ? v == other.args[i] // loose equality strictly for number and bigint types
            : v === other.args[i]
        )
      )
    ) {
      return false;
    }
    return this._op === other._op;
  }
}

/**
 * Represents the allocation of a scratch space slot.
 */
export class ScratchSlot {
  private static slotId = 0;
  public readonly id: number;

  public constructor() {
    this.id = ScratchSlot.slotId++;
  }

  /**
   * Get an expression to store a value in this slot.Args:
   *
   * @param value The value to store in this slot. If not included, the last value on
   * the stack will be stored. NOTE: storing the last value on the stack breaks the typical
   * semantics of PyTeal, only use if you know what you're doing.
   *
   * @return ScratchStore
   */
  public store(value?: Expr): Expr {
    if (value != null) {
      return new ScratchStore(this, value);
    }
    return new ScratchStore(this);
  }

  /**
   * Get an expression to load a value from this slot.
   *
   * @param type The type being loaded from this slot, if known. Defaults to TealType.anytype.
   *
   * @return ScratchLoad
   */
  public load(type: TealType = TealType.anytype): ScratchLoad {
    return new ScratchLoad(this, type);
  }

  public toString(): string {
    return `slot#${this.id}`;
  }

  public equals(other: any): boolean {
    if (!(other instanceof ScratchSlot)) {
      return false;
    }
    return this.id === other.id;
  }
}

/**
 * Expression to load a value from scratch space.
 */
export class ScratchLoad extends Expr {
  public constructor(
    public slot: ScratchSlot,
    private _type: TealType = TealType.anytype
  ) {
    super();
  }

  public toString(): string {
    return `(Load ${this.slot})`;
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, Ops.load, [this.slot]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return this._type;
  }
}

/**
 * Expression to store a value in scratch space.
 */
export class ScratchStore extends Expr {
  public constructor(public slot: ScratchSlot, public value?: Expr) {
    super();
  }

  public toString(): string {
    return `(Store ${this.slot}, ${this.value})`;
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, Ops.store, [this.slot]);
    return TealBlock.fromOp(options, op, this.value ? [this.value] : []);
  }

  public typeOf(): TealType {
    return TealType.none;
  }
}

/**
 * Expression to store a value from the stack in scratch space.
 * NOTE: This expression breaks the typical semantics of JsTeal, only use if you know what you're doing.
 */
export class ScratchStackStore extends Expr {
  public constructor(public slot: ScratchSlot) {
    super();
  }

  public toString(): string {
    return `(StackStore ${this.slot})`;
  }

  public teal(options: CompileOptions): CompiledExpr {
    const op = new TealOp(this, Ops.store, [this.slot]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return TealType.none;
  }
}
