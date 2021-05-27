import "jasmine";
import { Tmpl } from "./Tmpl";
import { Ops } from "../ir/Ops";
import { TealInputError } from "../Errors";
import { TealOp } from "../ir/TealOp";
import { CompileOptions } from "../compiler/Compiler";
import { TealSimpleBlock } from "../ir/TealBlock";
import { TealType } from "./Types";

describe("Tmpl Tests", function () {
  const options = new CompileOptions();

  it("test_tmpl_int", function () {
    const expr = Tmpl.int("TMPL_AMNT");
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.int, ["TMPL_AMNT"]),
    ]);

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });

  it("test_tmpl_int_invalid", function () {
    expect(() => Tmpl.int("whatever")).toThrowError(TealInputError);
  });

  it("test_tmpl_bytes", function () {
    const expr = Tmpl.bytes("TMPL_NOTE");
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.byte, ["TMPL_NOTE"]),
    ]);

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });

  it("test_tmpl_bytes_invalid", function () {
    expect(() => Tmpl.bytes("whatever")).toThrowError(TealInputError);
  });

  it("test_tmpl_addr", function () {
    const expr = Tmpl.addr("TMPL_RECEIVER0");
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.addr, ["TMPL_RECEIVER0"]),
    ]);

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });

  it("test_tmpl_addr_invalid", function () {
    expect(() => Tmpl.addr("whatever")).toThrowError(TealInputError);
  });
});
