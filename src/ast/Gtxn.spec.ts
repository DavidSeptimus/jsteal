import "jasmine";
import { MAX_GROUP_SIZE } from "../Config";
import { CompileOptions, DEFAULT_TEAL_MODE } from "../compiler/Compiler";
import { Gtxn } from "./Gtxn";
import { Ops } from "../ir/Ops";
import { TealType } from "./Types";
import { Pop } from "./UnaryExpr";
import { TealInputError, TealTypeError } from "../Errors";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { Bytes } from "./Bytes";
import { Int } from "./Int";
import { TealOp } from "../ir/TealOp";

describe("Gtxn Tests", function () {
  const GTXN_RANGE = [...new Array(MAX_GROUP_SIZE).keys()];

  const teal2Options = new CompileOptions(DEFAULT_TEAL_MODE, 2);
  const teal3Options = new CompileOptions(DEFAULT_TEAL_MODE, 3);

  it("test_gtxn_invalid", function () {
    expect(() => Gtxn.getItem(-1).fee()).toThrowError(TealInputError);
    expect(() => Gtxn.getItem(MAX_GROUP_SIZE + 1).sender()).toThrowError(
      TealInputError
    );
    expect(() => Gtxn.getItem(Pop(new Int(0))).sender()).toThrowError(
      TealTypeError
    );
    expect(() => Gtxn.getItem(new Bytes(["index"])).sender()).toThrowError(
      TealTypeError
    );
  });

  it("test_gtxn_dynamic_teal_2", function () {
    expect(() =>
      Gtxn.getItem(new Int(0)).sender().teal(teal2Options)
    ).toThrowError(TealInputError);
  });

  it("test_gtxn_sender", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).sender();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "Sender"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_sender_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).sender();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["Sender"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_fee", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).fee();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "Fee"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_fee_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).fee();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["Fee"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_first_valid", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).firstValid();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "FirstValid"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_first_valid_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).firstValid();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["FirstValid"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_last_valid", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).lastValid();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "LastValid"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_last_valid_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).lastValid();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["LastValid"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_note", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).note();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "Note"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_note_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).note();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["Note"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_lease", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).lease();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "Lease"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_lease_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).lease();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["Lease"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_receiver", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).receiver();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "Receiver"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_receiver_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).receiver();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["Receiver"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_amount", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).amount();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "Amount"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_amount_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).amount();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["Amount"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_close_remainder_to", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).closeRemainderTo();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "CloseRemainderTo"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_close_remainder_to_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).closeRemainderTo();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["CloseRemainderTo"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_vote_pk", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).votePk();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "VotePK"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_vote_pk_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).votePk();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["VotePK"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_selection_pk", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).selectionPk();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "SelectionPK"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_selection_pk_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).selectionPk();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["SelectionPK"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_vote_first", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).voteFirst();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "VoteFirst"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_vote_first_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).voteFirst();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["VoteFirst"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_vote_last", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).voteLast();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "VoteLast"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_vote_last_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).voteLast();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["VoteLast"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_vote_key_dilution", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).voteKeyDilution();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "VoteKeyDilution"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_vote_key_dilution_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).voteKeyDilution();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["VoteKeyDilution"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_type", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).type();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "Type"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_type_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).type();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["Type"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_type_enum", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).typeEnum();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "TypeEnum"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_type_enum_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).typeEnum();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["TypeEnum"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_xfer_asset", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).xferAsset();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "XferAsset"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_xfer_asset_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).xferAsset();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["XferAsset"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_asset_amount", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).assetAmount();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "AssetAmount"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_asset_amount_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).assetAmount();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["AssetAmount"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_asset_sender", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).assetSender();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "AssetSender"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_asset_sender_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).assetSender();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["AssetSender"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_asset_receiver", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).assetReceiver();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "AssetReceiver"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_asset_receiver_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).assetReceiver();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["AssetReceiver"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_asset_close_to", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).assetCloseTo();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "AssetCloseTo"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_asset_close_to_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).assetCloseTo();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["AssetCloseTo"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_group_index", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).groupIndex();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "GroupIndex"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_group_index_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).groupIndex();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["GroupIndex"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_gtxn_id", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).txId();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "TxID"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_gtxn_id_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).txId();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["TxID"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_application_id", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).applicationId();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ApplicationID"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_application_id_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).applicationId();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ApplicationID"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_on_completion", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).onCompletion();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "OnCompletion"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_on_completion_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).onCompletion();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["OnCompletion"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_application_args", function () {
    for (const i of GTXN_RANGE) {
      for (const j of [...new Array(32).keys()]) {
        const expr = Gtxn.getItem(i).applicationArgs.getItem(j);
        expect(expr.typeOf()).toBe(TealType.bytes);

        const expected = new TealSimpleBlock([
          new TealOp(expr, Ops.gtxna, [i, "ApplicationArgs", j]),
        ]);

        let { argStart: actual } = expr.teal(teal2Options);

        expect(actual).toEqual(expected);
      }
    }
  });

  it("test_txn_application_args_dynamic", function () {
    const index = new Int(0);
    for (const j of [...new Array(32).keys()]) {
      const expr = Gtxn.getItem(index).applicationArgs.getItem(j);
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(index, Ops.int, [0]),
        new TealOp(expr, Ops.gtxnsa, ["ApplicationArgs", j]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);
      actual.addIncoming();
      actual = TealBlock.normalizeBlocks(actual);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_application_args_length", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).applicationArgs.length();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "NumAppArgs"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_application_args_length_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).applicationArgs.length();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["NumAppArgs"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_accounts", function () {
    for (const i of GTXN_RANGE) {
      for (const j of [...new Array(32).keys()]) {
        const expr = Gtxn.getItem(i).accounts.getItem(j);
        expect(expr.typeOf()).toBe(TealType.bytes);

        const expected = new TealSimpleBlock([
          new TealOp(expr, Ops.gtxna, [i, "Accounts", j]),
        ]);

        let { argStart: actual } = expr.teal(teal2Options);

        expect(actual).toEqual(expected);
      }
    }
  });

  it("test_txn_accounts_dynamic", function () {
    const index = new Int(0);
    for (const j of [...new Array(32).keys()]) {
      const expr = Gtxn.getItem(index).accounts.getItem(j);
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(index, Ops.int, [0]),
        new TealOp(expr, Ops.gtxnsa, ["Accounts", j]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);
      actual.addIncoming();
      actual = TealBlock.normalizeBlocks(actual);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_accounts_length", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).accounts.length();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "NumAccounts"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_accounts_length_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).accounts.length();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["NumAccounts"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_approval_program", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).approvalProgram();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ApprovalProgram"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_approval_program_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).approvalProgram();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ApprovalProgram"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_clear_state_program", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).clearStateProgram();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ClearStateProgram"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_clear_state_program_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).clearStateProgram();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ClearStateProgram"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_rekey_to", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).rekeyTo();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "RekeyTo"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_rekey_to_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).rekeyTo();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["RekeyTo"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAsset();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAsset"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAsset();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAsset"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_total", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetTotal();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetTotal"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_total_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetTotal();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetTotal"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_decimals", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetDecimals();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetDecimals"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_decimals_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetDecimals();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetDecimals"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_default_frozen", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetDefaultFrozen();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetDefaultFrozen"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_default_frozen_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetDefaultFrozen();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetDefaultFrozen"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_unit_name", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetUnitName();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetUnitName"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_unit_name_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetUnitName();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetUnitName"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_name", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetName();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetName"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_name_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetName();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetName"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_url", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetUrl();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetURL"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_url_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetUrl();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetURL"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_metadata_hash", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetMetadataHash();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetMetadataHash"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_metadata_hash_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetMetadataHash();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetMetadataHash"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_manager", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetManager();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetManager"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_manager_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetManager();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetManager"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_reserve", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetReserve();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetReserve"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_reserve_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetReserve();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetReserve"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_freeze", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetFreeze();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetFreeze"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_freeze_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetFreeze();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetFreeze"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_clawback", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).configAssetClawback();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "ConfigAssetClawback"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_config_asset_clawback_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).configAssetClawback();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["ConfigAssetClawback"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_freeze_asset", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).freezeAsset();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "FreezeAsset"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_freeze_asset_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).freezeAsset();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["FreezeAsset"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_freeze_asset_ccount", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).freezeAssetAccount();
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "FreezeAssetAccount"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_freeze_asset_account_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).freezeAssetAccount();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["FreezeAssetAccount"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_freeze_asset_frozen", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).freezeAssetFrozen();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "FreezeAssetFrozen"]),
      ]);

      let { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_freezeAssetFrozen_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).freezeAssetFrozen();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["FreezeAssetFrozen"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_txn_assets", function () {
    for (const i of GTXN_RANGE) {
      for (const j of [...new Array(32).keys()]) {
        const expr = Gtxn.getItem(i).assets.getItem(j);
        expect(expr.typeOf()).toBe(TealType.uint64);

        const expected = new TealSimpleBlock([
          new TealOp(expr, Ops.gtxna, [i, "Assets", j]),
        ]);

        let { argStart: actual } = expr.teal(teal3Options);

        expect(actual).toEqual(expected);

        expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
      }
    }
  });

  it("test_txn_assets_dynamic", function () {
    const index = new Int(0);
    for (const j of [...new Array(32).keys()]) {
      const expr = Gtxn.getItem(index).assets.getItem(j);
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(index, Ops.int, [0]),
        new TealOp(expr, Ops.gtxnsa, ["Assets", j]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);
      actual.addIncoming();
      actual = TealBlock.normalizeBlocks(actual);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_assets_length", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).assets.length();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "NumAssets"]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_assets_length_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).assets.length();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["NumAssets"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_applications", function () {
    for (const i of GTXN_RANGE) {
      for (const j of [...new Array(32).keys()]) {
        const expr = Gtxn.getItem(i).applications.getItem(j);
        expect(expr.typeOf()).toBe(TealType.uint64);

        const expected = new TealSimpleBlock([
          new TealOp(expr, Ops.gtxna, [i, "Applications", j]),
        ]);

        let { argStart: actual } = expr.teal(teal3Options);

        expect(actual).toEqual(expected);

        expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
      }
    }
  });

  it("test_txn_applications_dynamic", function () {
    const index = new Int(0);
    for (const j of [...new Array(32).keys()]) {
      const expr = Gtxn.getItem(index).applications.getItem(j);
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(index, Ops.int, [0]),
        new TealOp(expr, Ops.gtxnsa, ["Applications", j]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);
      actual.addIncoming();
      actual = TealBlock.normalizeBlocks(actual);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_applications_length", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).applications.length();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "NumApplications"]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_applications_length_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).applications.length();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["NumApplications"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_global_num_uints", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).globalNumUints();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "GlobalNumUint"]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_global_num_uints_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).globalNumUints();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["GlobalNumUint"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_global_num_byte_slices", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).globalNumByteSlices();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "GlobalNumByteSlice"]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_global_num_byte_slices_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).globalNumByteSlices();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["GlobalNumByteSlice"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_local_num_uints", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).localNumUints();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "LocalNumUint"]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_local_num_uints_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).localNumUints();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["LocalNumUint"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_local_num_byte_slices", function () {
    for (const i of GTXN_RANGE) {
      const expr = Gtxn.getItem(i).localNumByteSlices();
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.gtxn, [i, "LocalNumByteSlice"]),
      ]);

      let { argStart: actual } = expr.teal(teal3Options);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_local_num_byte_slices_dynamic", function () {
    const index = new Int(0);
    const expr = Gtxn.getItem(index).localNumByteSlices();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(index, Ops.int, [0]),
      new TealOp(expr, Ops.gtxns, ["LocalNumByteSlice"]),
    ]);

    let { argStart: actual } = expr.teal(teal3Options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });
});
