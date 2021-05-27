import "jasmine";
import { Bytes } from "./Bytes";
import { Ops } from "../ir/Ops";
import { TealInputError } from "../Errors";
import { TealSimpleBlock } from "../ir/TealBlock";
import { TealType } from "./Types";
import { TealOp } from "../ir/TealOp";
import { CompileOptions } from "../compiler/Compiler";

describe("Bytes Tests", function () {
  const options = new CompileOptions();

  it("test_bytes_base32_no_padding", function () {
    for (const s of [
      "ME",
      "MFRA",
      "MFRGG",
      "MFRGGZA",
      "MFRGGZDF",
      "7Z5PWO2C6LFNQFGHWKSK5H47IQP5OJW2M3HA2QPXTY3WTNP5NU2MHBW27M",
    ]) {
      const expr = new Bytes(["base32", s]);
      expect(expr.typeOf()).toBe(TealType.bytes);
      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.byte, ["base32(" + s + ")"]),
      ]);
      const { argStart: actual } = expr.teal(options);
      expect(actual).toEqual(expected);
    }
  });

  it("test_bytes_base32_padding", function () {
    for (const s of [
      "ME======",
      "MFRA====",
      "MFRGG===",
      "MFRGGZA=",
      "7Z5PWO2C6LFNQFGHWKSK5H47IQP5OJW2M3HA2QPXTY3WTNP5NU2MHBW27M======",
    ]) {
      const expr = new Bytes(["base32", s]);
      expect(expr.typeOf()).toBe(TealType.bytes);
      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.byte, ["base32(" + s + ")"]),
      ]);
      const { argStart: actual } = expr.teal(options);
      expect(actual).toEqual(expected);
    }
  });

  it("test_bytes_base32_empty", function () {
    const expr = new Bytes(["base32", ""]);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.byte, ["base32()"]),
    ]);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_bytes_base64", function () {
    const expr = new Bytes(["base64", "Zm9vYmE="]);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.byte, ["base64(Zm9vYmE=)"]),
    ]);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_bytes_base64_empty", function () {
    const expr = new Bytes(["base64", ""]);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.byte, ["base64()"]),
    ]);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_bytes_base16", function () {
    const expr = new Bytes(["base16", "A21212EF"]);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.byte, ["0xA21212EF"]),
    ]);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_bytes_base16_prefix", function () {
    const expr = new Bytes(["base16", "0xA21212EF"]);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.byte, ["0xA21212EF"]),
    ]);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_bytes_base16_empty", function () {
    const expr = new Bytes(["base16", ""]);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([new TealOp(expr, Ops.byte, ["0x"])]);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_bytes_utf8", function () {
    const expr = new Bytes(["hello world"]);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.byte, ['"hello world"']),
    ]);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_bytes_utf8_special_chars", function () {
    const expr = new Bytes(["\t \n \r\n \\ \" ' 😀"]);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.byte, [
        '"\\t \\n \\r\\n \\\\ \\" \' \\xf0\\x9f\\x98\\x80"',
      ]),
    ]);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_bytes_utf8_empty", function () {
    const expr = new Bytes([""]);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([new TealOp(expr, Ops.byte, ['""'])]);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_bytes_invalid", function () {
    expect(() => new Bytes(["base23", ""])).toThrowError(TealInputError);
    expect(() => new Bytes(["base32", "Zm9vYmE="])).toThrowError(
      TealInputError
    );
    expect(() => new Bytes(["base32", "MFRGG===="])).toThrowError(
      TealInputError
    );
    expect(() => new Bytes(["base32", "MFRGG=="])).toThrowError(TealInputError);
    expect(() => new Bytes(["base32", "CCCCCC=="])).toThrowError(
      TealInputError
    );
    expect(() => new Bytes(["base32", "CCCCCC"])).toThrowError(TealInputError);
    expect(() => new Bytes(["base32", "C======="])).toThrowError(
      TealInputError
    );
    expect(() => new Bytes(["base32", "C"])).toThrowError(TealInputError);
    expect(() => new Bytes(["base32", "="])).toThrowError(TealInputError);
    expect(() => new Bytes(["base64", "?????"])).toThrowError(TealInputError);
    expect(
      () =>
        new Bytes([
          "base16",
          "7Z5PWO2C6LFNQFGHWKSK5H47IQP5OJW2M3HA2QPXTY3WTNP5NU2MHBW27M",
        ])
    ).toThrowError(TealInputError);
  });
});
