import "jasmine";
import { EnumInt, Int } from "./Int";
import { TealInputError } from "../Errors";
import { Ops } from "../ir/Ops";
import { TealOp } from "../ir/TealOp";
import { CompileOptions } from "../compiler/Compiler";
import { TealSimpleBlock } from "../ir/TealBlock";
import { TealType } from "./Types";

describe("Int Tests", function () {
  const options = new CompileOptions();

  it("test_int", function () {
    const values = [0, 1, 8, 232323, 2n ** 64n - 1n];

    for (const value of values) {
      const expr = new Int(value);
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.int, [value]),
      ]);

      const { argStart: actual } = expr.teal(options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_int_invalid", function () {
    expect(() => new Int(6.7)).toThrowError(TealInputError);
    expect(() => new Int(-1)).toThrowError(TealInputError);
    expect(() => new Int(2 ** 64)).toThrowError(TealInputError);
    // expect(() => new Int("0")).toThrowError(TealInputError); // only affects those without TS ¯\_(ツ)_/¯
  });

  it("test_enum_int", function () {
    const expr = new EnumInt("OptIn");
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.int, ["OptIn"]),
    ]);

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });
});
