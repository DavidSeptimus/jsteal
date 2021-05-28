/**
 * Represents a basic block of TealComponents in a graph.
 */
import { ScratchSlot, TealOp } from "./TealOp";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { Expr } from "../ast/Expr";
import { Ops } from "./Ops";
import { TealCompileError } from "../Errors";
import { assert } from "../Util";

export interface VisitedKey {
  id: number;
  visitedSlots: Array<ScratchSlot>;
}

export abstract class TealBlock {
  public incoming: TealBlock[];

  private static idCounter = 0;
  public readonly id: number;

  /**
   *
   * @param ops
   */
  protected constructor(public ops: Array<TealOp>) {
    this.incoming = [];
    this.id = TealBlock.idCounter++;
  }

  /**
   * Get this block's children blocks, if any.
   */
  public abstract getOutgoing(): Array<TealBlock>;

  /**
   * Replace one of this block's child blocks.
   *
   * @param oldBlock
   * @param newBlock
   */
  public abstract replaceOutgoing(
    oldBlock: TealBlock,
    newBlock: TealBlock
  ): void;

  public isTerminal(): boolean {
    for (const tealOp of this.ops) {
      if ([Ops.return_, Ops.err].indexOf(tealOp.op) !== -1) {
        return true;
      }
    }
    return this.getOutgoing().length === 0;
  }

  /**
   * Check that this block and its children have valid parent pointers.
   *
   * @param parent
   * @param visited
   */
  public validateTree(parent?: TealBlock, visited?: Array<TealBlock>) {
    if (visited == null) {
      visited = [];
    }

    if (parent != null) {
      let count = 0;
      for (const block of this.incoming) {
        if (parent.equals(block)) {
          count += 1;
        }
      }
      assert(() => count === 1, `expected count=1, but found count=${count}`);
    }

    if (visited.every((b) => this !== b)) {
      //  if the block was not already visited
      visited.push(this);
      for (const block of this.getOutgoing()) {
        block.validateTree(this, visited);
      }
    }
  }

  /**
   * Calculate the parent blocks for this block and its children.
   *
   * @param parent (optional): The parent block to this one, if it has one. Defaults to None.
   * @param visited (optional): Used internally to remember blocks that have been visited. Set to None.
   */
  public addIncoming(parent?: TealBlock, visited?: Array<TealBlock>): void {
    if (visited == null) {
      visited = [];
    }

    if (parent && this.incoming.every((b) => parent !== b)) {
      this.incoming.push(parent);
    }

    if (visited.every((b) => this !== b)) {
      //  if the block was not already visited
      visited.push(this);
      for (const block of this.getOutgoing()) {
        block.addIncoming(this, visited);
      }
    }
  }

  public validateSlots(
    slotsInUse?: Set<ScratchSlot>,
    visited?: Set<VisitedKey>
  ): Array<TealCompileError> {
    if (visited == null) {
      visited = new Set();
    }

    if (slotsInUse == null) {
      slotsInUse = new Set();
    }

    const currentSlotsInUse = new Set(slotsInUse);
    const errors = [];

    for (const tealOp of this.ops) {
      if (tealOp.op === Ops.load) {
        for (const slot of tealOp.getSlots()) {
          if (!currentSlotsInUse.has(slot)) {
            const e = new TealCompileError(
              "Scratch slot load occurs before store",
              tealOp.expr?.stack
            );
            errors.push(e);
          }
        }
      }
    }

    if (!this.isTerminal()) {
      const sortedSlots = [...currentSlotsInUse].sort((s1, s2) =>
        s1.id <= s2.id ? -1 : 1
      );
      for (const block of this.getOutgoing()) {
        const visitedKey: VisitedKey = {
          id: block.id,
          visitedSlots: sortedSlots,
        };
        if ([...visited].indexOf(visitedKey) !== -1) {
          continue;
        }
        for (const error of block.validateSlots(currentSlotsInUse, visited)) {
          if (errors.indexOf(error) === -1) {
            errors.push(error);
          }
        }
        visited.add(visitedKey);
      }
    }

    return errors;
  }

  public abstract equals(other: any): boolean;

  /**
   * Create a path of blocks from a TealOp and its arguments.
   *
   * @param options
   * @param op
   * @param args
   * @return The starting and ending block of the path that encodes the given TealOp and arguments.
   */

  /**
   * Perform a depth-first search of the graph of blocks starting with start.
   *
   * @param start
   */
  public static *iterate(start: TealBlock): Generator<TealBlock> {
    const queue = [start];
    const visited = [...queue];

    const isInVisited = (block: TealBlock) => {
      for (const v of visited) {
        if (block === v) {
          return true;
        }
      }
      return false;
    };

    while (queue.length > 0) {
      const w = queue.shift() as TealBlock;
      const nextBlocks = w.getOutgoing();
      yield w;
      for (const nextBlock of nextBlocks) {
        if (!isInVisited(nextBlock)) {
          visited.push(nextBlock);
          queue.push(nextBlock);
        }
      }
    }
  }

  /**
     * Minimize the number of blocks in the graph of blocks starting with start by combining
     * sequential blocks. This operation does not alter the operations of the graph or the
     * functionality of its underlying program, however it does mutate the input graph.
     *
     * @param start
     *
     * @return The new starting point of the altered graph. May be the same or different than start.

     */
  public static normalizeBlocks(start: TealBlock): TealBlock {
    for (const block of TealBlock.iterate(start)) {
      if (block.incoming.length === 1) {
        const prev = block.incoming[0];
        const prevOutgoing = prev.getOutgoing();
        if (prevOutgoing.length == 1 && prevOutgoing[0].equals(block)) {
          // combine blocks
          block.ops = prev.ops.concat(block.ops);
          block.incoming = prev.incoming;
          for (const incoming of prev.incoming) {
            incoming.replaceOutgoing(prev, block);
          }
          if (prev.equals(start)) {
            start = block;
          }
        }
      }
    }
    return start;
  }

  public static fromOp(
    options: CompileOptions,
    op: TealOp,
    args?: Array<Expr>
  ): CompiledExpr {
    const opBlock = new TealSimpleBlock([op]);

    if (!args?.length) {
      return { argStart: opBlock, argEnd: opBlock };
    }

    let start;
    let prevArgEnd;
    for (let i = 0; i < args.length; i++) {
      const { argStart, argEnd } = args[i].teal(options);
      if (i === 0) {
        start = argStart;
      } else if (prevArgEnd) {
        prevArgEnd.nextBlock = argStart;
      }
      prevArgEnd = argEnd;
    }

    if (prevArgEnd) {
      prevArgEnd.nextBlock = opBlock;
    }

    return { argStart: start as TealBlock, argEnd: opBlock as TealSimpleBlock };
  }
}

/**
 * Represents a basic block of TealComponents in a graph that does not contain a branch condition.
 */
export class TealSimpleBlock extends TealBlock {
  public nextBlock?: TealBlock;

  /**
   *
   * @param ops
   */
  public constructor(ops: Array<TealOp>) {
    super(ops);
  }

  /**
   * gets the block that follows this one
   */
  public getOutgoing(): Array<TealBlock> {
    return this.nextBlock == null ? [] : [this.nextBlock as TealBlock];
  }

  /**
   * replaces the prior next block with newBlock
   *
   * @param oldBlock
   * @param newBlock
   */
  public replaceOutgoing(oldBlock: TealBlock, newBlock: TealBlock): void {
    if (this.nextBlock === oldBlock) {
      this.nextBlock = newBlock;
    }
  }

  public toString(): string {
    return `TealSimpleBlock(${this.ops}, next=${this.nextBlock})`;
  }

  public equals(other: any): boolean {
    if (!(other instanceof TealSimpleBlock)) {
      return false;
    }

    if (
      !(
        this.ops.length === other.ops.length &&
        this.ops.every((v, i) => v.equals(other.ops[i]))
      )
    ) {
      return false;
    }

    if (!(!this.nextBlock === !other.nextBlock)) {
      return false;
    }

    return this.nextBlock ? this.nextBlock.equals(other.nextBlock) : true;
  }
}
