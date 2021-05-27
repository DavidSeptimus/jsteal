import "jasmine";
import { CompileOptions, DEFAULT_TEAL_MODE } from "../compiler/Compiler";
import { TealType } from "./Types";
import { Ops } from "../ir/Ops";
import { TealInputError } from "../Errors";
import { Txn } from "./Txn";
import { TealSimpleBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";

describe("Txn Tests", function () {
  const teal2Options = new CompileOptions(DEFAULT_TEAL_MODE, 2);
  const teal3Options = new CompileOptions(DEFAULT_TEAL_MODE, 3);

  it("test_txn_sender", function () {
    const expr = Txn.sender();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["Sender"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_fee", function () {
    const expr = Txn.fee();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([new TealOp(expr, Ops.txn, ["Fee"])]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_first_valid", function () {
    const expr = Txn.firstValid();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["FirstValid"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_last_valid", function () {
    const expr = Txn.lastValid();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["LastValid"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_note", function () {
    const expr = Txn.note();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([new TealOp(expr, Ops.txn, ["Note"])]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_lease", function () {
    const expr = Txn.lease();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["Lease"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_receiver", function () {
    const expr = Txn.receiver();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["Receiver"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_amount", function () {
    const expr = Txn.amount();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["Amount"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_close_remainder_to", function () {
    const expr = Txn.closeRemainderTo();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["CloseRemainderTo"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_vote_pk", function () {
    const expr = Txn.votePk();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["VotePK"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_selection_pk", function () {
    const expr = Txn.selectionPk();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["SelectionPK"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_vote_first", function () {
    const expr = Txn.voteFirst();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["VoteFirst"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_vote_last", function () {
    const expr = Txn.voteLast();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["VoteLast"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_vote_key_dilution", function () {
    const expr = Txn.voteKeyDilution();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["VoteKeyDilution"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_type", function () {
    const expr = Txn.type();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([new TealOp(expr, Ops.txn, ["Type"])]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_type_enum", function () {
    const expr = Txn.typeEnum();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["TypeEnum"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_xfer_asset", function () {
    const expr = Txn.xferAsset();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["XferAsset"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_asset_amount", function () {
    const expr = Txn.assetAmount();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["AssetAmount"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_asset_sender", function () {
    const expr = Txn.assetSender();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["AssetSender"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_asset_receiver", function () {
    const expr = Txn.assetReceiver();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["AssetReceiver"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_asset_close_to", function () {
    const expr = Txn.assetCloseTo();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["AssetCloseTo"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_group_index", function () {
    const expr = Txn.groupIndex();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["GroupIndex"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_id", function () {
    const expr = Txn.txId();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([new TealOp(expr, Ops.txn, ["TxID"])]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_application_id", function () {
    const expr = Txn.applicationId();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ApplicationID"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_on_completion", function () {
    const expr = Txn.onCompletion();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["OnCompletion"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_application_args", function () {
    for (const i of [...new Array(32).keys()]) {
      const expr = Txn.applicationArgs.getItem(i);
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.txna, ["ApplicationArgs", i]),
      ]);

      const { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_application_args_length", function () {
    const expr = Txn.applicationArgs.length();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["NumAppArgs"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_accounts", function () {
    for (const i of [...new Array(32).keys()]) {
      const expr = Txn.accounts.getItem(i);
      expect(expr.typeOf()).toBe(TealType.bytes);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.txna, ["Accounts", i]),
      ]);

      const { argStart: actual } = expr.teal(teal2Options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_txn_accounts_length", function () {
    const expr = Txn.accounts.length();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["NumAccounts"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_approval_program", function () {
    const expr = Txn.approvalProgram();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ApprovalProgram"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_clear_state_program", function () {
    const expr = Txn.clearStateProgram();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ClearStateProgram"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_rekey_to", function () {
    const expr = Txn.rekeyTo();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["RekeyTo"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset", function () {
    const expr = Txn.configAsset();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAsset"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_total", function () {
    const expr = Txn.configAssetTotal();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetTotal"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_decimals", function () {
    const expr = Txn.configAssetDecimals();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetDecimals"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_default_frozen", function () {
    const expr = Txn.configAssetDefaultFrozen();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetDefaultFrozen"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_unit_name", function () {
    const expr = Txn.configAssetUnitName();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetUnitName"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_name", function () {
    const expr = Txn.configAssetName();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetName"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_url", function () {
    const expr = Txn.configAssetUrl();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetURL"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_metadata_hash", function () {
    const expr = Txn.configAssetMetadataHash();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetMetadataHash"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_manager", function () {
    const expr = Txn.configAssetManager();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetManager"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_reserve", function () {
    const expr = Txn.configAssetReserve();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetReserve"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_freeze", function () {
    const expr = Txn.configAssetFreeze();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetFreeze"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_config_asset_clawback", function () {
    const expr = Txn.configAssetClawback();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["ConfigAssetClawback"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_freeze_asset", function () {
    const expr = Txn.freezeAsset();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["FreezeAsset"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_freeze_asset_account", function () {
    const expr = Txn.freezeAssetAccount();
    expect(expr.typeOf()).toBe(TealType.bytes);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["FreezeAssetAccount"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_freeze_asset_frozen", function () {
    const expr = Txn.freezeAssetFrozen();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["FreezeAssetFrozen"]),
    ]);

    const { argStart: actual } = expr.teal(teal2Options);

    expect(actual).toEqual(expected);
  });

  it("test_txn_assets", function () {
    for (const i of [...new Array(32).keys()]) {
      const expr = Txn.assets.getItem(i);
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.txna, ["Assets", i]),
      ]);

      const { argStart: actual } = expr.teal(teal3Options);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_assets_length", function () {
    const expr = Txn.assets.length();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["NumAssets"]),
    ]);

    const { argStart: actual } = expr.teal(teal3Options);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_applications", function () {
    for (const i of [...new Array(32).keys()]) {
      const expr = Txn.applications.getItem(i);
      expect(expr.typeOf()).toBe(TealType.uint64);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.txna, ["Applications", i]),
      ]);

      const { argStart: actual } = expr.teal(teal3Options);

      expect(actual).toEqual(expected);

      expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
    }
  });

  it("test_txn_applications_length", function () {
    const expr = Txn.applications.length();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["NumApplications"]),
    ]);

    const { argStart: actual } = expr.teal(teal3Options);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_global_num_uints", function () {
    const expr = Txn.globalNumUints();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["GlobalNumUint"]),
    ]);

    const { argStart: actual } = expr.teal(teal3Options);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_global_num_byte_slices", function () {
    const expr = Txn.globalNumByteSlices();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["GlobalNumByteSlice"]),
    ]);

    const { argStart: actual } = expr.teal(teal3Options);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_local_num_uints", function () {
    const expr = Txn.localNumUints();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["LocalNumUint"]),
    ]);

    const { argStart: actual } = expr.teal(teal3Options);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });

  it("test_txn_local_num_byte_slices", function () {
    const expr = Txn.localNumByteSlices();
    expect(expr.typeOf()).toBe(TealType.uint64);

    const expected = new TealSimpleBlock([
      new TealOp(expr, Ops.txn, ["LocalNumByteSlice"]),
    ]);

    const { argStart: actual } = expr.teal(teal3Options);

    expect(actual).toEqual(expected);

    expect(() => expr.teal(teal2Options)).toThrowError(TealInputError);
  });
});
