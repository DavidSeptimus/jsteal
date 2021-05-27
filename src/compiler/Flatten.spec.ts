import "jasmine";
import { TealOp } from "../ir/TealOp";
import { Ops } from "../ir/Ops";
import { TealConditionalBlock } from "../ir/TealConditionalBlock";
import { flattenBlocks } from "./Flatten";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealComponent } from "../ir/TealComponent";
import { TealLabel } from "../ir/TealLabel";

describe("Flatten tests", function () {
  it("test_flatten_undefined", function () {
    const blocks: Array<TealBlock> = [];
    const expected: Array<TealComponent> = [];
    const actual = flattenBlocks(blocks);

    expect(actual).toEqual(expected);
  });

  it("test_flatten_single_empty", function () {
    const blocks = [new TealSimpleBlock([])];
    const expected: Array<TealComponent> = [];
    const actual = flattenBlocks(blocks);

    expect(actual).toEqual(expected);
  });

  it("test_flatten_single_one", function () {
    const blocks = [new TealSimpleBlock([new TealOp(undefined, Ops.int, [1])])];
    const expected = [new TealOp(undefined, Ops.int, [1])];
    const actual = flattenBlocks(blocks);

    expect(actual).toEqual(expected);
  });

  it("test_flatten_single_many", function () {
    const blocks = [
      new TealSimpleBlock([
        new TealOp(undefined, Ops.int, [1]),
        new TealOp(undefined, Ops.int, [2]),
        new TealOp(undefined, Ops.int, [3]),
        new TealOp(undefined, Ops.add),
        new TealOp(undefined, Ops.add),
      ]),
    ];
    const expected = [
      new TealOp(undefined, Ops.int, [1]),
      new TealOp(undefined, Ops.int, [2]),
      new TealOp(undefined, Ops.int, [3]),
      new TealOp(undefined, Ops.add),
      new TealOp(undefined, Ops.add),
    ];
    const actual = flattenBlocks(blocks);

    expect(actual).toEqual(expected);
  });

  it("test_flatten_sequence", function () {
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
    const blocks = [block1, block2, block3, block4, block5];
    const expected = [
      new TealOp(undefined, Ops.int, [1]),
      new TealOp(undefined, Ops.int, [2]),
      new TealOp(undefined, Ops.int, [3]),
      new TealOp(undefined, Ops.int, [4]),
      new TealOp(undefined, Ops.int, [5]),
    ];
    const actual = flattenBlocks(blocks);

    expect(actual).toEqual(expected);
  });

  it("test_flatten_branch", function () {
    const blockTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
      new TealOp(undefined, Ops.return_),
    ]);
    const blockFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
      new TealOp(undefined, Ops.return_),
    ]);
    const block = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    block.trueBlock = blockTrue;
    block.falseBlock = blockFalse;
    block.addIncoming();
    block.validateTree();
    const blocks = [block, blockFalse, blockTrue];
    const expected = [
      new TealOp(undefined, Ops.int, [1]),
      new TealOp(undefined, Ops.bnz, ["l2"]),
      new TealOp(undefined, Ops.byte, ['"false"']),
      new TealOp(undefined, Ops.return_),
      new TealLabel(undefined, "l2"),
      new TealOp(undefined, Ops.byte, ['"true"']),
      new TealOp(undefined, Ops.return_),
    ];
    const actual = flattenBlocks(blocks);

    expect(actual).toEqual(expected);
  });

  it("test_flatten_branch_converge", function () {
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
    const blocks = [block, blockFalse, blockTrue, blockEnd];
    const expected = [
      new TealOp(undefined, Ops.int, [1]),
      new TealOp(undefined, Ops.bnz, ["l2"]),
      new TealOp(undefined, Ops.byte, ['"false"']),
      new TealOp(undefined, Ops.b, ["l3"]),
      new TealLabel(undefined, "l2"),
      new TealOp(undefined, Ops.byte, ['"true"']),
      new TealLabel(undefined, "l3"),
      new TealOp(undefined, Ops.return_),
    ];
    const actual = flattenBlocks(blocks);

    expect(actual).toEqual(expected);
  });

  it("test_flatten_multiple_branch", function () {
    const blockTrueTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true true"']),
      new TealOp(undefined, Ops.return_),
    ]);
    const blockTrueFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true false"']),
      new TealOp(undefined, Ops.err),
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
      new TealOp(undefined, Ops.return_),
    ]);
    const block = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    block.trueBlock = blockTrue;
    block.falseBlock = blockFalse;
    block.addIncoming();
    block.validateTree();
    const blocks = [
      block,
      blockFalse,
      blockTrue,
      blockTrueBranch,
      blockTrueFalse,
      blockTrueTrue,
    ];
    const expected = [
      new TealOp(undefined, Ops.int, [1]),
      new TealOp(undefined, Ops.bnz, ["l2"]),
      new TealOp(undefined, Ops.byte, ['"false"']),
      new TealOp(undefined, Ops.return_),
      new TealLabel(undefined, "l2"),
      new TealOp(undefined, Ops.byte, ['"true"']),
      new TealOp(undefined, Ops.bnz, ["l5"]),
      new TealOp(undefined, Ops.byte, ['"true false"']),
      new TealOp(undefined, Ops.err),
      new TealLabel(undefined, "l5"),
      new TealOp(undefined, Ops.byte, ['"true true"']),
      new TealOp(undefined, Ops.return_),
    ];
    const actual = flattenBlocks(blocks);

    expect(actual).toEqual(expected);
  });

  it("test_flatten_multiple_branch_converge", function () {
    const blockEnd = new TealSimpleBlock([new TealOp(undefined, Ops.return_)]);
    const blockTrueTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true true"']),
    ]);
    blockTrueTrue.nextBlock = blockEnd;
    const blockTrueFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true false"']),
      new TealOp(undefined, Ops.err),
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
    blockFalse.nextBlock = blockEnd;
    const block = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    block.trueBlock = blockTrue;
    block.falseBlock = blockFalse;
    block.addIncoming();
    block.validateTree();
    const blocks = [
      block,
      blockFalse,
      blockTrue,
      blockTrueBranch,
      blockTrueFalse,
      blockTrueTrue,
      blockEnd,
    ];
    const expected = [
      new TealOp(undefined, Ops.int, [1]),
      new TealOp(undefined, Ops.bnz, ["l2"]),
      new TealOp(undefined, Ops.byte, ['"false"']),
      new TealOp(undefined, Ops.b, ["l6"]),
      new TealLabel(undefined, "l2"),
      new TealOp(undefined, Ops.byte, ['"true"']),
      new TealOp(undefined, Ops.bnz, ["l5"]),
      new TealOp(undefined, Ops.byte, ['"true false"']),
      new TealOp(undefined, Ops.err),
      new TealLabel(undefined, "l5"),
      new TealOp(undefined, Ops.byte, ['"true true"']),
      new TealLabel(undefined, "l6"),
      new TealOp(undefined, Ops.return_),
    ];
    const actual = flattenBlocks(blocks);

    expect(actual).toEqual(expected);
  });
});
