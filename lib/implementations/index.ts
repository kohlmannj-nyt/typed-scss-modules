import type sass from "sass";
import type sassEmbedded from "sass-embedded";

// https://github.com/type-challenges/type-challenges/issues/29285
type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false;

type DartSassStringOptionsAsync = sass.StringOptions<"async">;
type SassEmbeddedStringOptionsAsync = sassEmbedded.StringOptions<"async">;
export type SassStringOptionsAsync =
  IsAny<DartSassStringOptionsAsync> extends false
    ? DartSassStringOptionsAsync
    : SassEmbeddedStringOptionsAsync;

/**
 * A list of all possible SASS package implementations that can be used to
 * perform the compilation and parsing of the SASS files. The expectation is
 * that they provide a nearly identical API so they can be swapped out but
 * all of the same logic can be reused.
 */
export const IMPLEMENTATIONS = ["sass-embedded", "sass"] as const;
export type Implementations = (typeof IMPLEMENTATIONS)[number];

type Implementation = typeof sassEmbedded | typeof sass;

/**
 * Determine which default implementation to use by checking which packages
 * are actually installed and available to use.
 *
 * @param resolver DO NOT USE - this is unfortunately necessary only for testing.
 */
export const getDefaultImplementation = (
  resolver: RequireResolve = require.resolve
): Implementations => {
  let pkg: Implementations;

  try {
    resolver("sass-embedded");
    pkg = "sass-embedded";
  } catch (sassEmbeddedError) {
    try {
      resolver("sass");
      pkg = "sass";
    } catch (sassError) {
      pkg = "sass";
    }
  }

  return pkg;
};

/**
 * Retrieve the desired implementation.
 *
 * @param implementation the desired implementation.
 */
export const getImplementation = (
  implementation?: Implementations
): Implementation => {
  if (implementation === "sass") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require("sass");
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require("sass-embedded");
  }
};
