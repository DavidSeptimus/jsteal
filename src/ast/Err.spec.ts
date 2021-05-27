import "jasmine";
import { TealType } from "./Types";
import { Err } from "./Err";
import { TealSimpleBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";
import { Ops } from "../ir/Ops";
import { CompileOptions } from "../compiler/Compiler";

describe("Err Tests", function () {
  it("test_err", function () {
    const expr = new Err();
    expect(expr.typeOf()).toBe(TealType.none);
    const expected = new TealSimpleBlock([new TealOp(expr, Ops.err)]);
    const { argStart: actual } = expr.teal(new CompileOptions());
    expect(actual).toEqual(expected);
  });
});
