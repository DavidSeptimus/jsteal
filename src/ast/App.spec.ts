import "jasmine";
import { App, OnComplete } from "./App";
import { TealTypeError } from "../Errors";
import { Txn } from "./Txn";
import { TealType } from "./Types";
import { Ops } from "../ir/Ops";
import { Global } from "./Global";
import { Pop } from "./UnaryExpr";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { TealComponent } from "../ir/TealComponent";
import { Int } from "./Int";
import { Bytes } from "./Bytes";
import { CompileOptions } from "../compiler/Compiler";
import { TealOp } from "../ir/TealOp";

describe("App Tests", function () {
  const options = new CompileOptions();

  it("test_on_complete", function () {
    expect(OnComplete.NoOp.teal(options).argStart).toEqual(
      new TealSimpleBlock([new TealOp(OnComplete.NoOp, Ops.int, ["NoOp"])])
    );

    expect(OnComplete.OptIn.teal(options).argStart).toEqual(
      new TealSimpleBlock([new TealOp(OnComplete.OptIn, Ops.int, ["OptIn"])])
    );

    expect(OnComplete.CloseOut.teal(options).argStart).toEqual(
      new TealSimpleBlock([
        new TealOp(OnComplete.CloseOut, Ops.int, ["CloseOut"]),
      ])
    );

    expect(OnComplete.ClearState.teal(options).argStart).toEqual(
      new TealSimpleBlock([
        new TealOp(OnComplete.ClearState, Ops.int, ["ClearState"]),
      ])
    );

    expect(OnComplete.UpdateApplication.teal(options).argStart).toEqual(
      new TealSimpleBlock([
        new TealOp(OnComplete.UpdateApplication, Ops.int, [
          "UpdateApplication",
        ]),
      ])
    );

    expect(OnComplete.DeleteApplication.teal(options).argStart).toEqual(
      new TealSimpleBlock([
        new TealOp(OnComplete.DeleteApplication, Ops.int, [
          "DeleteApplication",
        ]),
      ])
    );
  });

  it("test_app_id", function () {
    const expr = App.id();
    expect(expr.typeOf()).toBe(TealType.uint64);
    TealComponent.withIgnoreExprEquality(() => {
      expect(expr.teal(options).argStart).toEqual(
        Global.currentApplicationId().teal(options).argStart
      );
    });
  });

  it("test_opted_in", function () {
    const args = [new Int(1), new Int(12)];
    const expr = App.optedIn(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [1]),
      new TealOp(args[1], Ops.int, [12]),
      new TealOp(expr, Ops.app_opted_in),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_local_get", function () {
    const args = [new Int(0), new Bytes(["key"])];
    const expr = App.localGet(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.anytype);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [0]),
      new TealOp(args[1], Ops.byte, ['"key"']),
      new TealOp(expr, Ops.app_local_get),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_local_get_invalid", function () {
    expect(() => App.localGet(Txn.sender(), new Bytes(["key"]))).toThrowError(
      TealTypeError
    );
    expect(() => App.localGet(new Int(0), new Int(1))).toThrowError(
      TealTypeError
    );
  });

  it("test_local_get_ex", function () {
    const args = [new Int(0), new Int(6), new Bytes(["key"])];
    const expr = App.localGetEx(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.anytype);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [0]),
      new TealOp(args[1], Ops.int, [6]),
      new TealOp(args[2], Ops.byte, ['"key"']),
      new TealOp(expr, Ops.app_local_get_ex),
      new TealOp(undefined, Ops.store, [expr.slotOk]),
      new TealOp(undefined, Ops.store, [expr.slotValue]),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_local_get_ex_invalid", function () {
    expect(() =>
      App.localGetEx(Txn.sender(), new Int(0), new Bytes(["key"]))
    ).toThrowError(TealTypeError);
    expect(() =>
      App.localGetEx(new Int(0), new Bytes(["app"]), new Bytes(["key"]))
    ).toThrowError(TealTypeError);
    expect(() =>
      App.localGetEx(new Int(0), new Int(0), new Int(1))
    ).toThrowError(TealTypeError);
  });

  it("test_global_get", function () {
    const arg = new Bytes(["key"]);
    const expr = App.globalGet(arg);
    expect(expr.typeOf()).toBe(TealType.anytype);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.byte, ['"key"']),
      new TealOp(expr, Ops.app_global_get),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_global_get_invalid", function () {
    expect(() => App.globalGet(new Int(7))).toThrowError(TealTypeError);
  });

  it("test_global_get_ex", function () {
    const args = [new Int(6), new Bytes(["key"])];
    const expr = App.globalGetEx(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.anytype);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [6]),
      new TealOp(args[1], Ops.byte, ['"key"']),
      new TealOp(expr, Ops.app_global_get_ex),
      new TealOp(undefined, Ops.store, [expr.slotOk]),
      new TealOp(undefined, Ops.store, [expr.slotValue]),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_global_get_ex_invalid", function () {
    expect(() =>
      App.globalGetEx(new Bytes(["app"]), new Bytes(["key"]))
    ).toThrowError(TealTypeError);
    expect(() => App.globalGetEx(new Int(0), new Int(1))).toThrowError(
      TealTypeError
    );
  });

  it("test_local_put", function () {
    const args = [new Int(0), new Bytes(["key"]), new Int(5)];
    const expr = App.localPut(args[0], args[1], args[2]);
    expect(expr.typeOf()).toBe(TealType.none);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [0]),
      new TealOp(args[1], Ops.byte, ['"key"']),
      new TealOp(args[2], Ops.int, [5]),
      new TealOp(expr, Ops.app_local_put),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_local_put_invalid", function () {
    expect(() =>
      App.localPut(Txn.sender(), new Bytes(["key"]), new Int(5))
    ).toThrowError(TealTypeError);
    expect(() => App.localPut(new Int(1), new Int(0), new Int(5))).toThrowError(
      TealTypeError
    );
    expect(() =>
      App.localPut(new Int(1), new Bytes(["key"]), Pop(new Int(1)))
    ).toThrowError(TealTypeError);
  });

  it("test_global_put", function () {
    const args = [new Bytes(["key"]), new Int(5)];
    const expr = App.globalPut(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.none);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.byte, ['"key"']),
      new TealOp(args[1], Ops.int, [5]),
      new TealOp(expr, Ops.app_global_put),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_global_put_invalid", function () {
    expect(() => App.globalPut(new Int(0), new Int(5))).toThrowError(
      TealTypeError
    );
    expect(() =>
      App.globalPut(new Bytes(["key"]), Pop(new Int(1)))
    ).toThrowError(TealTypeError);
  });

  it("test_local_del", function () {
    const args = [new Int(0), new Bytes(["key"])];
    const expr = App.localDel(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.none);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [0]),
      new TealOp(args[1], Ops.byte, ['"key"']),
      new TealOp(expr, Ops.app_local_del),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_local_del_invalid", function () {
    expect(() => App.localDel(Txn.sender(), new Bytes(["key"]))).toThrowError(
      TealTypeError
    );
    expect(() => App.localDel(new Int(1), new Int(2))).toThrowError(
      TealTypeError
    );
  });

  it("test_global_del", function () {
    const arg = new Bytes(["key"]);
    const expr = App.globalDel(arg);
    expect(expr.typeOf()).toBe(TealType.none);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.byte, ['"key"']),
      new TealOp(expr, Ops.app_global_del),
    ]);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_global_del_invalid", function () {
    expect(() => App.globalDel(new Int(2))).toThrowError(TealTypeError);
  });
});
