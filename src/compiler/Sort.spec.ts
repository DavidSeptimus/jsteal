import "jasmine";
import { TealSimpleBlock } from "../ir/TealBlock";
import { Ops } from "../ir/Ops";
import { TealOp } from "../ir/TealOp";
import { sortBlocks } from "./Sort";
import { TealConditionalBlock } from "../ir/TealConditionalBlock";

describe("Sort Tests", function () {
  it("test_sort_single", function () {
    const block = new TealSimpleBlock([new TealOp(undefined, Ops.int, [1])]);
    block.addIncoming();
    block.validateTree();

    const expected = [block];
    const actual = sortBlocks(block);

    expect(actual).toEqual(expected);
  });

  it("test_sort_sequence", function () {
    const block5 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [5])]);
    const block4 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [4])]);
    block4.nextBlock = block5;
    const block3 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [3])]);
    block3.nextBlock = block4;
    const block2 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [2])]);
    block2.nextBlock = block3;
    const block1 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [1])]);
    block1.nextBlock = block2;
    block1.addIncoming();
    block1.validateTree();

    const expected = [block1, block2, block3, block4, block5];
    const actual = sortBlocks(block1);

    expect(actual).toEqual(expected);
  });

  it("test_sort_branch", function () {
    const blockTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
    ]);
    const blockFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
    ]);
    const block = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    block.trueBlock = blockTrue;
    block.falseBlock = blockFalse;
    block.addIncoming();
    block.validateTree();

    const expected = [block, blockFalse, blockTrue];
    const actual = sortBlocks(block);

    expect(actual).toEqual(expected);
  });

  it("test_sort_multiple_branch", function () {
    const blockTrueTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true true"']),
    ]);
    const blockTrueFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true false"']),
    ]);
    const blockTrueBranch = new TealConditionalBlock([]);
    blockTrueBranch.trueBlock = blockTrueTrue;
    blockTrueBranch.falseBlock = blockTrueFalse;
    const blockTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
    ]);
    blockTrue.nextBlock = blockTrueBranch;
    const blockFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
    ]);
    const block = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    block.trueBlock = blockTrue;
    block.falseBlock = blockFalse;
    block.addIncoming();
    block.validateTree();

    const expected = [
      block,
      blockFalse,
      blockTrue,
      blockTrueBranch,
      blockTrueFalse,
      blockTrueTrue,
    ];
    const actual = sortBlocks(block);

    expect(actual).toEqual(expected);
  });

  it("test_sort_branch_converge", function () {
    const blockEnd = new TealSimpleBlock([new TealOp(undefined, Ops.return_)]);
    const blockTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
    ]);
    blockTrue.nextBlock = blockEnd;
    const blockFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
    ]);
    blockFalse.nextBlock = blockEnd;
    const block = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    block.trueBlock = blockTrue;
    block.falseBlock = blockFalse;
    block.addIncoming();
    block.validateTree();

    const expected = [block, blockFalse, blockTrue, blockEnd];
    const actual = sortBlocks(block);

    expect(actual).toEqual(expected);
  });
});
