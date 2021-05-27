import { Expr, TealType } from "./internal";

export class TealInternalError extends Error {
  public constructor(message: string) {
    super(message);
  }
}

interface TealTypeErrorParams {
  message?: string;
  actual: TealType;
  expected: TealType;
}
export class TealTypeError extends Error {
  public constructor(params: TealTypeErrorParams) {
    if (params.message != null) {
      super(params.message);
    } else {
      super(
        `${TealType[params.actual]} while expected ${TealType[params.expected]}`
      );
    }
  }
}

export class TealInputError extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export class TealCompileError extends Error {
  private sourceExpr: Expr | undefined;

  public constructor(message: string, sourceExpr?: Expr) {
    super(message);
    this.sourceExpr = sourceExpr;
  }

  public toString(): string {
    if (this.sourceExpr == null) {
      return super.toString();
    } else {
      return this.message; // ToDo: implement source trace
    }
  }
}

export function verifyTealVersion(
  minVersion: number,
  version: number,
  msg: string
): void {
  if (minVersion > version) {
    msg = `${msg}. Minimum version needed is ${minVersion}, but current version being compiled is ${version}`;
    throw new TealInputError(msg);
  }
}

export function verifyFieldVersion(
  fieldName: string,
  fieldMinVersion: number,
  version: number
): void {
  verifyTealVersion(
    fieldMinVersion,
    version,
    `TEAL version too low to use field ${fieldName}`
  );
}
