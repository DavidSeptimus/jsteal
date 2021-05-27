import "jasmine";
import { Global } from "./Global";
import { CompileOptions, DEFAULT_TEAL_MODE } from "../compiler/Compiler";
import { Ops } from "../ir/Ops";
import { TealInputError } from "../Errors";
import { TealType } from "./Types";
import { TealOp } from "../ir/TealOp";
import { TealSimpleBlock } from "../ir/TealBlock";

describe("Global Tests", function () {
  const teal2Options = new CompileOptions(DEFAULT_TEAL_MODE, 2);
  const teal3Options = new CompileOptions(DEFAULT_TEAL_MODE, 3);

  it("test_global_min_txn_fee", function () {
    const expr = Global.minTxnFee();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["MinTxnFee"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_global_minBalance", function () {
    const expr = Global.minBalance();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["MinBalance"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_global_maxTxnLife", function () {
    const expr = Global.maxTxnLife();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["MaxTxnLife"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_global_zeroAddress", function () {
    const expr = Global.zeroAddress();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["ZeroAddress"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_global_groupSize", function () {
    const expr = Global.groupSize();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["GroupSize"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_global_logicSigVersion", function () {
    const expr = Global.logicSigVersion();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["LogicSigVersion"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_global_round", function () {
    const expr = Global.round();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["Round"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_global_latestTimestamp", function () {
    const expr = Global.latestTimestamp();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["LatestTimestamp"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_global_currentApplicationId", function () {
    const expr = Global.currentApplicationId();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["CurrentApplicationID"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_global_creatorAddress", function () {
    const expr = Global.creatorAddress();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.global_, ["CreatorAddress"]),
    ]);

    const { argStart: actual } = expr.teal(teal3Options);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });
});
