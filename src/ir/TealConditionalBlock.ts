import { TealBlock } from "./TealBlock";
import { TealOp } from "./TealOp";

/**
 * Represents a basic block of TealComponents in a graph ending with a branch condition.
 */
export class TealConditionalBlock extends TealBlock {
  private _trueBlock?: TealBlock;
  private _falseBlock?: TealBlock;

  public get trueBlock(): TealBlock | undefined {
    return this._trueBlock;
  }

  public set trueBlock(value: TealBlock | undefined) {
    this._trueBlock = value;
  }

  public get falseBlock(): TealBlock | undefined {
    return this._falseBlock;
  }

  public set falseBlock(value: TealBlock | undefined) {
    this._falseBlock = value;
  }

  public constructor(ops: Array<TealOp>) {
    super(ops);
  }

  public getOutgoing(): Array<TealBlock> {
    const outgoing = [];
    if (this.trueBlock) {
      outgoing.push(this.trueBlock);
    }
    if (this.falseBlock) {
      outgoing.push(this.falseBlock);
    }
    return outgoing;
  }

  public replaceOutgoing(oldBlock: TealBlock, newBlock: TealBlock): void {
    if (this.trueBlock?.equals(oldBlock)) {
      this.trueBlock = newBlock;
    } else if (this.falseBlock?.equals(oldBlock)) {
      this.falseBlock = newBlock;
    }
  }

  public toString(): string {
    return `TealConditionalBlock(${this.ops}, true=${this.trueBlock}, false=${this.falseBlock})`;
  }

  public equals(other: any): boolean {
    if (!(other instanceof TealConditionalBlock)) {
      return false;
    }
    other = other as TealConditionalBlock;
    if (
      !this.trueBlock !== !other.trueBlock ||
      !this.falseBlock !== !other.falseBlock ||
      (this.trueBlock && !this.trueBlock.equals(other.trueBlock)) ||
      (this.falseBlock && !this.falseBlock.equals(other.falseBlock))
    ) {
      return false;
    }

    if (this.ops.length !== other.ops.length) {
      return false;
    }

    return this.ops.every((o1, i) => o1.equals(other.ops[i]));
  }
}
