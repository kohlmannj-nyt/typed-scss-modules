import { getDefaultImplementation } from "../../lib/implementations";

describe("getDefaultImplementation", () => {
  it("returns sass-embedded if it exists", () => {
    expect(getDefaultImplementation()).toBe("sass-embedded");
  });

  it("returns sass if sass-embedded does not exist", () => {
    const resolver = jest.fn((implementation) => {
      if (implementation === "sass-embedded") {
        throw new Error("Not Found");
      }
    }) as unknown as RequireResolve;

    expect(getDefaultImplementation(resolver)).toBe("sass");
    expect(resolver).toHaveBeenCalledTimes(2);
    expect(resolver).toHaveBeenNthCalledWith(1, "sass-embedded");
    expect(resolver).toHaveBeenNthCalledWith(2, "sass");
  });

  it("returns sass even if sass-embedded and sass do not exist", () => {
    const resolver = jest.fn(() => {
      throw new Error("Not Found");
    }) as unknown as RequireResolve;

    expect(getDefaultImplementation(resolver)).toBe("sass");
    expect(resolver).toHaveBeenCalledTimes(2);
    expect(resolver).toHaveBeenNthCalledWith(1, "sass-embedded");
    expect(resolver).toHaveBeenNthCalledWith(2, "sass");
  });
});
