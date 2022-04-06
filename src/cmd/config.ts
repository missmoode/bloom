import assert from 'assert';
import path from 'path';
import { InvalidOptionArgumentError, Option as CMDROption } from 'commander';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Dict<T = any> = { [key: string]: T };

// The default values for some options can be derived from other options, if set (eg. change the default value of `out` to the value of `applicationRoot`).
type ResolvedValue = (options: Configuration) => ValueType;
type ValueType = string | boolean | number;

type ValueLike = ValueType | ResolvedValue;

// The default value and a description of what it's for
type DescribedOption = [ value: ValueLike, description: string ];

// Nestable
type OptionDefaults = {[key: string]: OptionDefaults | ValueLike | DescribedOption };

type ExtractValueType<T extends ValueLike> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends ResolvedValue ? ExtractValueType<ReturnType<T>> : never;

type OptionsInferredFromDefaults<T extends OptionDefaults> = {
  [key in keyof T]: 
    T[key] extends DescribedOption ? 
      ExtractValueType<T[key][0]>
    : T[key] extends ValueType ? 
      ExtractValueType<T[key]>
    : T[key] extends ResolvedValue ? 
      ExtractValueType<T[key]>
    : T[key] extends OptionDefaults ?
      OptionsInferredFromDefaults<T[key]>
    :
      never
};

const optionSchema = {
  name: [ path.basename(process.cwd()), 'The name of the game, used in the title bar and in the manifest'] as DescribedOption,
  presentation: {
    icon: `${path.resolve(process.cwd(), path.join(process.cwd(), 'src/resources/icon.svg'))}`,
    themeColor: '#ffffff',
  },
  build: {
    clean: true,
    out: [ 'dist', 'The directory the final build will be placed in'] as DescribedOption,
    assets: {
      resources: `${path.resolve(process.cwd(), path.join(process.cwd(), 'src/resources/**/*'))}`,
    },
    bundle: {
      main: [`${path.join(process.cwd(), 'src/resources')}`, 'The path of the main bundle file'] as DescribedOption,
      minify: [ false, 'Whether to minify the bundle'] as DescribedOption,
      sourcemaps: [ false, 'Whether to generate sourcemaps'] as DescribedOption
    }
  }
};

export type Configuration = OptionsInferredFromDefaults<typeof optionSchema>;

// Based on this snippet from stackoverflow: https://stackoverflow.com/a/66661477
type DeepestPropertiesOf<T> = (
  [T] extends [never] ? '' :
  T extends object ? (
    { [K in Exclude<keyof T, symbol>]:
      T[K] extends ValueType ? K :
      `${DotPrefix<K, DeepestPropertiesOf<T[K]>>}` }[
    Exclude<keyof T, symbol>] 
  ) : ''
) extends infer D ? Extract<D, string> : never;

type DotPrefix<K, T extends string> = K extends string | number | bigint | boolean | null | undefined ? T extends '' ? '' : `${K}.${T}` : ''

type OptionKey = DeepestPropertiesOf<Configuration>;

function resolveConfiguration(set: any, defaults: any = optionSchema, resolutions?: ((opts: Configuration) => void)[]): any {
  const root = !resolutions;
  if (!resolutions) {
    resolutions = [];
  }

  const out: any = {};
  for (const key of Object.keys(defaults)) {
    const value = defaults[key];
    if (value instanceof Array) {
      set[key] ??= value[0];
    } else if (value instanceof Function) {
      resolutions.push((opts: Configuration) => {set[key] ??= value(opts);});
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      set[key] ??= value;
    } else {
      set[key] = resolveConfiguration(set[key] ?? {}, value, resolutions);
    }
  }
  if (root) {
    resolutions.forEach(fn => fn(out as Configuration));
  }
  return set;
}

export function populateConfiguration(set: Partial<Configuration>) {
  return resolveConfiguration(set);
}

export function setValue(configuration: Configuration, key: OptionKey, value: ValueType) {
  const parts = key.split('.');
  const last = parts.pop();
  const obj: Dict = parts.reduce((o, k) => o[k], configuration as Dict);
  assert(last, `Invalid option key: ${key}`);
  obj[last] = value;
}

export function getValue(configuration: Configuration, key: OptionKey): ValueType {
  const parts = key.split('.');
  const last = parts.pop();
  const obj: Dict = parts.reduce((o, k) => o[k], configuration as Dict);
  assert(last, `Invalid option key: ${key}`);
  return obj[last];
}

export function getDescription(key: OptionKey): string | undefined {
  const parts = key.split('.');
  const last = parts.pop();
  const obj: OptionDefaults = parts.reduce((o, k) => o[k], optionSchema as Dict);
  assert(last, `Invalid option key: ${key}`);
  const value = obj[last];
  if (value instanceof Array) {
    return value[1];
  } else {
    return undefined;
  }
}

// camelCase to dash-case
function dashCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function GetCommandLineOption(config: Configuration, key: OptionKey, flags = `--${dashCase(key)}`): CMDROption {
  const previous: ValueType = getValue(config, key);
  return new CMDROption(
    `${flags}${typeof previous === 'string' ? ' <value>' : typeof previous === 'number' ? ' <number>' : ''}`,
    getDescription(key)
  ).default(previous)
    .argParser((value: string) => {
      if (typeof previous === 'string') {
        return setValue(config, key, value);
      } else if (typeof previous === 'number') {
        if (!isNaN(Number(value))) {
          setValue(config, key, Number(value));
        } else {
          throw new InvalidOptionArgumentError(`Invalid number: ${value}`);
        }
      } else if (typeof previous === 'boolean') {
        setValue(config, key, true);
      } else {
        throw new InvalidOptionArgumentError(`Invalid option type for ${key}: ${typeof previous}`);
      }
    });
}