import "jasmine";
import { Int } from "./Int";
import { TealOp } from "../ir/TealOp";
import { CompileOptions } from "../compiler/Compiler";
import { Txn } from "./Txn";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealType } from "./Types";
import { Nonce } from "./Nonce";
import { Ops } from "../ir/Ops";
import { TealInputError } from "../Errors";

describe("Nonce Tests", function () {
  const options = new CompileOptions();

  it("test_nonce_base32", function () {
    const arg = new Int(1);
    const expr = new Nonce(
      "base32",
      "7Z5PWO2C6LFNQFGHWKSK5H47IQP5OJW2M3HA2QPXTY3WTNP5NU2MHBW27M",
      arg
    );
    expect(expr.typeOf()).toBe(TealType.uint64);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    // copying expr from actual.ops[0] and actual.ops[1] because they can't be determined from outside code.
    const expected = new TealSimpleBlock([
      new TealOp(actual.ops[0].expr, Ops.byte, [
        "base32(7Z5PWO2C6LFNQFGHWKSK5H47IQP5OJW2M3HA2QPXTY3WTNP5NU2MHBW27M)",
      ]),
      new TealOp(actual.ops[1].expr, Ops.pop),
      new TealOp(arg, Ops.int, [1]),
    ]);

    expect(actual).toEqual(expected);
  });

  it("test_nonce_base32_empty", function () {
    const arg = new Int(1);
    const expr = new Nonce("base32", "", arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    // copying expr from actual.ops[0] and actual.ops[1] because they can't be determined from outside code.
    const expected = new TealSimpleBlock([
      new TealOp(actual.ops[0].expr, Ops.byte, ["base32()"]),
      new TealOp(actual.ops[1].expr, Ops.pop),
      new TealOp(arg, Ops.int, [1]),
    ]);

    expect(actual).toEqual(expected);
  });

  it("test_nonce_base64", function () {
    const arg = Txn.sender();
    const expr = new Nonce("base64", "Zm9vYmE=", arg);
    expect(expr.typeOf()).toBe(TealType.bytes);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    // copying expr from actual.ops[0] and actual.ops[1] because they can't be determined from outside code.
    const expected = new TealSimpleBlock([
      new TealOp(actual.ops[0].expr, Ops.byte, ["base64(Zm9vYmE=)"]),
      new TealOp(actual.ops[1].expr, Ops.pop),
      new TealOp(arg, Ops.txn, ["Sender"]),
    ]);

    expect(actual).toEqual(expected);
  });

  it("test_nonce_base64_empty", function () {
    const arg = new Int(1);
    const expr = new Nonce("base64", "", arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    // copying expr from actual.ops[0] and actual.ops[1] because they can't be determined from outside code.
    const expected = new TealSimpleBlock([
      new TealOp(actual.ops[0].expr, Ops.byte, ["base64()"]),
      new TealOp(actual.ops[1].expr, Ops.pop),
      new TealOp(arg, Ops.int, [1]),
    ]);

    expect(actual).toEqual(expected);
  });

  it("test_nonce_base16", function () {
    const arg = new Int(1);
    const expr = new Nonce("base16", "A21212EF", arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    // copying expr from actual.ops[0] and actual.ops[1] because they can't be determined from outside code.
    const expected = new TealSimpleBlock([
      new TealOp(actual.ops[0].expr, Ops.byte, ["0xA21212EF"]),
      new TealOp(actual.ops[1].expr, Ops.pop),
      new TealOp(arg, Ops.int, [1]),
    ]);

    expect(actual).toEqual(expected);
  });

  it("test_nonce_base16_prefix", function () {
    const arg = new Int(1);
    const expr = new Nonce("base16", "0xA21212EF", arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    // copying expr from actual.ops[0] and actual.ops[1] because they can't be determined from outside code.
    const expected = new TealSimpleBlock([
      new TealOp(actual.ops[0].expr, Ops.byte, ["0xA21212EF"]),
      new TealOp(actual.ops[1].expr, Ops.pop),
      new TealOp(arg, Ops.int, [1]),
    ]);

    expect(actual).toEqual(expected);
  });

  it("test_nonce_base16_empty", function () {
    const arg = new Int(6);
    const expr = new Nonce("base16", "", arg);
    expect(expr.typeOf()).toBe(TealType.uint64);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    // copying expr from actual.ops[0] and actual.ops[1] because they can't be determined from outside code.
    const expected = new TealSimpleBlock([
      new TealOp(actual.ops[0].expr, Ops.byte, ["0x"]),
      new TealOp(actual.ops[1].expr, Ops.pop),
      new TealOp(arg, Ops.int, [6]),
    ]);

    expect(actual).toEqual(expected);
  });

  it("test_nonce_invalid", function () {
    expect(() => new Nonce("base23", "", new Int(1))).toThrowError(
      TealInputError
    );
    expect(() => new Nonce("base32", "Zm9vYmE=", new Int(1))).toThrowError(
      TealInputError
    );
    expect(() => new Nonce("base64", "?????", new Int(1))).toThrowError(
      TealInputError
    );
    expect(
      () =>
        new Nonce(
          "base16",
          "7Z5PWO2C6LFNQFGHWKSK5H47IQP5OJW2M3HA2QPXTY3WTNP5NU2MHBW27M",
          new Int(1)
        )
    ).toThrowError(TealInputError);
  });
});
