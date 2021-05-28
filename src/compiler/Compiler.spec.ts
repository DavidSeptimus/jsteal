import "jasmine";
import { AssetHolding } from "../ast/Asset";
import { App } from "../ast/App";
import { TealInputError, TealInternalError } from "../Errors";
import { Mode } from "../ir/Ops";
import { compileTeal } from "./Compiler";
import { Itob, Pop } from "../ast/UnaryExpr";
import { Concat } from "../ast/Nary";
import { Tmpl } from "../ast/Tmpl";
import { If } from "../ast/If";
import { Bytes } from "../ast/Bytes";
import { Int } from "../ast/Int";
import { Seq } from "../ast/Seq";
import { ScratchVar } from "../ast/ScratchVar";

declare global {
  interface String {
    stripWhitespace(): string;
  }
}

String.prototype.stripWhitespace = function () {
  return (this as string).replace(/^\s*/gm, "").replace(/\s*$/gm, "");
};

describe("Compiler Tests", function () {
  it("test_compile_single", function () {
    const expr = new Int(1);
    const expected = `
      #pragma version 2
      int 1
      `.stripWhitespace();
    const actualApplication = compileTeal(expr, Mode.Application);
    const actualSignature = compileTeal(expr, Mode.Signature);

    expect(actualApplication).toEqual(actualSignature);
    expect(actualApplication).toEqual(expected);
  });
  it("test_compile_sequence", function () {
    const expr = new Seq([
      Pop(new Int(1)),
      Pop(new Int(2)),
      new Int(3).add(new Int(4)),
    ]);
    const expected = `
      #pragma version 2
      int 1
      pop
      int 2
      pop
      int 3
      int 4
      +
        `.stripWhitespace();
    const actualApplication = compileTeal(expr, Mode.Application);
    const actualSignature = compileTeal(expr, Mode.Signature);

    expect(actualApplication).toEqual(actualSignature);
    expect(actualApplication).toEqual(expected);
  });
  it("test_compile_branch", function () {
    const expr = new If(new Int(1), new Bytes(["true"]), new Bytes(["false"]));
    const expected = `
      #pragma version 2
      int 1
      bnz l2
      byte "false"
      b l3
      l2:
        byte "true"
      l3:
          `.stripWhitespace();
    const actualApplication = compileTeal(expr, Mode.Application);
    const actualSignature = compileTeal(expr, Mode.Signature);

    expect(actualApplication).toEqual(actualSignature);
    expect(actualApplication).toEqual(expected);
  });
  it("test_compile_mode", function () {
    const expr = App.globalGet(new Bytes(["key"]));
    const expected = `
      #pragma version 2
      byte "key"
      app_global_get
        `.stripWhitespace();
    const actualApplication = compileTeal(expr, Mode.Application);

    expect(actualApplication).toEqual(expected);
    expect(() => compileTeal(expr, Mode.Signature)).toThrowError(
      TealInputError
    );
  });

  it("test_compile_version_invalid", function () {
    const expr = new Int(1);

    expect(() => compileTeal(expr, Mode.Signature, 1)).toThrowError(
      TealInputError
    );
    // too small

    expect(() => compileTeal(expr, Mode.Signature, 4)).toThrowError(
      TealInputError
    );
    // too large

    expect(() => compileTeal(expr, Mode.Signature, 2.1)).toThrowError(
      TealInputError
    );
    // decimal
  });

  it("test_compile_version_2", function () {
    const expr = new Int(1);
    const expected = `
      #pragma version 2
      int 1
        `.stripWhitespace();
    const actual = compileTeal(expr, Mode.Signature, 2);

    expect(actual).toEqual(expected);
  });

  it("test_compile_version_default", function () {
    const expr = new Int(1);
    const actual_default = compileTeal(expr, Mode.Signature);
    const actual_version_2 = compileTeal(expr, Mode.Signature, 2);

    expect(actual_default).toEqual(actual_version_2);
  });

  it("test_compile_version_3", function () {
    const expr = new Int(1);
    const expected = `
      #pragma version 3
      int 1
        `.stripWhitespace();
    const actual = compileTeal(expr, Mode.Signature, 3);

    expect(actual).toEqual(expected);
  });

  it("test_slot_load_before_store", function () {
    let program = AssetHolding.balance(new Int(0), new Int(0)).value();
    expect(() => compileTeal(program, Mode.Application, 2)).toThrowError(
      TealInternalError
    );

    program = AssetHolding.balance(new Int(0), new Int(0)).hasValue();
    expect(() => compileTeal(program, Mode.Application, 2)).toThrowError(
      TealInternalError
    );

    program = App.globalGetEx(new Int(0), new Bytes(["key"])).value();
    expect(() => compileTeal(program, Mode.Application, 2)).toThrowError(
      TealInternalError
    );

    program = App.globalGetEx(new Int(0), new Bytes(["key"])).hasValue();
    expect(() => compileTeal(program, Mode.Application, 2)).toThrowError(
      TealInternalError
    );

    program = new ScratchVar().load();
    expect(() => compileTeal(program, Mode.Application, 2)).toThrowError(
      TealInternalError
    );
  });
  it("test_assembleConstants", function () {
    const program = Itob(
      new Int(1).add(new Int(1)).add(Tmpl.int("TMPL_VAR"))
    ).eq(
      Concat(new Bytes(["test"]), new Bytes(["test"]), new Bytes(["test2"]))
    );
    const expectedNoAssemble = `
      #pragma version 3
      int 1
      int 1
      +
      int TMPL_VAR
      +
      itob
      byte "test"
      byte "test"
      concat
      byte "test2"
      concat
      ==
        `.stripWhitespace();
    const actualNoAssemble = compileTeal(program, Mode.Application, 3, false);
    expect(expectedNoAssemble).toEqual(actualNoAssemble);
    const expectedAssemble = `
      #pragma version 3
      intcblock 1
      bytecblock 0x74657374
      intc_0 // 1
      intc_0 // 1
      +
      pushint TMPL_VAR // TMPL_VAR
      +
      itob
      bytec_0 // "test"
      bytec_0 // "test"
      concat
      pushbytes 0x7465737432 // "test2"
      concat
      ==
        `.stripWhitespace();
    const actualAssemble = compileTeal(program, Mode.Application, 3, true);
    expect(expectedAssemble).toEqual(actualAssemble);
    expect(() => compileTeal(program, Mode.Application, 2, true)).toThrowError(
      TealInternalError
    );
  });
});
