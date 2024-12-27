import {
  camelCase,
  camelCaseTransformMerge,
  paramCase,
  snakeCase,
} from "change-case";
import { readFile } from "fs/promises";
import { dirname } from "path";
import {
  Implementations,
  SassStringOptionsAsync,
  getImplementation,
} from "../implementations";
import { sourceToClassNames } from "./source-to-class-names";

export type ClassName = string;
interface Transformer {
  (className: ClassName): string;
}

const transformersMap = {
  camel: (className: ClassName) =>
    camelCase(className, { transform: camelCaseTransformMerge }),
  dashes: (className: ClassName) =>
    /-/.test(className) ? camelCase(className) : className,
  kebab: (className: ClassName) => transformersMap.param(className),
  none: (className: ClassName) => className,
  param: (className: ClassName) => paramCase(className),
  snake: (className: ClassName) => snakeCase(className),
} as const;

type NameFormatWithTransformer = keyof typeof transformersMap;
const NAME_FORMATS_WITH_TRANSFORMER = Object.keys(
  transformersMap
) as NameFormatWithTransformer[];

export const NAME_FORMATS = [...NAME_FORMATS_WITH_TRANSFORMER, "all"] as const;
export type NameFormat = (typeof NAME_FORMATS)[number];

export type SASSOptions = {
  additionalData?: string;
  // includePaths?: string[];
  nameFormat?: string | string[];
  implementation: Implementations;
} & SassStringOptionsAsync;
export const nameFormatDefault: NameFormatWithTransformer = "camel";

export const fileToClassNames = async (
  file: string,
  {
    additionalData = "",
    nameFormat: rawNameFormat,
    implementation,
    loadPaths = [],
    ...otherSassOptions
  }: SASSOptions = {} as SASSOptions
) => {
  const { compileStringAsync } = getImplementation(implementation);

  const nameFormat = (
    typeof rawNameFormat === "string" ? [rawNameFormat] : rawNameFormat
  ) as NameFormat[];

  const nameFormats: NameFormatWithTransformer[] = nameFormat
    ? nameFormat.includes("all")
      ? NAME_FORMATS_WITH_TRANSFORMER
      : (nameFormat as NameFormatWithTransformer[])
    : [nameFormatDefault];

  const fileContent = (await readFile(file)).toString();
  const source = `${
    additionalData ? `${additionalData}\n\n` : ""
  }${fileContent}`;

  console.log({ loadPaths: [dirname(file), ...loadPaths] });
  const result = await compileStringAsync(
    source,
    // @ts-expect-error Either for sass-embedded or sass
    { loadPaths: [dirname(file), ...loadPaths], ...otherSassOptions }
  );

  const classNames = await sourceToClassNames(result.css, file);
  const transformers = nameFormats.map((item) => transformersMap[item]);
  const transformedClassNames = new Set<ClassName>([]);
  classNames.forEach((className: ClassName) => {
    transformers.forEach((transformer: Transformer) => {
      transformedClassNames.add(transformer(className));
    });
  });

  return Array.from(transformedClassNames).sort((a, b) => a.localeCompare(b));
};
