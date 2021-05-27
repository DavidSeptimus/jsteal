import "jasmine";
import { TealConditionalBlock } from "./TealConditionalBlock";
import { TealOp } from "./TealOp";
import { Ops } from "./Ops";
import { TealBlock, TealSimpleBlock } from "./TealBlock";
import "../spec-helper";

describe("TealConditionalBock tests", function () {
  function arrEq(tba1: Array<TealBlock>, tba2: Array<TealBlock>) {
    return tba1.every((b1, i) => b1.equals(tba2[i]));
  }

  it("test_constructor", function () {
    const block1 = new TealConditionalBlock([]);
    expect(block1.ops).toEqual([]);
    expect(block1.trueBlock).toBeUndefined();
    expect(block1.falseBlock).toBeUndefined();
    const block2 = new TealConditionalBlock([
      new TealOp(undefined, Ops.int, [1]),
    ]);
    expect(block2.ops).toEqual([new TealOp(undefined, Ops.int, [1])]);
    expect(block2.trueBlock).toBeUndefined();
    expect(block2.falseBlock).toBeUndefined();
  });

  it("test_true_block", function () {
    const block = new TealConditionalBlock([]);
    block.trueBlock = new TealSimpleBlock([
      new TealOp(undefined, Ops.substring3),
    ]);
    expect(block.trueBlock).toEqual(
      new TealSimpleBlock([new TealOp(undefined, Ops.substring3)])
    );
    expect(
      arrEq(block.getOutgoing(), [
        new TealSimpleBlock([new TealOp(undefined, Ops.substring3)]),
      ])
    ).toBeTrue();
  });

  it("test_false_block", function () {
    const block = new TealConditionalBlock([]);
    block.falseBlock = new TealSimpleBlock([
      new TealOp(undefined, Ops.substring3),
    ]);
    expect(block.falseBlock).toEqual(
      new TealSimpleBlock([new TealOp(undefined, Ops.substring3)])
    );
  });

  it("test_outgoing", function () {
    const emptyBlock = new TealConditionalBlock([]);
    expect(emptyBlock.getOutgoing()).toEqual([]);
    const trueBlock = new TealConditionalBlock([]);
    trueBlock.trueBlock = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
    ]);
    expect(trueBlock.getOutgoing()).toEqual([
      new TealSimpleBlock([new TealOp(undefined, Ops.byte, ['"true"'])]),
    ]);
    const falseBlock = new TealConditionalBlock([]);
    falseBlock.falseBlock = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
    ]);
    expect(falseBlock.getOutgoing()).toEqual([
      new TealSimpleBlock([new TealOp(undefined, Ops.byte, ['"false"'])]),
    ]);
    const bothBlock = new TealConditionalBlock([]);
    bothBlock.trueBlock = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"true"']),
    ]);
    bothBlock.falseBlock = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"false"']),
    ]);
    expect(bothBlock.getOutgoing()).toEqual([
      new TealSimpleBlock([new TealOp(undefined, Ops.byte, ['"true"'])]),
      new TealSimpleBlock([new TealOp(undefined, Ops.byte, ['"false"'])]),
    ]);
  });
});
