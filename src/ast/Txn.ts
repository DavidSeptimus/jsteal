import { EnumInt } from "./Int";
import { TealType } from "./Types";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealInputError, verifyFieldVersion } from "../Errors";
import { TealOp } from "../ir/TealOp";
import { Ops } from "../ir/Ops";
import { TealBlock } from "../ir/TealBlock";
import { requireInt } from "../Util";
import { TealArray } from "./TealArray";
import { Expr } from "./Expr";

/**
 * Enum of all possible transaction types.
 */
export const TxnType = {
  Unknown: new EnumInt("unknown"),
  Payment: new EnumInt("pay"),
  KeyRegistration: new EnumInt("keyreg"),
  AssetConfig: new EnumInt("acfg"),
  AssetTransfer: new EnumInt("axfer"),
  AssetFreeze: new EnumInt("afrz"),
  ApplicationCall: new EnumInt("appl"),
};

export class TxnField {
  public constructor(
    public id: number,
    public argName: string,
    public retType: TealType,
    public minVersion: number
  ) {}

  public typeOf(): TealType {
    return this.retType;
  }
}

// prettier-ignore
export const TxnFields = {
  sender: new TxnField(0, "Sender", TealType.bytes, 2),
  fee: new TxnField(1, "Fee", TealType.uint64, 2),
  firstValid: new TxnField(2, "FirstValid", TealType.uint64, 2),
  firstValidTime: new TxnField(3, "FirstValidTime", TealType.uint64, 2),
  lastValid: new TxnField(4, "LastValid", TealType.uint64, 2),
  note: new TxnField(5, "Note", TealType.bytes, 2),
  lease: new TxnField(6, "Lease", TealType.bytes, 2),
  receiver: new TxnField(7, "Receiver", TealType.bytes, 2),
  amount: new TxnField(8, "Amount", TealType.uint64, 2),
  closeRemainderTo: new TxnField(9, "CloseRemainderTo", TealType.bytes, 2),
  votePk: new TxnField(10, "VotePK", TealType.bytes, 2),
  selectionPk: new TxnField(11, "SelectionPK", TealType.bytes, 2),
  voteFirst: new TxnField(12, "VoteFirst", TealType.uint64, 2),
  voteLast: new TxnField(13, "VoteLast", TealType.uint64, 2),
  voteKeyDilution: new TxnField(14, "VoteKeyDilution", TealType.uint64, 2),
  type: new TxnField(15, "Type", TealType.bytes, 2),
  typeEnum: new TxnField(16, "TypeEnum", TealType.uint64, 2),
  xferAsset: new TxnField(17, "XferAsset", TealType.uint64, 2),
  assetAmount: new TxnField(18, "AssetAmount", TealType.uint64, 2),
  assetSender: new TxnField(19, "AssetSender", TealType.bytes, 2),
  assetReceiver: new TxnField(20, "AssetReceiver", TealType.bytes, 2),
  assetCloseTo: new TxnField(21, "AssetCloseTo", TealType.bytes, 2),
  groupIndex: new TxnField(22, "GroupIndex", TealType.uint64, 2),
  txId: new TxnField(23, "TxID", TealType.bytes, 2),
  applicationId: new TxnField(24, "ApplicationID", TealType.uint64, 2),
  onCompletion: new TxnField(25, "OnCompletion", TealType.uint64, 2),
  applicationArgs: new TxnField(26, "ApplicationArgs", TealType.bytes, 2),
  numAppArgs: new TxnField(27, "NumAppArgs", TealType.uint64, 2),
  accounts: new TxnField(28, "Accounts", TealType.bytes, 2),
  numAccounts: new TxnField(2, "NumAccounts", TealType.uint64, 2),
  approvalProgram: new TxnField(30, "ApprovalProgram", TealType.bytes, 2),
  clearStateProgram: new TxnField(31, "ClearStateProgram", TealType.bytes, 2),
  rekeyTo: new TxnField(32, "RekeyTo", TealType.bytes, 2),
  configAsset: new TxnField(33, "ConfigAsset", TealType.uint64, 2),
  configAssetTotal: new TxnField(34, "ConfigAssetTotal", TealType.uint64, 2),
  configAssetDecimals: new TxnField(35, "ConfigAssetDecimals", TealType.uint64, 2),
  configAssetDefaultFrozen: new TxnField(36, "ConfigAssetDefaultFrozen", TealType.uint64, 2),
  configAssetUnitName: new TxnField(37, "ConfigAssetUnitName", TealType.bytes, 2),
  configAssetName: new TxnField(38, "ConfigAssetName", TealType.bytes, 2),
  configAssetUrl: new TxnField(39, "ConfigAssetURL", TealType.bytes, 2),
  configAssetMetadataHash: new TxnField(40, "ConfigAssetMetadataHash", TealType.bytes, 2),
  configAssetManager: new TxnField(41, "ConfigAssetManager", TealType.bytes, 2),
  configAssetReserve: new TxnField(42, "ConfigAssetReserve", TealType.bytes, 2),
  configAssetFreeze: new TxnField(43, "ConfigAssetFreeze", TealType.bytes, 2),
  configAssetClawback: new TxnField(44, "ConfigAssetClawback", TealType.bytes, 2),
  freezeAsset: new TxnField(45, "FreezeAsset", TealType.uint64, 2),
  freezeAssetAccount: new TxnField(46, "FreezeAssetAccount", TealType.bytes, 2),
  freezeAssetFrozen: new TxnField(47, "FreezeAssetFrozen", TealType.uint64, 2),
  assets: new TxnField(48, "Assets", TealType.uint64, 3),
  numAssets: new TxnField(49, "NumAssets", TealType.uint64, 3),
  applications: new TxnField(50, "Applications", TealType.uint64, 3),
  numApplications: new TxnField(51, "NumApplications", TealType.uint64, 3),
  globalNumUints: new TxnField(52, "GlobalNumUint", TealType.uint64, 3),
  globalNumByteSlices: new TxnField(53, "GlobalNumByteSlice", TealType.uint64, 3),
  localNumUints: new TxnField(54, "LocalNumUint", TealType.uint64, 3),
  localNumByteSlices: new TxnField(55, "LocalNumByteSlice", TealType.uint64, 3),
};

/**
 * An expression that accesses a transaction field from the current transaction.
 */
export class TxnExpr extends Expr {
  public constructor(public field: TxnField) {
    super();
  }

  public teal(options: CompileOptions): CompiledExpr {
    verifyFieldVersion(
      this.field.argName,
      this.field.minVersion,
      options.version
    );
    const op = new TealOp(this, Ops.txn, [this.field.argName]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return this.field.typeOf();
  }

  public toString(): string {
    return `(Txn ${this.field.argName})`;
  }
}

/**
 * An expression that accesses a transaction array field from the current transaction.
 */
export class TxnaExpr extends Expr {
  public constructor(public field: TxnField, public index: number) {
    super();
    requireInt(index);
  }

  public teal(options: CompileOptions): CompiledExpr {
    verifyFieldVersion(
      this.field.argName,
      this.field.minVersion,
      options.version
    );
    const op = new TealOp(this, Ops.txna, [this.field.argName, this.index]);
    return TealBlock.fromOp(options, op);
  }

  public typeOf(): TealType {
    return this.field.typeOf();
  }

  public toString(): string {
    return `(Txna ${this.field.argName} ${this.index})`;
  }
}

/**
 * Represents a transaction array field.
 */
export class TxnArray extends TealArray<TxnaExpr> {
  public constructor(
    public txnObject: TxnObject,
    public accessField: TxnField,
    public lengthField: TxnField
  ) {
    super();
  }

  public getItem(index: number): TxnaExpr {
    requireInt(index);
    if (index < 0) {
      throw new TealInputError(`Invalid array index: ${index}`);
    }

    return this.txnObject.txnaType(this.accessField, index);
  }

  public length(): Expr {
    return this.txnObject.txnType(this.lengthField);
  }
}

/**
 * Represents a transaction and its fields.
 */
export class TxnObject {
  public constructor(
    public txnType: (txnField: TxnField) => TxnExpr,
    public txnaType: (txnField: TxnField, index: number) => TxnaExpr
  ) {}

  /**Get the 32 byte address of the sender.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#sender
   **/
  public sender(): TxnExpr {
    return this.txnType(TxnFields.sender);
  }

  /**Get the transaction fee in micro Algos.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#fee
   **/
  public fee(): TxnExpr {
    return this.txnType(TxnFields.fee);
  }

  /**Get the first valid round number.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#firstvalid
   **/
  public firstValid(): TxnExpr {
    return this.txnType(TxnFields.firstValid);
  }

  /**Get the last valid round number.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#lastvalid
   **/
  public lastValid(): TxnExpr {
    return this.txnType(TxnFields.lastValid);
  }

  /**Get the transaction note.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#note
   **/
  public note(): TxnExpr {
    return this.txnType(TxnFields.note);
  }

  /**Get the transaction lease.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#lease
   **/
  public lease(): TxnExpr {
    return this.txnType(TxnFields.lease);
  }

  /**Get the 32 byte address of the receiver.

   Only set when :any:`type_enum()` is :any:`TxnType.Payment`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#receiver
   **/
  public receiver(): TxnExpr {
    return this.txnType(TxnFields.receiver);
  }

  /**Get the amount of the transaction in micro Algos.

   Only set when :any:`type_enum()` is :any:`TxnType.Payment`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#amount
   **/
  public amount(): TxnExpr {
    return this.txnType(TxnFields.amount);
  }

  /**Get the 32 byte address of the CloseRemainderTo field.

   Only set when :any:`type_enum()` is :any:`TxnType.Payment`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#closeremainderto
   **/
  public closeRemainderTo(): TxnExpr {
    return this.txnType(TxnFields.closeRemainderTo);
  }

  /**Get the root participation public key.

   Only set when :any:`type_enum()` is :any:`TxnType.KeyRegistration`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#votepk
   **/
  public votePk(): TxnExpr {
    return this.txnType(TxnFields.votePk);
  }

  /**Get the VRF public key.

   Only set when :any:`type_enum()` is :any:`TxnType.KeyRegistration`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#selectionpk
   **/
  public selectionPk(): TxnExpr {
    return this.txnType(TxnFields.selectionPk);
  }

  /**Get the first round that the participation key is valid.

   Only set when :any:`type_enum()` is :any:`TxnType.KeyRegistration`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#votefirst
   **/
  public voteFirst(): TxnExpr {
    return this.txnType(TxnFields.voteFirst);
  }

  /**Get the last round that the participation key is valid.

   Only set when :any:`type_enum()` is :any:`TxnType.KeyRegistration`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#votelast
   **/
  public voteLast(): TxnExpr {
    return this.txnType(TxnFields.voteLast);
  }

  /**Get the dilution for the 2-level participation key.

   Only set when :any:`type_enum()` is :any:`TxnType.KeyRegistration`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#votekeydilution
   **/
  public voteKeyDilution(): TxnExpr {
    return this.txnType(TxnFields.voteKeyDilution);
  }

  /**Get the type of this transaction as a byte string.

   In most cases it is preferable to use :any:`type_enum()` instead.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#type
   **/
  public type(): TxnExpr {
    return this.txnType(TxnFields.type);
  }

  /**Get the type of this transaction.

   See :any:`TxnType` for possible values.
   **/
  public typeEnum(): TxnExpr {
    return this.txnType(TxnFields.typeEnum);
  }

  /**Get the ID of the asset being transferred.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetTransfer`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#xferasset
   **/
  public xferAsset(): TxnExpr {
    return this.txnType(TxnFields.xferAsset);
  }

  /**Get the amount of the asset being transferred, measured in the asset's units.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetTransfer`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#assetamount
   **/
  public assetAmount(): TxnExpr {
    return this.txnType(TxnFields.assetAmount);
  }

  /**Get the 32 byte address of the subject of clawback.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetTransfer`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#assetsender
   **/
  public assetSender(): TxnExpr {
    return this.txnType(TxnFields.assetSender);
  }

  /**Get the recipient of the asset transfer.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetTransfer`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#assetreceiver
   **/
  public assetReceiver(): TxnExpr {
    return this.txnType(TxnFields.assetReceiver);
  }

  /**Get the closeout address of the asset transfer.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetTransfer`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#assetcloseto
   **/
  public assetCloseTo(): TxnExpr {
    return this.txnType(TxnFields.assetCloseTo);
  }

  /**Get the position of the transaction within the atomic transaction group.

   A stand-alone transaction is implictly element 0 in a group of 1.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#group
   **/
  public groupIndex(): TxnExpr {
    return this.txnType(TxnFields.groupIndex);
  }

  /**Get the 32 byte computed ID for the transaction.**/
  public txId(): TxnExpr {
    return this.txnType(TxnFields.txId);
  }

  /**Get the application ID from the ApplicationCall portion of the current transaction.

   Only set when :any:`type_enum()` is :any:`TxnType.ApplicationCall`.
   **/
  public applicationId(): TxnExpr {
    return this.txnType(TxnFields.applicationId);
  }

  /**Get the on completion action from the ApplicationCall portion of the transaction.

   Only set when :any:`type_enum()` is :any:`TxnType.ApplicationCall`.
   **/
  public onCompletion(): TxnExpr {
    return this.txnType(TxnFields.onCompletion);
  }

  /**Get the approval program.

   Only set when :any:`type_enum()` is :any:`TxnType.ApplicationCall`.
   **/
  public approvalProgram(): TxnExpr {
    return this.txnType(TxnFields.approvalProgram);
  }

  /**Get the clear state program.

   Only set when :any:`type_enum()` is :any:`TxnType.ApplicationCall`.
   **/
  public clearStateProgram(): TxnExpr {
    return this.txnType(TxnFields.clearStateProgram);
  }

  /**Get the sender's new 32 byte AuthAddr.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#rekeyto
   **/
  public rekeyTo(): TxnExpr {
    return this.txnType(TxnFields.rekeyTo);
  }

  /**Get the asset ID in asset config transaction.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#configasset
   **/
  public configAsset(): TxnExpr {
    return this.txnType(TxnFields.configAsset);
  }

  /**Get the total number of units of this asset created.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#total
   **/
  public configAssetTotal(): TxnExpr {
    return this.txnType(TxnFields.configAssetTotal);
  }

  /**Get the number of digits to display after the decimal place when displaying the asset.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#decimals
   **/
  public configAssetDecimals(): TxnExpr {
    return this.txnType(TxnFields.configAssetDecimals);
  }

  /**Check if the asset's slots are frozen by default or not.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#defaultfrozen
   **/
  public configAssetDefaultFrozen(): TxnExpr {
    return this.txnType(TxnFields.configAssetDefaultFrozen);
  }

  /**Get the unit name of the asset.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#unitname
   **/
  public configAssetUnitName(): TxnExpr {
    return this.txnType(TxnFields.configAssetUnitName);
  }

  /**Get the asset name.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#assetname
   **/
  public configAssetName(): TxnExpr {
    return this.txnType(TxnFields.configAssetName);
  }

  /**Get the asset URL.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#url
   **/
  public configAssetUrl(): TxnExpr {
    return this.txnType(TxnFields.configAssetUrl);
  }

  /**Get the 32 byte commitment to some unspecified asset metdata.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#metadatahash
   **/
  public configAssetMetadataHash(): TxnExpr {
    return this.txnType(TxnFields.configAssetMetadataHash);
  }

  /**Get the 32 byte asset manager address.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#manageraddr
   **/
  public configAssetManager(): TxnExpr {
    return this.txnType(TxnFields.configAssetManager);
  }

  /**Get the 32 byte asset reserve address.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#reserveaddr
   **/
  public configAssetReserve(): TxnExpr {
    return this.txnType(TxnFields.configAssetReserve);
  }

  /**Get the 32 byte asset freeze address.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#freezeaddr
   **/
  public configAssetFreeze(): TxnExpr {
    return this.txnType(TxnFields.configAssetFreeze);
  }

  /**Get the 32 byte asset clawback address.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetConfig`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#clawbackaddr
   **/
  public configAssetClawback(): TxnExpr {
    return this.txnType(TxnFields.configAssetClawback);
  }

  /**Get the asset ID being frozen or un-frozen.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetFreeze`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#freezeasset
   **/
  public freezeAsset(): TxnExpr {
    return this.txnType(TxnFields.freezeAsset);
  }

  /**Get the 32 byte address of the account whose asset slot is being frozen or un-frozen.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetFreeze`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#freezeaccount
   **/
  public freezeAssetAccount(): TxnExpr {
    return this.txnType(TxnFields.freezeAssetAccount);
  }

  /**Get the new frozen value for the asset.

   Only set when :any:`type_enum()` is :any:`TxnType.AssetFreeze`.

   For more information, see https://developer.algorand.org/docs/reference/transactions/#assetfrozen
   **/
  public freezeAssetFrozen(): TxnExpr {
    return this.txnType(TxnFields.freezeAssetFrozen);
  }

  /**Get the schema count of global state integers in an application creation call.

   Only set when :any:`type_enum()` is :any:`TxnType.ApplicationCall` and this is an app creation call.

   Requires TEAL version 3 or higher.
   **/
  public globalNumUints(): TxnExpr {
    return this.txnType(TxnFields.globalNumUints);
  }

  /**Get the schema count of global state byte slices in an application creation call.

   Only set when :any:`type_enum()` is :any:`TxnType.ApplicationCall` and this is an app creation call.

   Requires TEAL version 3 or higher.
   **/
  public globalNumByteSlices(): TxnExpr {
    return this.txnType(TxnFields.globalNumByteSlices);
  }

  /**Get the schema count of local state integers in an application creation call.

   Only set when :any:`type_enum()` is :any:`TxnType.ApplicationCall` and this is an app creation call.

   Requires TEAL version 3 or higher.
   **/
  public localNumUints(): TxnExpr {
    return this.txnType(TxnFields.localNumUints);
  }

  /**Get the schema count of local state byte slices in an application creation call.

   Only set when :any:`type_enum()` is :any:`TxnType.ApplicationCall` and this is an app creation call.

   Requires TEAL version 3 or higher.
   **/
  public localNumByteSlices(): TxnExpr {
    return this.txnType(TxnFields.localNumByteSlices);
  }

  /**
   * Application call arguments array.
   *
   * @return {TxnArray}
   */
  public get applicationArgs(): TxnArray {
    return new TxnArray(this, TxnFields.applicationArgs, TxnFields.numAppArgs);
  }

  /**
   * The accounts array in an ApplicationCall transaction.
   *
   * @return {TxnArray}
   */
  public get accounts(): TxnArray {
    return new TxnArray(this, TxnFields.accounts, TxnFields.numAccounts);
  }

  /**
   * The foreign asset array in an ApplicationCall transaction.
   *
   * Requires TEAL version 3 or higher.
   *
   * @return {TxnArray}
   */
  public get assets(): TxnArray {
    return new TxnArray(this, TxnFields.assets, TxnFields.numAssets);
  }

  /**
   * The applications array in an ApplicationCall transaction.
   *
   * Requires TEAL version 3 or higher.
   *
   * @return {TxnArray}
   */
  public get applications(): TxnArray {
    return new TxnArray(
      this,
      TxnFields.applications,
      TxnFields.numApplications
    );
  }
}

export const Txn = new TxnObject(
  (txnField: TxnField) => new TxnExpr(txnField),
  (txnField: TxnField, index: number) => new TxnaExpr(txnField, index)
);
