import "jasmine";
import { Int } from "./Int";
import { App } from "./App";
import { TealType } from "./Types";
import { Pop } from "./UnaryExpr";
import { TealBlock } from "../ir/TealBlock";
import { TealInputError, TealTypeError } from "../Errors";
import { Seq } from "./Seq";
import { Bytes } from "./Bytes";
import { CompileOptions } from "../compiler/Compiler";

describe("Seq Tests", function () {
  const options = new CompileOptions();

  it("test_seq_one", function () {
    const items = [new Int(0)];
    const expr = new Seq(items);
    expect(expr.typeOf()).toBe(TealType.uint64);

    const { argStart: expected } = items[0].teal(options);
    const { argStart: actual } = expr.teal(options);
    expect(actual).toEqual(expected);
  });

  it("test_seq_two", function () {
    const items = [
      App.localPut(new Int(0), new Bytes(["key"]), new Int(1)),
      new Int(7),
    ];
    const expr = new Seq(items);
    expect(expr.typeOf()).toBe(items.slice(-1)[0].typeOf());

    const first = items[0].teal(options);
    let { argStart: expected } = first;
    const { argEnd: firstEnd } = first;
    firstEnd.nextBlock = items[1].teal(options).argStart;
    expected.addIncoming();
    expected = TealBlock.normalizeBlocks(expected);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_seq_three", function () {
    const items = [
      App.localPut(new Int(0), new Bytes(["key1"]), new Int(1)),
      App.localPut(new Int(1), new Bytes(["key2"]), new Bytes(["value2"])),
      Pop(new Bytes(["end"])),
    ];
    const expr = new Seq(items);
    expect(expr.typeOf()).toBe(items.slice(-1)[0].typeOf());

    const first = items[0].teal(options);
    let { argStart: expected } = first;
    const { argEnd: firstEnd } = first;

    const second = items[1].teal(options);
    const { argStart: secondStart } = second;
    const { argEnd: secondEnd } = second;
    firstEnd.nextBlock = secondStart;
    const { argStart: thirdStart } = items[2].teal(options);
    secondEnd.nextBlock = thirdStart;

    expected.addIncoming();
    expected = TealBlock.normalizeBlocks(expected);

    let { argStart: actual } = expr.teal(options);
    actual.addIncoming();
    actual = TealBlock.normalizeBlocks(actual);

    expect(actual).toEqual(expected);
  });

  it("test_seq_invalid", function () {
    expect(() => new Seq([])).toThrowError(TealInputError);
    expect(() => new Seq([new Int(1), Pop(new Int(2))])).toThrowError(
      TealTypeError
    );
    expect(() => new Seq([new Int(1), new Int(2)])).toThrowError(TealTypeError);
    expect(
      () => new Seq([new Seq([Pop(new Int(1)), new Int(2)]), new Int(3)])
    ).toThrowError(TealTypeError);
  });
});
