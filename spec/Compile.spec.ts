import "jasmine";
import { approvalProgram, clearStateProgram } from "../examples/Asset";
import {
  approvalProgram as approvalSimplified,
  clearStateProgram as clearStateSimplified,
} from "../examples/AssetSimplified";
import { Mode } from "../src/ir/Ops";
import { compileTeal } from "../src/compiler/Compiler";

describe("Compile Tests", function () {
  fit("test_asset", function () {
    const approval = approvalProgram();
    const clearState = clearStateProgram();

    // only checking for successful compilation for now
    compileTeal(approval, Mode.Application, 2);
    compileTeal(clearState, Mode.Application, 2);
  });

  // test simplified asset with more concise syntax (underscore functions + spread function arguments)
  it("test_asset_simplified", function () {
    const approval = approvalSimplified();
    const clearState = clearStateSimplified();

    // only checking for successful compilation for now
    compileTeal(approval, Mode.Application, 2);
    compileTeal(clearState, Mode.Application, 2);
  });
});
