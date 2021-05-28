import "jasmine";
import { TealBlock, TealComponent } from "../../src/internal";

function blockEqualityTester(first: any, second: any) {
  return first instanceof TealBlock ? first.equals(second) : undefined;
}

function componentEqualityTest(first: any, second: any) {
  return first instanceof TealComponent ? first.equals(second) : undefined;
}

export default beforeAll(function () {
  jasmine.addCustomEqualityTester(blockEqualityTester);
  jasmine.addCustomEqualityTester(componentEqualityTest);
});
