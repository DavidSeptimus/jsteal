import "jasmine";
import { TealBlock, TealSimpleBlock } from "./TealBlock";
import { Ops } from "./Ops";
import { TealOp } from "./TealOp";
import { CompileOptions } from "../compiler/Compiler";
import { Bytes } from "../ast/Bytes";
import { Int } from "../ast/Int";
import { TealConditionalBlock } from "./TealConditionalBlock";

const options = new CompileOptions();

describe("TealBock tests", function () {
  it("test_from_op_no_args", function () {
    const op = new TealOp(undefined, Ops.int, [1]);

    const expected = new TealSimpleBlock([op]);

    const { argStart: actual } = TealBlock.fromOp(options, op);

    expect(actual).toEqual(expected);
  });

  it("test_from_op_1_arg", function () {
    const op = new TealOp(undefined, Ops.pop);
    const arg1 = new Bytes(["message"]);

    const expected = new TealSimpleBlock([
      new TealOp(arg1, Ops.byte, ['"message"']),
      op,
    ]);

    let { argStart: actual } = TealBlock.fromOp(options, op, [arg1]);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);
    actual.validateTree();

    expect(actual).toEqual(expected);
  });

  it("test_from_op_2_args", function () {
    const op = new TealOp(undefined, Ops.app_global_put);
    const arg1 = new Bytes(["key"]);
    const arg2 = new Int(5);

    const expected = new TealSimpleBlock([
      new TealOp(arg1, Ops.byte, ['"key"']),
      new TealOp(arg2, Ops.int, [5]),
      op,
    ]);

    let { argStart: actual } = TealBlock.fromOp(options, op, [arg1, arg2]);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);
    actual.validateTree();

    expect(actual).toEqual(expected);
  });

  it("test_from_op_3_args", function () {
    const op = new TealOp(undefined, Ops.app_local_put);
    const arg1 = new Int(0);
    const arg2 = new Bytes(["key"]);
    const arg3 = new Int(1);
    const arg4 = new Int(2);
    const arg3PlusArg4 = arg3.add(arg4);

    const expected = new TealSimpleBlock([
      new TealOp(arg1, Ops.int, [0]),
      new TealOp(arg2, Ops.byte, ['"key"']),
      new TealOp(arg3, Ops.int, [1]),
      new TealOp(arg4, Ops.int, [2]),
      new TealOp(arg3PlusArg4, Ops.add),
      op,
    ]);

    let { argStart: actual } = TealBlock.fromOp(options, op, [
      arg1,
      arg2,
      arg3PlusArg4,
    ]);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);
    actual.validateTree();

    expect(actual).toEqual(expected);
  });

  it("test_iterate_single ", function () {
    const block = new TealSimpleBlock([new TealOp(undefined, Ops.int, [1])]);

    const blocks = Array.from(TealBlock.iterate(block));

    expect(blocks).toEqual([block]);
  });

  it("test_iterate_sequence ", function () {
    const block5 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [5])]);
    const block4 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [4])]);
    block4.nextBlock = block5;
    const block3 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [3])]);
    block3.nextBlock = block4;
    const block2 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [2])]);
    block2.nextBlock = block3;
    const block1 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [1])]);
    block1.nextBlock = block2;

    const blocks = Array.from(TealBlock.iterate(block1));

    expect(blocks).toEqual([block1, block2, block3, block4, block5]);
  });

  it("test_iterate_multiple_branch", function () {
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

    const blocks = Array.from(TealBlock.iterate(block));

    expect(blocks).toEqual([
      block,
      blockTrue,
      blockFalse,
      blockTrueBranch,
      blockTrueTrue,
      blockTrueFalse,
    ]);
  });

  it("test_iterate_branch_converge ", function () {
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

    const blocks = Array.from(TealBlock.iterate(block));

    expect(blocks).toEqual([block, blockTrue, blockFalse, blockEnd]);
  });

  it("test_normalize_single", function () {
    const original = new TealSimpleBlock([new TealOp(undefined, Ops.int, [1])]);
    const expected = new TealSimpleBlock([new TealOp(undefined, Ops.int, [1])]);

    original.addIncoming();
    const actual = TealBlock.normalizeBlocks(original);
    actual.validateTree();

    expect(actual).toEqual(expected);
  });

  it("test_normalize_sequence", function () {
    const block6 = new TealSimpleBlock([]);
    const block5 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [5])]);
    block5.nextBlock = block6;
    const block4 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [4])]);
    block4.nextBlock = block5;
    const block3 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [3])]);
    block3.nextBlock = block4;
    const block2 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [2])]);
    block2.nextBlock = block3;
    const block1 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [1])]);
    block1.nextBlock = block2;
    const expected = new TealSimpleBlock([
      new TealOp(undefined, Ops.int, [1]),
      new TealOp(undefined, Ops.int, [2]),
      new TealOp(undefined, Ops.int, [3]),
      new TealOp(undefined, Ops.int, [4]),
      new TealOp(undefined, Ops.int, [5]),
    ]);

    block1.addIncoming();
    const actual = TealBlock.normalizeBlocks(block1);
    actual.validateTree();

    expect(actual).toEqual(expected);
  });

  it("test_normalize_branch", function () {
    const blockTrueNext = new TealSimpleBlock([
      new TealOp(undefined, Ops.int, [4]),
    ]);
    const blockTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
    ]);
    blockTrue.nextBlock = blockTrueNext;
    const blockFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
    ]);
    const blockBranch = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    blockBranch.trueBlock = blockTrue;
    blockBranch.falseBlock = blockFalse;
    const original = new TealSimpleBlock([]);
    original.nextBlock = blockBranch;
    const expectedTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
      new TealOp(undefined, Ops.int, [4]),
    ]);
    const expectedFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
    ]);
    const expected = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    expected.trueBlock = expectedTrue;
    expected.falseBlock = expectedFalse;

    original.addIncoming();
    const actual = TealBlock.normalizeBlocks(original);
    actual.validateTree();

    expect(actual).toEqual(expected);
  });

  it("test_normalize_branch_converge", function () {
    const blockEnd = new TealSimpleBlock([]);
    const blockTrueNext = new TealSimpleBlock([
      new TealOp(undefined, Ops.int, [4]),
    ]);
    blockTrueNext.nextBlock = blockEnd;
    const blockTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
    ]);
    blockTrue.nextBlock = blockTrueNext;
    const blockFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
    ]);
    blockFalse.nextBlock = blockEnd;
    const blockBranch = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    blockBranch.trueBlock = blockTrue;
    blockBranch.falseBlock = blockFalse;
    const original = new TealSimpleBlock([]);
    original.nextBlock = blockBranch;
    const expectedEnd = new TealSimpleBlock([]);
    const expectedTrue = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
      new TealOp(undefined, Ops.int, [4]),
    ]);
    expectedTrue.nextBlock = expectedEnd;
    const expectedFalse = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
    ]);
    expectedFalse.nextBlock = expectedEnd;
    const expected = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    expected.trueBlock = expectedTrue;
    expected.falseBlock = expectedFalse;

    original.addIncoming();
    const actual = TealBlock.normalizeBlocks(original);
    actual.validateTree();

    expect(actual).toEqual(expected);
  });
});
