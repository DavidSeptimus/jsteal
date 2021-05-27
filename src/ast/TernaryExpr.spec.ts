import "jasmine";
import { CompileOptions } from "../compiler/Compiler";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";
import { Txn } from "./Txn";
import { TealType } from "./Types";
import { Ops } from "../ir/Ops";
import { TealTypeError } from "../Errors";
import { Bytes } from "./Bytes";
import { Int } from "./Int";
import { ed25519Verify, setBit, setByte, substring } from "./TernaryExpr";

describe("TernaryExpr Tests", function () {
  const options = new CompileOptions();

  it("test_ed25519Verify", function () {
    const args = [new Bytes(["data"]), new Bytes(["sig"]), new Bytes(["key"])];
    const expr = ed25519Verify(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.byte, ['"data"']),
      new TealOp(args[1], Ops.byte, ['"sig"']),
      new TealOp(args[2], Ops.byte, ['"key"']),
      new TealOp(expr, Ops.ed25519Verify),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_ed25519Verify_invalid", function () {
    expect(() =>
      ed25519Verify(new Int(0), new Bytes(["sig"]), new Bytes(["key"]))
    ).toThrowError(TealTypeError);
    expect(() =>
      ed25519Verify(new Bytes(["data"]), new Int(0), new Bytes(["key"]))
    ).toThrowError(TealTypeError);
    expect(() =>
      ed25519Verify(new Bytes(["data"]), new Bytes(["sig"]), new Int(0))
    ).toThrowError(TealTypeError);
  });

  it("test_substring", function () {
    const args = [new Bytes(["my string"]), new Int(0), new Int(2)];
    const expr = substring(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.byte, ['"my string"']),
      new TealOp(args[1], Ops.int, [0]),
      new TealOp(args[2], Ops.int, [2]),
      new TealOp(expr, Ops.substring3),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_substring_invalid", function () {
    expect(() => substring(new Int(0), new Int(0), new Int(2))).toThrowError(
      TealTypeError
    );
    expect(() =>
      substring(new Bytes(["my string"]), Txn.sender(), new Int(2))
    ).toThrowError(TealTypeError);
    expect(() =>
      substring(new Bytes(["my string"]), new Int(0), Txn.sender())
    ).toThrowError(TealTypeError);
  });

  it("test_set_bit_int", function () {
    const args = [new Int(0), new Int(2), new Int(1)];
    const expr = setBit(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [0]),
      new TealOp(args[1], Ops.int, [2]),
      new TealOp(args[2], Ops.int, [1]),
      new TealOp(expr, Ops.setbit),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_set_bit_bytes", function () {
    const args = [new Bytes(["base16", "0x0000"]), new Int(0), new Int(1)];
    const expr = setBit(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.byte, ["0x0000"]),
      new TealOp(args[1], Ops.int, [0]),
      new TealOp(args[2], Ops.int, [1]),
      new TealOp(expr, Ops.setbit),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_set_bit_invalid", function () {
    expect(() =>
      setBit(new Int(3), new Bytes(["index"]), new Int(1))
    ).toThrowError(TealTypeError);
    expect(() =>
      setBit(new Int(3), new Int(0), new Bytes(["one"]))
    ).toThrowError(TealTypeError);
    expect(() =>
      setBit(new Bytes(["base16", "0xFF"]), new Bytes(["index"]), new Int(1))
    ).toThrowError(TealTypeError);
    expect(() =>
      setBit(new Bytes(["base16", "0xFF"]), new Int(0), new Bytes(["one"]))
    ).toThrowError(TealTypeError);
  });

  it("test_set_byte", function () {
    const args = [new Bytes(["base16", "0xFF"]), new Int(0), new Int(3)];
    const expr = setByte(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.byte, ["0xFF"]),
      new TealOp(args[1], Ops.int, [0]),
      new TealOp(args[2], Ops.int, [3]),
      new TealOp(expr, Ops.setbyte),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_set_byte_invalid", function () {
    expect(() => setByte(new Int(3), new Int(0), new Int(1))).toThrowError(
      TealTypeError
    );
    expect(() =>
      setByte(new Bytes(["base16", "0xFF"]), new Bytes(["index"]), new Int(1))
    ).toThrowError(TealTypeError);
    expect(() =>
      setByte(new Bytes(["base16", "0xFF"]), new Int(0), new Bytes(["one"]))
    ).toThrowError(TealTypeError);
  });
});
