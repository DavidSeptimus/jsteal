import "jasmine";
import { TealConditionalBlock } from "../ir/TealConditionalBlock";
import { TealSimpleBlock } from "../ir/TealBlock";
import { CompileOptions } from "../compiler/Compiler";
import { Txn } from "./Txn";
import { TealType } from "./Types";
import { Pop } from "./UnaryExpr";
import { TealTypeError } from "../Errors";
import { If } from "./If";
import { Int } from "./Int";

describe("If Tests", function () {
  const options = new CompileOptions();

  it("test_if_int", function () {
    const args = [new Int(0), new Int(1), new Int(2)];
    const expr = new If(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const { argStart: expected }: { argStart: TealSimpleBlock } = args[0].teal(
      options
    );
    const { argStart: thenBlock }: { argStart: TealSimpleBlock } = args[1].teal(
      options
    );
    const { argStart: elseBlock }: { argStart: TealSimpleBlock } = args[2].teal(
      options
    );
    const expectedBranch = new TealConditionalBlock([]);
    expectedBranch.trueBlock = thenBlock;
    expectedBranch.falseBlock = elseBlock;
    expected.nextBlock = expectedBranch;
    const end = new TealSimpleBlock([]);
    thenBlock.nextBlock = end;
    elseBlock.nextBlock = end;

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });

  it("test_if_bytes", function () {
    const args = [new Int(1), Txn.sender(), Txn.receiver()];
    const expr = new If(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.bytes);

    const { argStart: expected }: { argStart: TealSimpleBlock } = args[0].teal(
      options
    );
    const { argStart: thenBlock }: { argStart: TealSimpleBlock } = args[1].teal(
      options
    );
    const { argStart: elseBlock }: { argStart: TealSimpleBlock } = args[2].teal(
      options
    );
    const expectedBranch = new TealConditionalBlock([]);
    expectedBranch.trueBlock = thenBlock;
    expectedBranch.falseBlock = elseBlock;
    expected.nextBlock = expectedBranch;
    const end = new TealSimpleBlock([]);
    thenBlock.nextBlock = end;
    elseBlock.nextBlock = end;

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });

  it("test_if_none", function () {
    const args = [new Int(0), Pop(Txn.sender()), Pop(Txn.receiver())];
    const expr = new If(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.none);

    const { argStart: expected }: { argStart: TealSimpleBlock } = args[0].teal(
      options
    );
    const { argStart: thenBlockStart, argEnd: thenBlockEnd } = args[1].teal(
      options
    );
    const { argStart: elseBlockStart, argEnd: elseBlockEnd } = args[2].teal(
      options
    );
    const expectedBranch = new TealConditionalBlock([]);
    expectedBranch.trueBlock = thenBlockStart;
    expectedBranch.falseBlock = elseBlockStart;
    expected.nextBlock = expectedBranch;
    const end = new TealSimpleBlock([]);
    thenBlockEnd.nextBlock = end;
    elseBlockEnd.nextBlock = end;

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });

  it("test_if_single", function () {
    const args = [new Int(1), Pop(new Int(1))];
    const expr = new If(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.none);

    const { argStart: expected }: { argStart: TealSimpleBlock } = args[0].teal(
      options
    );
    const { argStart: thenBlockStart, argEnd: thenBlockEnd } = args[1].teal(
      options
    );
    const end = new TealSimpleBlock([]);
    const expectedBranch = new TealConditionalBlock([]);
    expectedBranch.trueBlock = thenBlockStart;
    expectedBranch.falseBlock = end;
    expected.nextBlock = expectedBranch;
    thenBlockEnd.nextBlock = end;

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });

  it("test_if_invalid", function () {
    expect(() => new If(new Int(0), Txn.amount(), Txn.sender())).toThrowError(
      TealTypeError
    );
    expect(() => new If(Txn.sender(), new Int(1), new Int(0))).toThrowError(
      TealTypeError
    );
    expect(() => new If(new Int(0), new Int(1))).toThrowError(TealTypeError);
    expect(() => new If(new Int(0), Txn.sender())).toThrowError(TealTypeError);
  });
});
