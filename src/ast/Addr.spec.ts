import "jasmine";
import { Addr } from "./Addr";
import { TealType } from "./Types";
import { TealSimpleBlock } from "../ir/TealBlock";
import { Ops } from "../ir/Ops";
import { TealOp } from "../ir/TealOp";
import { CompileOptions } from "../compiler/Compiler";
import { TealInputError } from "../Errors";

describe("Addr Tests", function () {
  it("test_addr", function () {
    const expr = new Addr(
      "NJUWK3DJNZTWU2LFNRUW4Z3KNFSWY2LOM5VGSZLMNFXGO2TJMVWGS3THMF"
    );
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.addr, [
        "NJUWK3DJNZTWU2LFNRUW4Z3KNFSWY2LOM5VGSZLMNFXGO2TJMVWGS3THMF",
      ]),
    ]);
    const actual = expr.teal(new CompileOptions()).argStart;
    expect(actual).toEqual(expected);
  });

  it("test_addr_invalid", function () {
    expect(
      () => new Addr("NJUWK3DJNZTWU2LFNRUW4Z3KNFSWY2LOM5VGSZLMNFXGO2TJMVWGS3TH")
    ).toThrowError(TealInputError);

    expect(
      () =>
        new Addr("000000000000000000000000000000000000000000000000000000000")
    ).toThrowError(TealInputError);

    expect(() => new Addr("2")).toThrowError(TealInputError);
  });
});
