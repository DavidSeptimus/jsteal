import { EnumInt } from "./Int";
import { requireType, TealType } from "./Types";
import { Op, Ops } from "../ir/Ops";
import { LeafExpr } from "./LeafExpr";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { TealBlock } from "../ir/TealBlock";
import { TealOp } from "../ir/TealOp";
import { Expr } from "./Expr";
import { MaybeValue } from "./MaybeValue";
import { Global } from "./Global";

/**
 * An enum of values that :any:`TxnObject.on_completion()` may return.
 */
export const OnComplete = {
  NoOp: new EnumInt("NoOp"),
  OptIn: new EnumInt("OptIn"),
  CloseOut: new EnumInt("CloseOut"),
  ClearState: new EnumInt("ClearState"),
  UpdateApplication: new EnumInt("UpdateApplication"),
  DeleteApplication: new EnumInt("DeleteApplication"),
};

export class AppField {
  public constructor(public op: Op, public typeOf: TealType) {}
}

/**
 * Enum of app fields used to create :any:`App` objects.
 */
export const AppFields = {
  optedIn: new AppField(Ops.app_opted_in, TealType.uint64),
  localGet: new AppField(Ops.app_local_get, TealType.anytype),
  localGetEx: new AppField(Ops.app_local_get_ex, TealType.none),
  globalGet: new AppField(Ops.app_global_get, TealType.anytype),
  globalGetEx: new AppField(Ops.app_global_get_ex, TealType.none),
  localPut: new AppField(Ops.app_local_put, TealType.none),
  globalPut: new AppField(Ops.app_global_put, TealType.none),
  localDel: new AppField(Ops.app_local_del, TealType.none),
  globalDel: new AppField(Ops.app_global_del, TealType.none),
};

/**
 * An expression related to applications.
 */
export class App extends LeafExpr {
  public constructor(public field: AppField, public args: Array<Expr>) {
    super();
  }

  public teal(options: CompileOptions): CompiledExpr {
    return TealBlock.fromOp(options, new TealOp(this, this.field.op), [
      ...this.args,
    ]);
  }

  public typeOf(): TealType {
    return this.field.typeOf;
  }

  public toString(): string {
    let retStr = `(${this.field.op}`;
    this.args.forEach((a) => (retStr += " " + a.toString()));
    retStr += ")";
    return retStr;
  }

  /**
   * Get the ID of the current running application.
   *
   * This is the same as :any:`Global.currentApplicationId()`.
   */
  public static id(): Global {
    return Global.currentApplicationId();
  }

  /**
   * Check if an account has opted in for an application.
   *
   * @param account An index into Txn.Accounts that corresponds to the account to check.
   * Must evaluate to uint64.
   * @param app The ID of the application being checked. Must evaluate to uint64.
   */
  public static optedIn(account: Expr, app: Expr): App {
    requireType(account.typeOf(), TealType.uint64);
    requireType(app.typeOf(), TealType.uint64);
    return new App(AppFields.optedIn, [account, app]);
  }

  /**
   * Read from an account's local state for the current application.
   *
   * @param account An index into Txn.Accounts that corresponds to the account to read from.
   * Must evaluate to uint64.
   * @param key The key to read from the account's local state. Must evaluate to bytes.
   */
  public static localGet(account: Expr, key: Expr): App {
    requireType(account.typeOf(), TealType.uint64);
    requireType(key.typeOf(), TealType.bytes);
    return new App(AppFields.localGet, [account, key]);
  }

  /**
   * Read from an account's local state for an application.
   *
   * @param account An index into Txn.Accounts that corresponds to the account to read from.
   * Must evaluate to uint64.
   * @param app The ID of the application being checked. Must evaluate to uint64.
   * @param key The key to read from the account's local state. Must evaluate to bytes.
   */
  public static localGetEx(account: Expr, app: Expr, key: Expr): MaybeValue {
    requireType(account.typeOf(), TealType.uint64);
    requireType(app.typeOf(), TealType.uint64);
    requireType(key.typeOf(), TealType.bytes);
    return new MaybeValue(
      AppFields.localGetEx.op,
      TealType.anytype,
      undefined,
      [account, app, key]
    );
  }

  /**
   * Read from the global state of the current application.
   *
   * @param key The key to read from the global application state. Must evaluate to bytes.
   */
  public static globalGet(key: Expr): App {
    requireType(key.typeOf(), TealType.bytes);
    return new App(AppFields.globalGet, [key]);
  }

  /**
   *  Read from the global state of an application.
   *
   * @param app  An index into Txn.ForeignApps that corresponds to the application to read from.
   * Must evaluate to uint64.
   * @param key The key to read from the global application state. Must evaluate to bytes.
   */
  public static globalGetEx(app: Expr, key: Expr): MaybeValue {
    requireType(app.typeOf(), TealType.uint64);
    requireType(key.typeOf(), TealType.bytes);
    return new MaybeValue(
      AppFields.globalGetEx.op,
      TealType.anytype,
      undefined,
      [app, key]
    );
  }

  /**
   * Write to an account's local state for the current application.
   *
   * @param account  An index into Txn.Accounts that corresponds to the account to write to.
   * Must evaluate to uint64.
   * @param key The key to write in the account's local state. Must evaluate to bytes.
   * @param value The value to write in the account's local state. Can evaluate to any type.
   */
  public static localPut(account: Expr, key: Expr, value: Expr): App {
    requireType(account.typeOf(), TealType.uint64);
    requireType(key.typeOf(), TealType.bytes);
    requireType(value.typeOf(), TealType.anytype);
    return new App(AppFields.localPut, [account, key, value]);
  }

  /**
   * Write to the global state of the current application.
   *
   * @param key The key to write in the global application state. Must evaluate to bytes.
   * @param value The value to write in the global application state. Can evaluate to any type.
   */
  public static globalPut(key: Expr, value: Expr): App {
    requireType(key.typeOf(), TealType.bytes);
    requireType(value.typeOf(), TealType.anytype);
    return new App(AppFields.globalPut, [key, value]);
  }

  /**
   * Delete a key from an account's local state for the current application.
   *
   * @param account An index into Txn.Accounts that corresponds to the account from which the key should be deleted.
   * Must evaluate to uint64.
   * @param key The key to delete from the account's local state. Must evaluate to bytes.
   */
  public static localDel(account: Expr, key: Expr): App {
    requireType(account.typeOf(), TealType.uint64);
    requireType(key.typeOf(), TealType.bytes);
    return new App(AppFields.localDel, [account, key]);
  }

  /**
   * Delete a key from the global state of the current application.
   *
   * @param key The key to delete from the global application state. Must evaluate to bytes.
   */
  public static globalDel(key: Expr): App {
    requireType(key.typeOf(), TealType.bytes);
    return new App(AppFields.globalDel, [key]);
  }
}
