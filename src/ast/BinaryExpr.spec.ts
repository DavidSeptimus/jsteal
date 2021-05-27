import "jasmine";
import { CompileOptions } from "../compiler/Compiler";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import {
  Add,
  BitwiseAnd,
  BitwiseOr,
  BitwiseXor,
  Div,
  Eq,
  Ge,
  GetBit,
  GetByte,
  Gt,
  Le,
  Lt,
  Minus,
  Mod,
  Mul,
  Neq,
} from "./BinaryExpr";
import { Txn } from "./Txn";
import { TealType } from "./Types";
import { Ops } from "../ir/Ops";
import { TealComponent } from "../ir/TealComponent";
import { TealTypeError } from "../Errors";
import { TealOp } from "../ir/TealOp";
import { Bytes } from "./Bytes";
import { Int } from "./Int";

describe("BinaryExpr tests", function () {
  const options = new CompileOptions();

  it("test_add", function () {
    const args = [new Int(2), new Int(3)];
    const expr = Add(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [2]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(expr, Ops.add),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_add_overload", function () {
    const args = [new Int(2), new Int(3), new Int(4)];
    const expr = args[0].add(args[1]).add(args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [2]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(undefined, Ops.add),
      new TealOp(args[2], Ops.int, [4]),
      new TealOp(undefined, Ops.add),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_add_invalid", function () {
    expect(() => Add(new Int(2), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Add(Txn.sender(), new Int(2))).toThrowError(TealTypeError);
  });

  it("test_minus", function () {
    const args = [new Int(5), new Int(6)];
    const expr = Minus(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [5]),
      new TealOp(args[1], Ops.int, [6]),
      new TealOp(expr, Ops.minus),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_minus_overload", function () {
    const args = [new Int(10), new Int(1), new Int(2)];
    const expr = args[0].sub(args[1]).sub(args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [10]),
      new TealOp(args[1], Ops.int, [1]),
      new TealOp(undefined, Ops.minus),
      new TealOp(args[2], Ops.int, [2]),
      new TealOp(undefined, Ops.minus),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_minus_invalid", function () {
    expect(() => Minus(new Int(2), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Minus(Txn.sender(), new Int(2))).toThrowError(TealTypeError);
  });

  it("test_mul", function () {
    const args = [new Int(3), new Int(8)];
    const expr = Mul(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [3]),
      new TealOp(args[1], Ops.int, [8]),
      new TealOp(expr, Ops.mul),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_mul_overload", function () {
    const args = [new Int(3), new Int(8), new Int(10)];
    const expr = args[0].mul(args[1]).mul(args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [3]),
      new TealOp(args[1], Ops.int, [8]),
      new TealOp(undefined, Ops.mul),
      new TealOp(args[2], Ops.int, [10]),
      new TealOp(undefined, Ops.mul),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_mul_invalid", function () {
    expect(() => Mul(new Int(2), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Mul(Txn.sender(), new Int(2))).toThrowError(TealTypeError);
  });

  it("test_div", function () {
    const args = [new Int(9), new Int(3)];
    const expr = Div(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [9]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(expr, Ops.div),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_div_overload", function () {
    const args = [new Int(9), new Int(3), new Int(3)];
    const expr = args[0].truediv(args[1]).truediv(args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [9]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(undefined, Ops.div),
      new TealOp(args[2], Ops.int, [3]),
      new TealOp(undefined, Ops.div),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_div_invalid", function () {
    expect(() => Div(new Int(2), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Div(Txn.sender(), new Int(2))).toThrowError(TealTypeError);
  });

  it("test_mod", function () {
    const args = [new Int(10), new Int(9)];
    const expr = Mod(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [10]),
      new TealOp(args[1], Ops.int, [9]),
      new TealOp(expr, Ops.mod),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_mod_overload", function () {
    const args = [new Int(10), new Int(9), new Int(100)];
    const expr = args[0].mod(args[1]).mod(args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [10]),
      new TealOp(args[1], Ops.int, [9]),
      new TealOp(undefined, Ops.mod),
      new TealOp(args[2], Ops.int, [100]),
      new TealOp(undefined, Ops.mod),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_mod_invalid", function () {
    expect(() => Mod(Txn.receiver(), new Int(2))).toThrowError(TealTypeError);
    expect(() => Mod(new Int(2), Txn.sender())).toThrowError(TealTypeError);
  });

  it("test_arithmetic", function () {
    const args = [
      new Int(2),
      new Int(3),
      new Int(5),
      new Int(6),
      new Int(8),
      new Int(9),
    ];
    const v = args[0]
      .add(args[1])
      .truediv(args[2].sub(args[3]).mul(args[4]))
      .mod(args[5]);
    expect(v.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [2]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(undefined, Ops.add),
      new TealOp(args[2], Ops.int, [5]),
      new TealOp(args[3], Ops.int, [6]),
      new TealOp(undefined, Ops.minus),
      new TealOp(args[4], Ops.int, [8]),
      new TealOp(undefined, Ops.mul),
      new TealOp(undefined, Ops.div),
      new TealOp(args[5], Ops.int, [9]),
      new TealOp(undefined, Ops.mod),
    ]);

    let { argStart: actual } = v.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_bitwise_and", function () {
    const args = [new Int(1), new Int(2)];
    const expr = BitwiseAnd(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(expr, Ops.bitwise_and),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_bitwise_and_overload", function () {
    const args = [new Int(1), new Int(2), new Int(4)];
    const expr = args[0].and(args[1]).and(args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(undefined, Ops.bitwise_and),
      new TealOp(args[2], Ops.int, [4]),
      new TealOp(undefined, Ops.bitwise_and),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_bitwise_and_invalid", function () {
    expect(() => BitwiseAnd(new Int(2), Txn.receiver())).toThrowError(
      TealTypeError
    );
    expect(() => BitwiseAnd(Txn.sender(), new Int(2))).toThrowError(
      TealTypeError
    );
  });

  it("test_bitwise_or", function () {
    const args = [new Int(1), new Int(2)];
    const expr = BitwiseOr(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(expr, Ops.bitwise_or),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_bitwise_or_overload", function () {
    const args = [new Int(1), new Int(2), new Int(4)];
    const expr = args[0].or(args[1]).or(args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(undefined, Ops.bitwise_or),
      new TealOp(args[2], Ops.int, [4]),
      new TealOp(undefined, Ops.bitwise_or),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_bitwise_or_invalid", function () {
    expect(() => BitwiseOr(new Int(2), Txn.receiver())).toThrowError(
      TealTypeError
    );
    expect(() => BitwiseOr(Txn.sender(), new Int(2))).toThrowError(
      TealTypeError
    );
  });

  it("test_bitwise_xor", function () {
    const args = [new Int(1), new Int(3)];
    const expr = BitwiseXor(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(expr, Ops.bitwise_xor),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_bitwise_xor_overload", function () {
    const args = [new Int(1), new Int(3), new Int(5)];
    const expr = args[0].xor(args[1]).xor(args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(undefined, Ops.bitwise_xor),
      new TealOp(args[2], Ops.int, [5]),
      new TealOp(undefined, Ops.bitwise_xor),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_bitwise_xor_invalid", function () {
    expect(() => BitwiseXor(new Int(2), Txn.receiver())).toThrowError(
      TealTypeError
    );
    expect(() => BitwiseXor(Txn.sender(), new Int(2))).toThrowError(
      TealTypeError
    );
  });

  it("test_eq", function () {
    const argsInt = [new Int(2), new Int(3)];
    const exprInt = Eq(argsInt[0], argsInt[1]);
    expect(exprInt.typeOf()).toBe(TealType.uint64);

    const expectedInt = new TealSimpleBlock([
      new TealOp(argsInt[0], Ops.int, [2]),
      new TealOp(argsInt[1], Ops.int, [3]),
      new TealOp(exprInt, Ops.eq),
    ]);

    let { argStart: actualInt } = exprInt.teal(options);
    actualInt.addIncoming();
    actualInt = TealBlock.normalizeBlocks(actualInt);

    expect(actualInt).toEqual(expectedInt);

    const argsBytes = [Txn.receiver(), Txn.sender()];
    const exprBytes = Eq(argsBytes[0], argsBytes[1]);
    expect(exprBytes.typeOf()).toBe(TealType.uint64);

    const expectedBytes = new TealSimpleBlock([
      new TealOp(argsBytes[0], Ops.txn, ["Receiver"]),
      new TealOp(argsBytes[1], Ops.txn, ["Sender"]),
      new TealOp(exprBytes, Ops.eq),
    ]);

    let { argStart: actualBytes } = exprBytes.teal(options);
    actualBytes.addIncoming();
    actualBytes = TealBlock.normalizeBlocks(actualBytes);

    expect(actualBytes).toEqual(expectedBytes);
  });

  it("test_eq_overload", function () {
    const argsInt = [new Int(2), new Int(3)];
    const exprInt = argsInt[0].eq(argsInt[1]);
    expect(exprInt.typeOf()).toBe(TealType.uint64);

    const expectedInt = new TealSimpleBlock([
      new TealOp(argsInt[0], Ops.int, [2]),
      new TealOp(argsInt[1], Ops.int, [3]),
      new TealOp(exprInt, Ops.eq),
    ]);

    let { argStart: actualInt } = exprInt.teal(options);
    actualInt.addIncoming();
    actualInt = TealBlock.normalizeBlocks(actualInt);

    expect(actualInt).toEqual(expectedInt);

    const argsBytes = [Txn.receiver(), Txn.sender()];
    const exprBytes = argsBytes[0].eq(argsBytes[1]);
    expect(exprBytes.typeOf()).toBe(TealType.uint64);

    const expectedBytes = new TealSimpleBlock([
      new TealOp(argsBytes[0], Ops.txn, ["Receiver"]),
      new TealOp(argsBytes[1], Ops.txn, ["Sender"]),
      new TealOp(exprBytes, Ops.eq),
    ]);

    let { argStart: actualBytes } = exprBytes.teal(options);
    actualBytes.addIncoming();
    actualBytes = TealBlock.normalizeBlocks(actualBytes);

    expect(actualBytes).toEqual(expectedBytes);
  });

  it("test_eq_invalid", function () {
    expect(() => Eq(Txn.fee(), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Eq(Txn.sender(), new Int(7))).toThrowError(TealTypeError);
  });

  it("test_neq", function () {
    const argsInt = [new Int(2), new Int(3)];
    const exprInt = Neq(argsInt[0], argsInt[1]);
    expect(exprInt.typeOf()).toBe(TealType.uint64);

    const expectedInt = new TealSimpleBlock([
      new TealOp(argsInt[0], Ops.int, [2]),
      new TealOp(argsInt[1], Ops.int, [3]),
      new TealOp(exprInt, Ops.neq),
    ]);

    let { argStart: actualInt } = exprInt.teal(options);
    actualInt.addIncoming();
    actualInt = TealBlock.normalizeBlocks(actualInt);

    expect(actualInt).toEqual(expectedInt);

    const argsBytes = [Txn.receiver(), Txn.sender()];
    const exprBytes = Neq(argsBytes[0], argsBytes[1]);
    expect(exprBytes.typeOf()).toBe(TealType.uint64);

    const expectedBytes = new TealSimpleBlock([
      new TealOp(argsBytes[0], Ops.txn, ["Receiver"]),
      new TealOp(argsBytes[1], Ops.txn, ["Sender"]),
      new TealOp(exprBytes, Ops.neq),
    ]);

    let { argStart: actualBytes } = exprBytes.teal(options);
    actualBytes.addIncoming();
    actualBytes = TealBlock.normalizeBlocks(actualBytes);

    expect(actualBytes).toEqual(expectedBytes);
  });

  it("test_neq_overload", function () {
    const argsInt = [new Int(2), new Int(3)];
    const exprInt = argsInt[0].ne(argsInt[1]);
    expect(exprInt.typeOf()).toBe(TealType.uint64);

    const expectedInt = new TealSimpleBlock([
      new TealOp(argsInt[0], Ops.int, [2]),
      new TealOp(argsInt[1], Ops.int, [3]),
      new TealOp(exprInt, Ops.neq),
    ]);

    let { argStart: actualInt } = exprInt.teal(options);
    actualInt.addIncoming();
    actualInt = TealBlock.normalizeBlocks(actualInt);

    expect(actualInt).toEqual(expectedInt);

    const argsBytes = [Txn.receiver(), Txn.sender()];
    const exprBytes = argsBytes[0].ne(argsBytes[1]);
    expect(exprBytes.typeOf()).toBe(TealType.uint64);

    const expectedBytes = new TealSimpleBlock([
      new TealOp(argsBytes[0], Ops.txn, ["Receiver"]),
      new TealOp(argsBytes[1], Ops.txn, ["Sender"]),
      new TealOp(exprBytes, Ops.neq),
    ]);

    let { argStart: actualBytes } = exprBytes.teal(options);
    actualBytes.addIncoming();
    actualBytes = TealBlock.normalizeBlocks(actualBytes);

    expect(actualBytes).toEqual(expectedBytes);
  });

  it("test_neq_invalid", function () {
    expect(() => Neq(Txn.fee(), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Neq(Txn.sender(), new Int(7))).toThrowError(TealTypeError);
  });

  it("test_lt", function () {
    const args = [new Int(2), new Int(3)];
    const expr = Lt(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [2]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(expr, Ops.lt),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_lt_overload", function () {
    const args = [new Int(2), new Int(3)];
    const expr = args[0].lt(args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [2]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(expr, Ops.lt),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_lt_invalid", function () {
    expect(() => Lt(new Int(7), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Lt(Txn.sender(), new Int(7))).toThrowError(TealTypeError);
  });

  it("test_le", function () {
    const args = [new Int(1), new Int(2)];
    const expr = Le(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(expr, Ops.le),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_le_overload", function () {
    const args = [new Int(1), new Int(2)];
    const expr = args[0].le(args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(expr, Ops.le),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_le_invalid", function () {
    expect(() => Le(new Int(1), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Le(Txn.sender(), new Int(1))).toThrowError(TealTypeError);
  });

  it("test_gt", function () {
    const args = [new Int(2), new Int(3)];
    const expr = Gt(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [2]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(expr, Ops.gt),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gt_overload", function () {
    const args = [new Int(2), new Int(3)];
    const expr = args[0].gt(args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [2]),
      new TealOp(args[1], Ops.int, [3]),
      new TealOp(expr, Ops.gt),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gt_invalid", function () {
    expect(() => Gt(new Int(1), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Gt(Txn.receiver(), new Int(1))).toThrowError(TealTypeError);
  });

  it("test_ge", function () {
    const args = [new Int(1), new Int(10)];
    const expr = Ge(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [10]),
      new TealOp(expr, Ops.ge),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_ge_overload", function () {
    const args = [new Int(1), new Int(10)];
    const expr = args[0].ge(args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [10]),
      new TealOp(expr, Ops.ge),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_ge_invalid", function () {
    expect(() => Ge(new Int(1), Txn.receiver())).toThrowError(TealTypeError);
    expect(() => Ge(Txn.receiver(), new Int(1))).toThrowError(TealTypeError);
  });

  it("test_get_bit_int", function () {
    const args = [new Int(3), new Int(1)];
    const expr = GetBit(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [3]),
      new TealOp(args[1], Ops.int, [1]),
      new TealOp(expr, Ops.getbit),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_get_bit_bytes", function () {
    const args = [new Bytes(["base16", "0xFF"]), new Int(1)];
    const expr = GetBit(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.byte, ["0xFF"]),
      new TealOp(args[1], Ops.int, [1]),
      new TealOp(expr, Ops.getbit),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_get_bit_invalid", function () {
    expect(() => GetBit(new Int(3), new Bytes(["index"]))).toThrowError(
      TealTypeError
    );
    expect(() =>
      GetBit(new Bytes(["base16", "0xFF"]), new Bytes(["index"]))
    ).toThrowError(TealTypeError);
  });

  it("test_get_byte", function () {
    const args = [new Bytes(["base16", "0xFF"]), new Int(0)];
    const expr = GetByte(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.byte, ["0xFF"]),
      new TealOp(args[1], Ops.int, [0]),
      new TealOp(expr, Ops.getbyte),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_get_byte_invalid", function () {
    expect(() => GetByte(new Int(3), new Int(0))).toThrowError(TealTypeError);
    expect(() =>
      GetBit(new Bytes(["base16", "0xFF"]), new Bytes(["index"]))
    ).toThrowError(TealTypeError);
  });
});
