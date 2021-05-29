import { TealType } from "./ast/Types";

export class TealInternalError extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export class TealTypeError extends Error {
  public constructor({
    message,
    actual,
    expected,
  }: {
    message?: string;
    actual: TealType;
    expected: TealType;
  }) {
    if (message != null) {
      super(message);
    } else {
      super(`${TealType[actual]} while expected ${TealType[expected]}`);
    }
  }
}

export class TealInputError extends Error {
  public constructor(message: string) {
    super(message);
  }
}

export class TealCompileError extends Error {
  public constructor(message: string, stack?: string) {
    super(stack ? message + ":\n" + stack : message);
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
