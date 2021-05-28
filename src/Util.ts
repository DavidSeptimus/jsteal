import { TealInputError, TealInternalError } from "./Errors";
import { Buffer } from "buffer/";

export function isInt(value: any) {
  return (
    (typeof value === "number" && value - Math.floor(value) === 0) ||
    (typeof value === "bigint" && value > -1)
  );
}

export function asBigInt(int: number | bigint): bigint {
  return typeof int === "bigint" ? int : BigInt(int);
}

export function requireInt(value: number | bigint): void {
  if (isInt(value)) {
    return;
  }
  throw new TealInputError(
    `value must be an integer. ${value} is not an integer.`
  );
}

type AssertionCallback = () => boolean;

export function assert(callback: AssertionCallback, message?: string): void {
  if (!callback()) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export function escapeString(s: string): string {
  s = escapeLatin1String(Buffer.from(s, "utf-8").toString("latin1"));
  /// Escape double quote characters (not covered by unicode-escape) but leave in single quotes
  s = s.replaceAll('"', '\\"');
  // Surround string in double quotes
  return '"' + s + '"';
}

export function unescapeString(s: string): string {
  if (s.length < 2 || s[0] !== '"' || s.slice(-1) !== '"') {
    throw new Error("Escaped string is of the wrong format");
  }
  s = s.slice(1, s.length - 1).replace('\\"', '"');
  s = Buffer.from(
    s.replace(/\\x([0-9a-fA-F]{2})/g, (m, cc) =>
      String.fromCharCode(Number("0x" + cc))
    ),
    "latin1"
  ).toString("utf-8");
  return s;
}

export function correctBase32Padding(s: string): string {
  let content = s.split("=")[0];
  const trailing = content.length % 8;

  if (trailing == 2) {
    content += "=".repeat(6);
  } else if (trailing == 4) {
    content += "=".repeat(4);
  } else if (trailing == 5) {
    content += "=".repeat(3);
  } else if (trailing == 7) {
    content += "=";
  } else if (trailing != 0) {
    throw new TealInternalError("Invalid base32 content");
  }

  return content;
}

function escapeLatin1String(str: string): string {
  let escaped = "";

  for (const char of str) {
    const cp = char.codePointAt(0) as number;
    // escape special chars

    if (cp > 255) {
      throw new TealInternalError(
        `string '${str}' has not been properly preprocessed: Contains codepoint ${cp} > 255`
      );
    }
    if (char == "\\") {
      escaped += "\\\\";
    } else if (char == "\t") {
      escaped += "\\t";
    } else if (char == "\n") {
      escaped += "\\n";
    } else if (char == "\r") {
      escaped += "\\r";
    } else if (char < " " || cp >= 127) {
      // Map non-printable US ASCII to escaped hex codepoints '\xNN'
      escaped += "\\x" + cp.toString(16);
    } else {
      // Copy printable US ASCII  as-is
      escaped += char;
    }
  }

  return escaped;
}
