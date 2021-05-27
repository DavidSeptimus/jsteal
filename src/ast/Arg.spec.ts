import "jasmine";
import { TealInputError } from "../Errors";
import { Arg } from "./Arg";
import { Ops } from "../ir/Ops";
import { TealType } from "./Types";
import { TealSimpleBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";
import { CompileOptions } from "../compiler/Compiler";

describe("Arg Tests", function () {
  it("test_arg", function () {
    const expr = new Arg(0);
    expect(expr.typeOf()).toBe(TealType.bytes);
    const expected = new TealSimpleBlock([new TealOp(expr, Ops.arg, [0])]);
    const { argStart: actual } = expr.teal(new CompileOptions());
    expect(actual).toEqual(expected);
  });

  it("test_arg_invalid", function () {
    expect(() => new Arg(("k" as unknown) as number)).toThrowError(
      TealInputError
    );
    expect(() => new Arg(-1)).toThrowError(TealInputError);
    expect(() => new Arg(256)).toThrowError(TealInputError);
  });
});
