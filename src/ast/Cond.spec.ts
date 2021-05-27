import { CompileOptions } from "../compiler/Compiler";
import { Txn } from "./Txn";
import { TealType } from "./Types";
import { TealComponent } from "../ir/TealComponent";
import { TealInputError, TealTypeError } from "../Errors";
import { Cond } from "./Cond";
import { Int } from "./Int";
import { TealSimpleBlock } from "../ir/TealBlock";
import { TealConditionalBlock } from "../ir/TealConditionalBlock";
import { Err } from "./Err";
import { Bytes } from "./Bytes";
import { Arg } from "./Arg";

describe("Cond Tests", function () {
  const options = new CompileOptions();

  it("test_cond_one_pred", function () {
    const expr = new Cond([[new Int(1), new Int(2)]]);
    expect(expr.typeOf()).toEqual(TealType.uint64);

    const { argStart: cond1 }: { argStart: TealSimpleBlock } = new Int(1).teal(
      options
    );
    const { argStart: pred1 }: { argStart: TealSimpleBlock } = new Int(2).teal(
      options
    );
    const cond1Branch = new TealConditionalBlock([]);
    cond1.nextBlock = cond1Branch;
    cond1Branch.trueBlock = pred1;
    cond1Branch.falseBlock = new Err().teal(options).argStart;
    pred1.nextBlock = new TealSimpleBlock([]);
    const expected = cond1;

    const { argStart: actual }: { argStart: TealSimpleBlock } = expr.teal(
      options
    );

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_cond_two_pred", function () {
    const expr = new Cond([
      [new Int(1), new Bytes(["one"])],
      [new Int(0), new Bytes(["zero"])],
    ]);
    expect(expr.typeOf()).toEqual(TealType.bytes);

    const { argStart: cond1 }: { argStart: TealSimpleBlock } = new Int(1).teal(
      options
    );
    const { argStart: pred1 }: { argStart: TealSimpleBlock } = new Bytes([
      "one",
    ]).teal(options);
    const cond1Branch = new TealConditionalBlock([]);
    const { argStart: cond2 }: { argStart: TealSimpleBlock } = new Int(0).teal(
      options
    );
    const { argStart: pred2 }: { argStart: TealSimpleBlock } = new Bytes([
      "zero",
    ]).teal(options);
    const cond2Branch = new TealConditionalBlock([]);
    const end = new TealSimpleBlock([]);

    cond1.nextBlock = cond1Branch;
    cond1Branch.trueBlock = pred1;
    cond1Branch.falseBlock = cond2;
    pred1.nextBlock = end;

    cond2.nextBlock = cond2Branch;
    cond2Branch.trueBlock = pred2;
    cond2Branch.falseBlock = new Err().teal(options).argStart;
    pred2.nextBlock = end;

    const expected = cond1;

    const { argStart: actual }: { argStart: TealSimpleBlock } = expr.teal(
      options
    );

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_cond_three_pred", function () {
    const expr = new Cond([
      [new Int(1), new Int(2)],
      [new Int(3), new Int(4)],
      [new Int(5), new Int(6)],
    ]);
    expect(expr.typeOf()).toEqual(TealType.uint64);

    const { argStart: cond1 }: { argStart: TealSimpleBlock } = new Int(1).teal(
      options
    );
    const { argStart: pred1 }: { argStart: TealSimpleBlock } = new Int(2).teal(
      options
    );
    const cond1Branch = new TealConditionalBlock([]);
    const { argStart: cond2 }: { argStart: TealSimpleBlock } = new Int(3).teal(
      options
    );
    const { argStart: pred2 }: { argStart: TealSimpleBlock } = new Int(4).teal(
      options
    );
    const cond2Branch = new TealConditionalBlock([]);
    const { argStart: cond3 }: { argStart: TealSimpleBlock } = new Int(5).teal(
      options
    );
    const { argStart: pred3 }: { argStart: TealSimpleBlock } = new Int(6).teal(
      options
    );
    const cond3Branch = new TealConditionalBlock([]);
    const end = new TealSimpleBlock([]);

    cond1.nextBlock = cond1Branch;
    cond1Branch.trueBlock = pred1;
    cond1Branch.falseBlock = cond2;
    pred1.nextBlock = end;

    cond2.nextBlock = cond2Branch;
    cond2Branch.trueBlock = pred2;
    cond2Branch.falseBlock = cond3;
    pred2.nextBlock = end;

    cond3.nextBlock = cond3Branch;
    cond3Branch.trueBlock = pred3;
    cond3Branch.falseBlock = new Err().teal(options).argStart;
    pred3.nextBlock = end;

    const expected = cond1;

    const { argStart: actual }: { argStart: TealSimpleBlock } = expr.teal(
      options
    );

    TealComponent.withIgnoreExprEquality(() => {
      expect(actual).toEqual(expected);
    });
  });

  it("test_cond_invalid", function () {
    expect(() => new Cond([])).toThrowError(TealInputError);

    expect(
      () =>
        new Cond([
          [new Int(1), new Int(2)],
          [new Int(2), Txn.receiver()],
        ])
    ).toThrowError(TealTypeError);

    expect(() => new Cond([[new Arg(0), new Int(2)]])).toThrowError(
      TealTypeError
    );
  });
});
