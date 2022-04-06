import path from 'path';

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
      main: [`${path.join(process.cwd(), 'src/resources')}`, 'The name of the main bundle file'] as DescribedOption,
      minify: [ false, 'Whether to minify the bundle'] as DescribedOption,
      sourcemaps: [ false, 'Whether to generate sourcemaps'] as DescribedOption
    }
  }
};

export type Configuration = OptionsInferredFromDefaults<typeof optionSchema>;

// Based on this snippet from stackoverflow: https://stackoverflow.com/a/66661477
type SectionPathOf<T> = '' | (
  [T] extends [never] ? '' :
  T extends object ? (
    { [K in Exclude<keyof T, symbol>]:
      T[K] extends ValueType ? '' :
      `${K}${DotPrefix<SectionPathOf<T[K]>>}` }[
    Exclude<keyof T, symbol>] 
  ) : ''
) extends infer D ? Extract<D, string> : never;

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`

type OptionKey = SectionPathOf<Configuration>;

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
