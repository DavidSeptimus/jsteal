import { TealType } from "./Types";
import { LeafExpr } from "./LeafExpr";
import { CompiledExpr, CompileOptions } from "../compiler/Compiler";
import { verifyFieldVersion } from "../Errors";
import { TealOp } from "../ir/TealOp";
import { Ops } from "../ir/Ops";
import { TealBlock } from "../ir/TealBlock";

export class GlobalField {
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

export const GlobalFields = {
  minTxnFee: new GlobalField(0, "MinTxnFee", TealType.uint64, 2),
  minBalance: new GlobalField(1, "MinBalance", TealType.uint64, 2),
  maxTxnLife: new GlobalField(2, "MaxTxnLife", TealType.uint64, 2),
  zeroAddress: new GlobalField(3, "ZeroAddress", TealType.bytes, 2),
  groupSize: new GlobalField(4, "GroupSize", TealType.uint64, 2),
  logicSigVersion: new GlobalField(5, "LogicSigVersion", TealType.uint64, 2),
  round: new GlobalField(6, "Round", TealType.uint64, 2),
  latestTimestamp: new GlobalField(7, "LatestTimestamp", TealType.uint64, 2),
  currentAppId: new GlobalField(8, "CurrentApplicationID", TealType.uint64, 2),
  creatorAddress: new GlobalField(9, "CreatorAddress", TealType.bytes, 3),
};

/**
 * An expression that accesses a global property.
 */
export class Global extends LeafExpr {
  public constructor(public field: GlobalField) {
    super();
  }

  public teal(options: CompileOptions): CompiledExpr {
    verifyFieldVersion(
      this.field.argName,
      this.field.minVersion,
      options.version
    );

    const op = new TealOp(this, Ops.global_, [this.field.argName]);
    return TealBlock.fromOp(options, op);
  }

  public toString(): string {
    return `(Global ${this.field.argName})`;
  }

  public typeOf(): TealType {
    return this.field.typeOf();
  }

  /**
   * Get the minimum transaction fee in micro Algos.
   */
  public static minTxnFee(): Global {
    return new Global(GlobalFields.minTxnFee);
  }

  /**
   * Get the minimum balance in micro Algos.
   */
  public static minBalance(): Global {
    return new Global(GlobalFields.minBalance);
  }

  /**
   * Get the maximum number of rounds a transaction can have.
   */
  public static maxTxnLife(): Global {
    return new Global(GlobalFields.maxTxnLife);
  }

  /**
   * Get the 32 byte zero address.
   */
  public static zeroAddress(): Global {
    return new Global(GlobalFields.zeroAddress);
  }

  /**
   * Get the number of transactions in this atomic transaction group.
   *
   * This will be at least 1.
   */
  public static groupSize(): Global {
    return new Global(GlobalFields.groupSize);
  }

  /**
   * Get the maximum supported TEAL version.
   */
  public static logicSigVersion(): Global {
    return new Global(GlobalFields.logicSigVersion);
  }

  /**
   * Get the current round number.
   */
  public static round(): Global {
    return new Global(GlobalFields.round);
  }

  /**
   * Get the latest confirmed block UNIX timestamp.
   *
   * Fails if negative.
   */
  public static latestTimestamp(): Global {
    return new Global(GlobalFields.latestTimestamp);
  }

  /**
   * Get the ID of the current application executing.
   *
   * Fails if no application is executing.
   */
  public static currentApplicationId(): Global {
    return new Global(GlobalFields.currentAppId);
  }

  /**
   * Address of the creator of the current application.
   *
   * Fails if no such application is executing. Requires TEAL version 3 or higher.
   */
  public static creatorAddress(): Global {
    return new Global(GlobalFields.creatorAddress);
  }
}
