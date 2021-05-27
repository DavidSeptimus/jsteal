import "jasmine";
import { TealOp } from "../ir/TealOp";
import { Pop } from "./UnaryExpr";
import { ScratchVar } from "./ScratchVar";
import { Ops } from "../ir/Ops";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { CompileOptions } from "../compiler/Compiler";
import { TealTypeError } from "../Errors";
import { TealType } from "./Types";
import { Bytes } from "./Bytes";
import { Int } from "./Int";

describe("ScratchVar Tests", function () {
  const options = new CompileOptions();

  it("test_scratchvar_type", function () {
    const myvar_default = new ScratchVar();
    expect(myvar_default.storageType()).toBe(TealType.anytype);
    expect(myvar_default.store(new Bytes(["value"])).typeOf()).toBe(
      TealType.none
    );
    expect(myvar_default.load().typeOf()).toBe(TealType.anytype);

    expect(() => myvar_default.store(Pop(new Int(1)))).toThrowError(
      TealTypeError
    );

    const myvar_int = new ScratchVar(TealType.uint64);
    expect(myvar_int.storageType()).toBe(TealType.uint64);
    expect(myvar_int.store(new Int(1)).typeOf()).toBe(TealType.none);
    expect(myvar_int.load().typeOf()).toBe(TealType.uint64);

    expect(() => myvar_int.store(new Bytes(["value"]))).toThrowError(
      TealTypeError
    );
    expect(() => myvar_int.store(Pop(new Int(1)))).toThrowError(TealTypeError);

    const myvar_bytes = new ScratchVar(TealType.bytes);
    expect(myvar_bytes.storageType()).toBe(TealType.bytes);
    expect(myvar_bytes.store(new Bytes(["value"])).typeOf()).toBe(
      TealType.none
    );
    expect(myvar_bytes.load().typeOf()).toBe(TealType.bytes);

    expect(() => myvar_bytes.store(new Int(0))).toThrowError(TealTypeError);
    expect(() => myvar_bytes.store(Pop(new Int(1)))).toThrowError(
      TealTypeError
    );
  });

  it("test_scratchvar_store", function () {
    const myvar = new ScratchVar(TealType.bytes);
    const arg = new Bytes(["value"]);
    const expr = myvar.store(arg);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.byte, ['"value"']),
      new TealOp(expr, Ops.store, [myvar.slot]),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_scratchvar_load", function () {
    const myvar = new ScratchVar();
    const expr = myvar.load();

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.load, [myvar.slot]),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });
});
