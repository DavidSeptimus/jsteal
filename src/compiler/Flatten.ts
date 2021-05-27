import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealComponent } from "../ir/TealComponent";
import { assert } from "../Util";
import { TealOp } from "../ir/TealOp";
import { Ops } from "../ir/Ops";
import { TealInternalError } from "../Errors";
import { TealLabel } from "../ir/TealLabel";
import { TealConditionalBlock } from "../ir/TealConditionalBlock";

/**
 * Lowers a list of TealBlocks into a list of TealComponents.
 *
 * @param blocks The blocks to lower.
 */
export function flattenBlocks(blocks: Array<TealBlock>): Array<TealComponent> {
  const codeblocks = [];
  const references = new Map<number, number>();

  const indexToLabel = (index: number) => `l${index}`;

  for (const [i, block] of blocks.entries()) {
    const code = [...block.ops];
    codeblocks.push(code);
    if (block.isTerminal()) {
      continue;
    }

    if (block instanceof TealSimpleBlock) {
      const simpleBlock = block as TealSimpleBlock;
      assert(() => simpleBlock.nextBlock != null);

      const nextIndex = blocks.indexOf(
        simpleBlock.nextBlock as TealBlock,
        i + 1
      );
      if (nextIndex !== i + 1) {
        references.set(nextIndex, (references.get(nextIndex) || 0) + 1);
        code.push(new TealOp(undefined, Ops.b, [indexToLabel(nextIndex)]));
      }
    } else if (block instanceof TealConditionalBlock) {
      const conditionalBlock = block as TealConditionalBlock;
      assert(() => conditionalBlock.trueBlock != null);
      assert(() => conditionalBlock.falseBlock != null);

      const trueIndex = blocks.indexOf(
        conditionalBlock.trueBlock as TealBlock,
        i + 1
      );
      const falseIndex = blocks.indexOf(
        conditionalBlock.falseBlock as TealBlock,
        i + 1
      );

      if (falseIndex === i + 1) {
        references.set(trueIndex, (references.get(trueIndex) || 0) + 1);
        code.push(new TealOp(undefined, Ops.bnz, [indexToLabel(trueIndex)]));
        continue;
      }

      if (trueIndex === i + 1) {
        references.set(falseIndex, (references.get(falseIndex) || 0) + 1);
        code.push(new TealOp(undefined, Ops.bz, [indexToLabel(falseIndex)]));
        continue;
      }

      references.set(trueIndex, (references.get(trueIndex) || 0) + 1);
      code.push(new TealOp(undefined, Ops.bnz, [indexToLabel(trueIndex)]));

      references.set(falseIndex, (references.get(falseIndex) || 0) + 1);
      code.push(new TealOp(undefined, Ops.bz, [indexToLabel(falseIndex)]));
    } else {
      throw new TealInternalError(`Unrecognized block type: ${typeof block}`);
    }
  }

  const teal = [];
  for (const [i, code] of codeblocks.entries()) {
    if ((references.get(i) || 0) !== 0) {
      teal.push(new TealLabel(undefined, indexToLabel(i)));
    }
    teal.push(...code);
  }
  return teal;
}
