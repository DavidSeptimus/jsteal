import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { Mode } from "../ir/Ops";
import { TealComponent } from "../ir/TealComponent";
import { ScratchSlot, TealOp } from "../ir/TealOp";
import { TealInputError, TealInternalError } from "../Errors";
import { Expr } from "../ast/Expr";
import { NUM_SLOTS } from "../Config";
import { sortBlocks } from "./Sort";
import { flattenBlocks } from "./Flatten";
import { createConstantBlocks } from "./Constants";
import { requireInt } from "../Util";

export const MAX_TEAL_VERSION = 3;
export const MIN_TEAL_VERSION = 2;
export const DEFAULT_TEAL_VERSION = MIN_TEAL_VERSION;
export const DEFAULT_TEAL_MODE = Mode.Signature;

export interface CompiledExpr {
  argStart: TealBlock;
  argEnd: TealSimpleBlock;
}

export class CompileOptions {
  public constructor(
    public mode = DEFAULT_TEAL_MODE,
    public version = DEFAULT_TEAL_VERSION
  ) {}
}

/**
 * Verify that all TEAL operations are allowed in the specified version.
 *
 * @param teal Code to check.
 * @param version The version to check against.
 * @throws TealInputError: if teal contains an operation not allowed in version.
 */
function verifyOpsForVersion(teal: Array<TealComponent>, version: number) {
  for (const stmt of teal) {
    if (stmt instanceof TealOp) {
      const op = stmt.op;
      if (op.minVersion > version) {
        throw new TealInternalError(
          `Op not supported in TEAL version ${version}: ${op}. Minimum required version is ${op.minVersion}`
        );
      }
    }
  }
}

/**
 * Verify that all TEAL operations are allowed in mode.
 *
 * @param teal Code to check.
 * @param mode The mode to check against.
 * @throws TealInputError: if teal contains an operation not allowed in mode.
 */
function verifyOpsForMode(teal: Array<TealComponent>, mode: Mode) {
  for (const stmt of teal) {
    if (stmt instanceof TealOp) {
      const op = stmt.op;
      if (!(op.mode & mode)) {
        throw new TealInputError(`Op not supported in mode ${mode}: ${op}`);
      }
    }
  }
}

/**
 * Compile a PyTeal expression into TEAL assembly.
 *
 * @param ast  The PyTeal expression to assemble.
 * @param mode The mode of the program to assemble. Must be Signature or Application.
 * @param version When true, the compiler will produce a program with fully
 *  assembled constants, rather than using the pseudo-ops `int`, `byte`, and `addr`. These
 *  constants will be assembled in the most space-efficient way, so enabling this may reduce
 *  the compiled program's size. Enabling this option requires a minimum TEAL version of 3.
 *  Defaults to false.
 * @param assembleConstants The TEAL version used to assemble the program.
 * This will determine which expressions and fields are able to be used in the program
 * and how expressions compile to TEAL opcodes.
 * Defaults to 2 if not included.
 *
 * @return  A TEAL assembly program compiled from the input expression.
 *
 * @throws TealInputError if an operation in ast is not supported by the supplied mode and version.
 * @throws TealInternalError if an internal error is encounter during compilation.
 */
export function compileTeal(
  ast: Expr,
  mode: Mode,
  version?: number,
  assembleConstants?: boolean
): string {
  version = version != null ? version : DEFAULT_TEAL_VERSION;
  requireInt(version);
  if (!(MIN_TEAL_VERSION <= version && version <= MAX_TEAL_VERSION)) {
    throw new TealInputError(
      `Unsupported TEAL version: ${version}. Excepted an integer in the range [${MIN_TEAL_VERSION}, ${MAX_TEAL_VERSION}]`
    );
  }

  const options = new CompileOptions(mode, version);

  let start = ast.teal(options).argStart;
  start.addIncoming();
  start.validateTree();

  start = TealBlock.normalizeBlocks(start);
  start.validateTree();

  const errors = start.validateSlots();
  if (errors.length > 0) {
    const msg = `Encountered ${errors.length} error${
      errors.length > 1 ? "s " : ""
    } during compilation`;
    throw new TealInternalError(
      "".concat(msg, "\n", errors.map((e) => e.message).join("\n"))
    );
  }

  const order = sortBlocks(start);
  let teal = flattenBlocks(order);

  verifyOpsForVersion(teal, version);
  verifyOpsForMode(teal, mode);

  const slots: Set<ScratchSlot> = new Set();
  for (const stmt of teal) {
    for (const slot of stmt.getSlots()) {
      slots.add(slot);
    }
  }

  if (slots.size > NUM_SLOTS) {
    // ToDo: identify which slots can be reused
    throw new TealInternalError(
      `Too many slots in use: ${slots.size}, maximum is ${NUM_SLOTS}`
    );
  }

  const sortedSlots = [...slots].sort((s1, s2) => (s1.id <= s2.id ? -1 : 1));

  for (let i = 0; i < sortedSlots.length; i++) {
    for (const stmt of teal) {
      stmt.assignSlot(sortedSlots[i], i);
    }
  }

  if (assembleConstants === true) {
    if (version < 3) {
      throw new TealInternalError(
        `The minimum TEAL version required to enable assembleConstants is 3. The current version is ${version}`
      );
    }
    teal = createConstantBlocks(teal);
  }

  const lines = [`#pragma version ${version}`];
  for (const block of teal) {
    lines.push(block.assemble());
  }
  return lines.join("\n");
}
