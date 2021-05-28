import "jasmine";
import { CompileOptions, DEFAULT_TEAL_MODE } from "../compiler/Compiler";
import { TealComponent } from "../ir/TealComponent";
import { Ops } from "../ir/Ops";
import { Txn } from "./Txn";
import { Int } from "./Int";
import { TealType } from "./Types";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealTypeError } from "../Errors";
import { Assert } from "./Assert";
import { TealConditionalBlock } from "../ir/TealConditionalBlock";
import { Err } from "./Err";
import { TealOp } from "../ir/TealOp";

describe("Assert Tests", function () {
  const teal2Options = new CompileOptions(DEFAULT_TEAL_MODE, 2);
  const teal3Options = new CompileOptions(DEFAULT_TEAL_MODE, 3);

  it("test_teal_2_assert", function () {
    const arg = new Int(1);
    const expr = new Assert(arg);
    expect(expr.typeOf()).toBe(TealType.none);

    const { argStart: expected }: { argStart: TealSimpleBlock } =
      arg.teal(teal2Options);
    const expectedBranch = new TealConditionalBlock([]);
    expectedBranch.trueBlock = new TealSimpleBlock([]);
    expectedBranch.falseBlock = new Err().teal(teal2Options).argStart;
    expected.nextBlock = expectedBranch;

    const { argStart: actual } = expr.teal(teal2Options);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_teal_3_assert", function () {
    const arg = new Int(1);
    const expr = new Assert(arg);
    expect(expr.typeOf()).toBe(TealType.none);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [1]),
      new TealOp(expr, Ops.assert_),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_assert_invalid", function () {
    expect(() => new Assert(Txn.receiver())).toThrowError(TealTypeError);
  });
});
