import "jasmine";
import { CompileOptions, DEFAULT_TEAL_MODE } from "../compiler/Compiler";
import { Ops } from "../ir/Ops";
import { Txn } from "./Txn";
import { TealType } from "./Types";
import {
  Balance,
  BitwiseNot,
  Btoi,
  Itob,
  Keccak256,
  Len,
  MinBalance,
  Not,
  Pop,
  Return,
  Sha256,
  Sha512_256,
} from "./UnaryExpr";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { Arg } from "./Arg";
import { TealTypeError } from "../Errors";
import { Int } from "./Int";
import { TealOp } from "../ir/TealOp";

describe("UnaryExpr Tests", function () {
  const teal2Options = new CompileOptions(DEFAULT_TEAL_MODE, 2);
  const teal3Options = new CompileOptions(DEFAULT_TEAL_MODE, 3);

  it("test_btoi", function () {
    const arg = new Arg(1);
    const expr = Btoi(arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.arg, [1]),
      new TealOp(expr, Ops.btoi),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_btoi_invalid", function () {
    expect(() => Btoi(new Int(1))).toThrowError(TealTypeError);
  });

  it("test_itob", function () {
    const arg = new Int(1);
    const expr = Itob(arg);
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [1]),
      new TealOp(expr, Ops.itob),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_itob_invalid", function () {
    expect(() => Itob(new Arg(1))).toThrowError(TealTypeError);
  });

  it("test_len", function () {
    const arg = Txn.receiver();
    const expr = Len(arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.txn, ["Receiver"]),
      new TealOp(expr, Ops.len),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_len_invalid", function () {
    expect(() => Len(new Int(1))).toThrowError(TealTypeError);
  });

  it("test_sha256", function () {
    const arg = new Arg(0);
    const expr = Sha256(arg);
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.arg, [0]),
      new TealOp(expr, Ops.sha256),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_sha256_invalid", function () {
    expect(() => Sha256(new Int(1))).toThrowError(TealTypeError);
  });

  it("test_sha512_256", function () {
    const arg = new Arg(0);
    const expr = Sha512_256(arg);
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.arg, [0]),
      new TealOp(expr, Ops.sha512_256),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_sha512_256_invalid", function () {
    expect(() => Sha512_256(new Int(1))).toThrowError(TealTypeError);
  });

  it("test_keccak256", function () {
    const arg = new Arg(0);
    const expr = Keccak256(arg);
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.arg, [0]),
      new TealOp(expr, Ops.keccak256),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_keccak256_invalid", function () {
    expect(() => Keccak256(new Int(1))).toThrowError(TealTypeError);
  });

  it("test_not", function () {
    const arg = new Int(1);
    const expr = Not(arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [1]),
      new TealOp(expr, Ops.logic_not),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_not_invalid", function () {
    expect(() => Not(Txn.receiver())).toThrowError(TealTypeError);
  });

  it("test_bitwise_not", function () {
    const arg = new Int(2);
    const expr = BitwiseNot(arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [2]),
      new TealOp(expr, Ops.bitwise_not),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_bitwise_not_overload", function () {
    const arg = new Int(10);
    const expr = arg.invert();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [10]),
      new TealOp(expr, Ops.bitwise_not),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_bitwise_not_invalid", function () {
    expect(() => BitwiseNot(Txn.receiver())).toThrowError(TealTypeError);
  });

  it("test_pop", function () {
    const argInt = new Int(3);
    const exprInt = Pop(argInt);
    expect(exprInt.typeOf()).toBe(TealType.none);

    const expectedInt = new TealSimpleBlock([
      new TealOp(argInt, Ops.int, [3]),
      new TealOp(exprInt, Ops.pop),
    ]);

    let { argStart: actualInt } = exprInt.teal(teal2Options);
    actualInt.addIncoming();
    actualInt = TealBlock.normalizeBlocks(actualInt);

    expect(actualInt).toEqual(expectedInt);

    const argBytes = Txn.receiver();
    const exprBytes = Pop(argBytes);
    expect(exprBytes.typeOf()).toBe(TealType.none);

    const expectedBytes = new TealSimpleBlock([
      new TealOp(argBytes, Ops.txn, ["Receiver"]),
      new TealOp(exprBytes, Ops.pop),
    ]);

    let { argStart: actualBytes } = exprBytes.teal(teal2Options);
    actualBytes.addIncoming();
    actualBytes = TealBlock.normalizeBlocks(actualBytes);

    expect(actualBytes).toEqual(expectedBytes);
  });

  it("test_pop_invalid", function () {
    const expr = Pop(new Int(0));
    expect(() => Pop(expr)).toThrowError(TealTypeError);
  });

  it("test_return", function () {
    const arg = new Int(1);
    const expr = Return(arg);
    expect(expr.typeOf()).toBe(TealType.none);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [1]),
      new TealOp(expr, Ops.return_),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_return_invalid", function () {
    expect(() => Return(Txn.receiver())).toThrowError(TealTypeError);
  });

  it("test_balance", function () {
    const arg = new Int(0);
    const expr = Balance(arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.balance),
    ]);

    let { argStart: actual } = expr.teal(teal2Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_balance_invalid", function () {
    expect(() => Balance(Txn.receiver())).toThrowError(TealTypeError);
  });

  it("test_min_balance", function () {
    const arg = new Int(0);
    const expr = MinBalance(arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.min_balance),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_min_balance_invalid", function () {
    expect(() => MinBalance(Txn.receiver())).toThrowError(TealTypeError);
  });
});
