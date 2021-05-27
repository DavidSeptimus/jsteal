import "jasmine";
import { TealSimpleBlock } from "./TealBlock";
import { Ops } from "./Ops";
import { TealOp } from "./TealOp";

describe("TealSimpleBlockTests", function () {
  it("test_constructor", function () {
    const block1 = new TealSimpleBlock([]);
    expect(block1.ops).toEqual([]);
    expect(block1.nextBlock).toBeUndefined();

    const block2 = new TealSimpleBlock([new TealOp(undefined, Ops.int, [1])]);
    expect(block2.ops).toEqual([new TealOp(undefined, Ops.int, [1])]);
    expect(block2.nextBlock).toBeUndefined();
  });

  it("test_next_block", function () {
    const block = new TealSimpleBlock([]);
    block.nextBlock = new TealSimpleBlock([
      new TealOp(undefined, Ops.substring3),
    ]);
    expect(block.nextBlock).toEqual(
      new TealSimpleBlock([new TealOp(undefined, Ops.substring3)])
    );
  });

  it("test_outgoing", function () {
    const emptyBlock = new TealSimpleBlock([]);
    expect(emptyBlock.getOutgoing()).toEqual([]);

    const block = new TealSimpleBlock([]);
    block.nextBlock = new TealSimpleBlock([
      new TealOp(undefined, Ops.byte, ['"nextBlock"']),
    ]);
    expect(block.getOutgoing()).toEqual([
      new TealSimpleBlock([new TealOp(undefined, Ops.byte, ['"nextBlock"'])]),
    ]);
  });
});
