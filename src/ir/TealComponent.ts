import { Expr } from "../ast/Expr";
import { ScratchSlot } from "./TealOp";

export abstract class TealComponent {
  public expr?: Expr;

  protected constructor(expr?: Expr) {
    this.expr = expr;
  }

  public getSlots(): Array<ScratchSlot> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public assignSlot(slot: ScratchSlot, location: number): void {
    return; // no-op
  }

  abstract assemble(): string;

  abstract equals(other: any): boolean;

  private static _checkExpr = true;

  // ToDo: look into whether more robust context handling is needed.
  public static get checkExpr(): boolean {
    return TealComponent._checkExpr;
  }

  public static withIgnoreExprEquality(fn: () => void) {
    TealComponent._checkExpr = false;
    fn();
    TealComponent._checkExpr = true;
  }
}
