import "jasmine";
import { approvalProgram, clearStateProgram } from "../examples/Asset";
import { Mode } from "../src/ir/Ops";
import { compileTeal } from "../src/compiler/Compiler";

describe("Compile Tests", function () {
  it("test_asset", function () {
    const approval = approvalProgram();
    const clearState = clearStateProgram();

    // only checking for successful compilation for now
    compileTeal(approval, Mode.Application, 2);
    compileTeal(clearState, Mode.Application, 2);
  });
});
