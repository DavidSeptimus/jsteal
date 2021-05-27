import "jasmine";
import { TealComponent } from "./TealComponent";
import { Ops } from "./Ops";
import { TealOp } from "./TealOp";
import { Int } from "../ast/Int";

describe("TealComponent Tests", function () {
  it("test_EqualityContext", function () {
    const expr1 = new Int(1);
    const expr2 = new Int(1);

    const op1 = new TealOp(expr1, Ops.int, [1]);
    const op2 = new TealOp(expr2, Ops.int, [1]);

    expect(op1).toEqual(op1);
    expect(op2).toEqual(op2);
    expect(op1).not.toEqual(op2);
    expect(op2).not.toEqual(op1);

    TealComponent.withIgnoreExprEquality(() => {
      expect(op1).toEqual(op1);
      expect(op2).toEqual(op2);
      expect(op1).toEqual(op2);
      expect(op2).toEqual(op1);
    });

    expect(op1).not.toEqual(op2);
  });
});
