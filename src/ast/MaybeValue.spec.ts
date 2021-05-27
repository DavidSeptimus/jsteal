import "jasmine";
import { TealComponent } from "../ir/TealComponent";
import { TealType } from "./Types";
import { Op, Ops } from "../ir/Ops";
import { TealBlock, TealSimpleBlock } from "../ir/TealBlock";
import { ScratchLoad, TealOp } from "../ir/TealOp";
import { CompileOptions } from "../compiler/Compiler";
import { MaybeValue } from "./MaybeValue";
import { Int } from "./Int";

describe("MaybeValue Tests", function () {
  const options = new CompileOptions();

  it("test_maybe_value", function () {
    const ops: Op[] = [
      Ops.app_global_get_ex,
      Ops.app_local_get_ex,
      Ops.asset_holding_get,
      Ops.asset_params_get,
    ];
    const types = [TealType.uint64, TealType.bytes, TealType.anytype];
    const immediateArgv = [[], ["AssetFrozen"]];
    const argv = [[], [new Int(0)], [new Int(1), new Int(2)]];

    for (const op of ops) {
      for (const type of types) {
        for (const iargs of immediateArgv) {
          for (const args of argv) {
            const expr = new MaybeValue(op, type, iargs, args);

            expect(expr.slotOk).not.toEqual(expr.slotValue);

            expect(expr.hasValue().typeOf()).toBe(TealType.uint64);
            TealComponent.withIgnoreExprEquality(() => {
              expect(expr.hasValue().teal(options)).toEqual(
                new ScratchLoad(expr.slotOk).teal(options)
              );
            });

            expect(expr.value().typeOf()).toBe(type);
            TealComponent.withIgnoreExprEquality(() => {
              expect(expr.value().teal(options)).toEqual(
                new ScratchLoad(expr.slotValue).teal(options)
              );
            });
            expect(expr.typeOf()).toBe(TealType.none);

            const expectedCall = new TealSimpleBlock([
              new TealOp(expr, op, [...iargs]),
              new TealOp(undefined, Ops.store, [expr.slotOk]),
              new TealOp(undefined, Ops.store, [expr.slotValue]),
            ]);

            let expected: TealBlock | undefined;
            if (args.length == 0) {
              expected = expectedCall;
            } else if (args.length == 1) {
              const block1 = args[0].teal(options);
              expected = block1.argStart;
              const afterArg = block1.argEnd;
              afterArg.nextBlock = expectedCall;
            } else if (args.length == 2) {
              const block1 = args[0].teal(options);
              expected = block1.argStart;
              const afterArg1 = block1.argEnd;
              const { argStart: arg2, argEnd: afterArg2 } = args[1].teal(
                options
              );
              afterArg1.nextBlock = arg2;
              afterArg2.nextBlock = expectedCall;
            }
            expected = expected as TealBlock;
            expected.addIncoming();
            expected = TealBlock.normalizeBlocks(expected);

            let { argStart: actual } = expr.teal(options);
            actual.addIncoming();
            actual = TealBlock.normalizeBlocks(actual);

            TealComponent.withIgnoreExprEquality(() => {
              expect(actual).toEqual(expected as TealBlock);
            });
          }
        }
      }
    }
  });
});
