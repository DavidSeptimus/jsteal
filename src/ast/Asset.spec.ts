import "jasmine";
import { TealComponent } from "../ir/TealComponent";
import { Ops } from "../ir/Ops";
import { Txn } from "./Txn";
import { TealType } from "./Types";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { AssetHolding, AssetParam } from "./Asset";
import { TealTypeError } from "../Errors";
import { TealOp } from "../ir/TealOp";
import { Int } from "./Int";
import { CompileOptions } from "../compiler/Compiler";

describe("Asset Tests", function () {
  const options = new CompileOptions();

  it("test_asset_holding_balance", function () {
    const args = [new Int(0), new Int(17)];
    const expr = AssetHolding.balance(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [0]),
      new TealOp(args[1], Ops.int, [17]),
      new TealOp(expr, Ops.asset_holding_get, ["AssetBalance"]),
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

  it("test_asset_holding_balance_invalid", function () {
    expect(() => AssetHolding.balance(Txn.sender(), new Int(17))).toThrowError(
      TealTypeError
    );
    expect(() => AssetHolding.balance(new Int(0), Txn.receiver())).toThrowError(
      TealTypeError
    );
  });

  it("test_asset_holding_frozen", function () {
    const args = [new Int(0), new Int(17)];
    const expr = AssetHolding.frozen(args[0], args[1]);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(args[0], Ops.int, [0]),
      new TealOp(args[1], Ops.int, [17]),
      new TealOp(expr, Ops.asset_holding_get, ["AssetFrozen"]),
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

  it("test_asset_holding_frozen_invalid", function () {
    expect(() => AssetHolding.frozen(Txn.sender(), new Int(17))).toThrowError(
      TealTypeError
    );
    expect(() => AssetHolding.frozen(new Int(0), Txn.receiver())).toThrowError(
      TealTypeError
    );
  });

  it("test_asset_param_total", function () {
    const arg = new Int(0);
    const expr = AssetParam.total(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.asset_params_get, ["AssetTotal"]),
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

  it("test_asset_param_total_invalid", function () {
    expect(() => AssetParam.total(Txn.sender())).toThrowError(TealTypeError);
  });

  it("test_asset_param_decimals", function () {
    const arg = new Int(0);
    const expr = AssetParam.decimals(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.asset_params_get, ["AssetDecimals"]),
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

  it("test_asset_param_decimals_invalid", function () {
    expect(() => AssetParam.decimals(Txn.sender())).toThrowError(TealTypeError);
  });

  it("test_asset_param_default_frozen", function () {
    const arg = new Int(0);
    const expr = AssetParam.defaultFrozen(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.asset_params_get, ["AssetDefaultFrozen"]),
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

  it("test_asset_param_default_frozen_invalid", function () {
    expect(() => AssetParam.defaultFrozen(Txn.sender())).toThrowError(
      TealTypeError
    );
  });

  it("test_asset_param_unit_name", function () {
    const arg = new Int(0);
    const expr = AssetParam.unitName(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.asset_params_get, ["AssetUnitName"]),
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

  it("test_asset_param_unit_name_invalid", function () {
    expect(() => AssetParam.unitName(Txn.sender())).toThrowError(TealTypeError);
  });

  it("test_asset_param_name", function () {
    const arg = new Int(0);
    const expr = AssetParam.assetName(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.asset_params_get, ["AssetName"]),
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

  it("test_asset_param_name_invalid", function () {
    expect(() => AssetParam.assetName(Txn.sender())).toThrowError(
      TealTypeError
    );
  });

  it("test_asset_param_url", function () {
    const arg = new Int(0);
    const expr = AssetParam.url(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.asset_params_get, ["AssetURL"]),
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

  it("test_asset_param_url_invalid", function () {
    expect(() => AssetParam.url(Txn.sender())).toThrowError(TealTypeError);
  });

  it("test_asset_param_metadata_hash", function () {
    const arg = new Int(0);
    const expr = AssetParam.metadataHash(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.asset_params_get, ["AssetMetadataHash"]),
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

  it("test_asset_param_metadata_hash_invalid", function () {
    expect(() => AssetParam.metadataHash(Txn.sender())).toThrowError(
      TealTypeError
    );
  });

  it("test_asset_param_manager", function () {
    const arg = new Int(0);
    const expr = AssetParam.manager(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.asset_params_get, ["AssetManager"]),
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

  it("test_asset_param_manager_invalid", function () {
    expect(() => AssetParam.manager(Txn.sender())).toThrowError(TealTypeError);
  });

  it("test_asset_param_reserve", function () {
    const arg = new Int(2);
    const expr = AssetParam.reserve(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [2]),
      new TealOp(expr, Ops.asset_params_get, ["AssetReserve"]),
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

  it("test_asset_param_reserve_invalid", function () {
    expect(() => AssetParam.reserve(Txn.sender())).toThrowError(TealTypeError);
  });

  it("test_asset_param_freeze", function () {
    const arg = new Int(0);
    const expr = AssetParam.freeze(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [0]),
      new TealOp(expr, Ops.asset_params_get, ["AssetFreeze"]),
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

  it("test_asset_param_freeze_invalid", function () {
    expect(() => AssetParam.freeze(Txn.sender())).toThrowError(TealTypeError);
  });

  it("test_asset_param_clawback", function () {
    const arg = new Int(1);
    const expr = AssetParam.clawback(arg);
    expect(expr.typeOf()).toBe(TealType.none);
    expect(expr.value().typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(arg, Ops.int, [1]),
      new TealOp(expr, Ops.asset_params_get, ["AssetClawback"]),
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

  it("test_asset_param_clawback_invalid", function () {
    expect(() => AssetParam.clawback(Txn.sender())).toThrowError(TealTypeError);
  });
});
