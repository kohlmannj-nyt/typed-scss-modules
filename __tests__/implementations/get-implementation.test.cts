import sass from "sass";
import sassEmbedded from "sass-embedded";
import { getImplementation } from "../../lib/implementations";

describe("getImplementation", () => {
  it("returns the correct implementation when explicitly passed", () => {
    expect(getImplementation("sass-embedded")).toEqual(sassEmbedded);
    expect(getImplementation("sass")).toEqual(sass);
  });

  it("returns the correct default implementation if it is invalid", () => {
    expect(
      getImplementation(
        // @ts-expect-error invalid implementation
        "wat-sass"
      )
    ).toEqual(sassEmbedded);
    expect(getImplementation()).toEqual(sassEmbedded);
  });
});
