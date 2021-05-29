import { TealInputError, TealTypeError } from "../Errors";

/**
 * Teal type enum
 */
export enum TealType {
  // Unsigned 64 bit integer type.
  uint64,

  // Byte string type.
  bytes,

  // Any type that is not none.
  anytype,

  // Represents no value.
  none,
}

export function requireType(actual: TealType, expected: TealType): void {
  if (
    actual !== expected &&
    (expected === TealType.none ||
      actual === TealType.none ||
      (actual != TealType.anytype && expected !== TealType.anytype))
  ) {
    throw new TealTypeError({ actual, expected });
  }
}

export function typesMatch(type1: TealType, type2: TealType) {
  if ((type1 === TealType.none || type2 === TealType.none) && type1 !== type2) {
    return false;
  }

  if (type1 === TealType.anytype || type2 === TealType.anytype) {
    return true;
  }

  return type1 === type2;
}

/**
 * check if address is a valid address with checksum
 * @param address
 */
export function validAddress(address: string): void {
  if (address.length !== 58) {
    throw new TealInputError(
      "Address length is not correct." +
        " Should be a base 32 string encoded 32 bytes public key + 4 bytes checksum"
    );
  }
  validBase32(address);
}

/**
 * check if s is a valid base32 encoded string
 * @param s
 */
export function validBase32(s: string): void {
  // ToDo: validate expression
  const pattern =
    /^(?:[A-Z2-7]{8})*(?:([A-Z2-7]{2}([=]{6})?)|([A-Z2-7]{4}([=]{4})?)|([A-Z2-7]{5}([=]{3})?)|([A-Z2-7]{7}([=]{1})?))?$/;
  if (!pattern.test(s)) {
    throw new TealInputError(`${s} is not a valid RFC 4648 base 32 string`);
  }
}

/**
 * check if s is a valid base64 encoded string
 * @param s
 */
export function validBase64(s: string): void {
  const pattern =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!pattern.test(s)) {
    throw new TealInputError(`${s} is not a valid RFC 4648 base 64 string`);
  }
}

/**
 * check if s is a valid hex encoded string
 * @param s
 */
export function validBase16(s: string) {
  const pattern = /^[0-9A-Fa-f]*$/;
  if (!pattern.test(s)) {
    throw new TealInputError(`${s} is not a valid RFC 4648 base 16 string`);
  }
}

/**
 * check if s is valid template name
 * @param s
 */
export function validTmpl(s: string) {
  const pattern = /^TMPL_[A-Z0-9_]+$/;

  if (!pattern.test(s)) {
    throw new TealInputError(`${s}  is not a valid template variable`);
  }
}
