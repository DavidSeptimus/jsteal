import "jasmine";
import { CompileOptions } from "../compiler/Compiler";
import { App } from "./App";
import {
  ScratchLoad,
  ScratchSlot,
  ScratchStackStore,
  ScratchStore,
  TealOp,
} from "../ir/TealOp";
import { TealSimpleBlock } from "../ir/TealBlock";
import { TealType } from "./Types";
import { Bytes } from "./Bytes";
import { Ops } from "../ir/Ops";
import { TealComponent } from "../ir/TealComponent";
import { Int } from "./Int";
import { If } from "./If";

describe("Scratch Tests", function () {
  const options = new CompileOptions();

  it("test_scratch_slot", function () {
    const slot = new ScratchSlot();
    expect(slot).toEqual(slot);
    // expect(slot.__hash__()).toEqual(slot.__hash__())
    expect(slot).not.toEqual(new ScratchSlot());

    TealComponent.withIgnoreExprEquality(() => {
      expect(slot.store().teal(options).argStart).toEqual(
        new ScratchStackStore(slot).teal(options).argStart
      );
      expect(slot.store(new Int(1)).teal(options).argStart).toEqual(
        new ScratchStore(slot, new Int(1)).teal(options).argStart
      );

      expect(slot.load().typeOf()).toBe(TealType.anytype);
      expect(slot.load(TealType.uint64).typeOf()).toBe(TealType.uint64);
      expect(slot.load().teal(options).argStart).toEqual(
        new ScratchLoad(slot).teal(options).argStart
      );
    });
  });

  it("test_scratch_load_default", function () {
    const slot = new ScratchSlot();
    const expr = new ScratchLoad(slot);
    expect(expr.typeOf()).toBe(TealType.anytype);

    const expected = new TealSimpleBlock([new TealOp(expr, Ops.load, [slot])]);

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });

  it("test_scratch_load_type", function () {
    for (const type of [TealType.uint64, TealType.bytes, TealType.anytype]) {
      const slot = new ScratchSlot();
      const expr = new ScratchLoad(slot, type);
      expect(expr.typeOf()).toEqual(type);

      const expected = new TealSimpleBlock([
        new TealOp(expr, Ops.load, [slot]),
      ]);

      const { argStart: actual } = expr.teal(options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_scratch_store", function () {
    for (const value of [
      new Int(1),
      new Bytes(["test"]),
      App.globalGet(new Bytes(["key"])),
      new If(new Int(1), new Int(2), new Int(3)),
    ]) {
      const slot = new ScratchSlot();
      const expr = new ScratchStore(slot, value);
      expect(expr.typeOf()).toBe(TealType.none);

      const { argStart: expected, argEnd: valueEnd } = value.teal(options);
      const storeBlock = new TealSimpleBlock([
        new TealOp(expr, Ops.store, [slot]),
      ]);
      valueEnd.nextBlock = storeBlock;

      const { argStart: actual } = expr.teal(options);

      expect(actual).toEqual(expected);
    }
  });

  it("test_scratch_stack_store", function () {
    const slot = new ScratchSlot();
    const expr = new ScratchStackStore(slot);
    expect(expr.typeOf()).toBe(TealType.none);

    const expected = new TealSimpleBlock([new TealOp(expr, Ops.store, [slot])]);

    const { argStart: actual } = expr.teal(options);

    expect(actual).toEqual(expected);
  });
});
