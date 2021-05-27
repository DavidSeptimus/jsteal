import { Expr } from "./Expr";
import { MaybeValue } from "./MaybeValue";
import { requireType, TealType } from "./Types";
import { Ops } from "../ir/Ops";

export class AssetHolding {
  /**
   * Get the amount of an asset held by an account.
   *
   * @param account An index into Txn.Accounts that corresponds to the account to check. Must evaluate to uint64.
   * @param asset The ID of the asset to get. Must evaluate to uint64.
   */
  public static balance(account: Expr, asset: Expr): MaybeValue {
    requireType(account.typeOf(), TealType.uint64);
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_holding_get,
      TealType.uint64,
      ["AssetBalance"],
      [account, asset]
    );
  }

  /**
   * Check if an asset is frozen for an account.
   *
   *  A value of 1 indicates frozen and 0 indicates not frozen.
   *
   * @param account An index into Txn.Accounts that corresponds to the account to check. Must evaluate to uint64.
   * @param asset The ID of the asset to check. Must evaluate to uint64.
   */
  public static frozen(account: Expr, asset: Expr): MaybeValue {
    requireType(account.typeOf(), TealType.uint64);
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_holding_get,
      TealType.uint64,
      ["AssetFrozen"],
      [account, asset]
    );
  }
}

export class AssetParam {
  /**
   * Get the total number of units of an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static total(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.uint64,
      ["AssetTotal"],
      [asset]
    );
  }

  /**
   * Get the number of decimals for an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static decimals(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.uint64,
      ["AssetDecimals"],
      [asset]
    );
  }

  /**
   * Check if an asset is frozen by default.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static defaultFrozen(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.uint64,
      ["AssetDefaultFrozen"],
      [asset]
    );
  }

  /**
   * Get the unit name of an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static unitName(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.bytes,
      ["AssetUnitName"],
      [asset]
    );
  }

  /**
   * Get the name of an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static assetName(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.bytes,
      ["AssetName"],
      [asset]
    );
  }

  /**
   * Get the URL of an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static url(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.bytes,
      ["AssetURL"],
      [asset]
    );
  }

  /**
   * Get the arbitrary commitment for an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static metadataHash(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.bytes,
      ["AssetMetadataHash"],
      [asset]
    );
  }

  /**
   * Get the manager address for an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static manager(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.bytes,
      ["AssetManager"],
      [asset]
    );
  }

  /**
   * Get the reserve address for an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static reserve(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.bytes,
      ["AssetReserve"],
      [asset]
    );
  }

  /**
   * Get the freeze address for an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static freeze(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.bytes,
      ["AssetFreeze"],
      [asset]
    );
  }

  /**
   * Get the clawback address for an asset.
   *
   * @param asset An index into Txn.ForeignAssets that corresponds to the asset to check. Must evaluate to uint64.
   */
  public static clawback(asset: Expr): MaybeValue {
    requireType(asset.typeOf(), TealType.uint64);
    return new MaybeValue(
      Ops.asset_params_get,
      TealType.bytes,
      ["AssetClawback"],
      [asset]
    );
  }
}
