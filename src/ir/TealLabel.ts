import { TealComponent } from "./TealComponent";
import { Expr } from "../ast/Expr";

export class TealLabel extends TealComponent {
  public constructor(expr: Expr | undefined, public label: string) {
    super(expr);
  }

  public assemble(): string {
    return this.label + ":";
  }

  public equals(other: any): boolean {
    if (!(other instanceof TealLabel)) {
      return false;
    }
    if (TealComponent.checkExpr && this.expr !== other.expr) {
      return false;
    }
    return this.label === other.label;
  }
}
