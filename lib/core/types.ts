import { SASSOptions } from "../sass";
import { ExportType, LogLevel, QuoteType } from "../typescript";

interface CLIOnlyOptions {
  banner: string;
  ignore: string[];
  ignoreInitial: boolean;
  exportType: ExportType;
  exportTypeName: string;
  exportTypeInterface: string;
  listDifferent: boolean;
  quoteType: QuoteType;
  updateStaleOnly: boolean;
  watch: boolean;
  logLevel: LogLevel;
  outputFolder: string | null;
  // @see https://sass-lang.com/documentation/cli/dart-sass/#pkg-importer-node
  "pkg-importer"?: string[];
}

export type CLIOptions = CLIOnlyOptions & Omit<SASSOptions, "importers">;

export type ConfigOptions = CLIOnlyOptions & SASSOptions;
