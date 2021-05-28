import "jasmine";
import { TealType } from "./Types";
import { Ops } from "../ir/Ops";
import { And, Or } from "./Nary";
import { CompileOptions } from "../compiler/Compiler";
import { Txn } from "./Txn";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealInputError, TealTypeError } from "../Errors";
import { TealOp } from "../ir/TealOp";
import { Int } from "./Int";

describe("Nary Tests", function () {
  const options = new CompileOptions();

  it("test_and_two", function () {
    const args = [new Int(1), new Int(2)];
    const expr = And(...args);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(expr, Ops.logic_and),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_and_three", function () {
    const args = [new Int(1), new Int(2), new Int(3)];
    const expr = And(...args);

    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(expr, Ops.logic_and),
      new TealOp(args[2], Ops.int, [3]),
      new TealOp(expr, Ops.logic_and),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_and_overload", function () {
    const args = [new Int(1), new Int(2)];
    const expr = args[0].And(args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(expr, Ops.logic_and),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_and_invalid", function () {
    expect(() => And(new Int(1))).toThrowError(TealInputError);
    expect(() => And(new Int(1), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => And(Txn.receiver(), new Int(1))).toThrowError(TealTypeError);
    expect(() => And(Txn.receiver(), Txn.receiver())).toThrowError(
      TealTypeError
    );
  });

  it("test_or_two", function () {
    const args = [new Int(1), new Int(0)];
    const expr = Or(...args);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [0]),
      new TealOp(expr, Ops.logic_or),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_or_three", function () {
    const args = [new Int(0), new Int(1), new Int(2)];
    const expr = Or(...args);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [0]),
      new TealOp(args[1], Ops.int, [1]),
      new TealOp(expr, Ops.logic_or),
      new TealOp(args[2], Ops.int, [2]),
      new TealOp(expr, Ops.logic_or),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_or_overload", function () {
    const args = [new Int(1), new Int(0)];
    const expr = args[0].Or(args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [0]),
      new TealOp(expr, Ops.logic_or),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_or_invalid", function () {
    expect(() => Or(new Int(1))).toThrowError(TealInputError);
    expect(() => Or(new Int(1), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Or(Txn.receiver(), new Int(1))).toThrowError(TealTypeError);
    expect(() => Or(Txn.receiver(), Txn.receiver())).toThrowError(
      TealTypeError
    );
  });
});
