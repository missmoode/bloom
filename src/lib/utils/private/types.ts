export type Interface<T, C> = C extends new (...args: infer A) => T ? new (...args: A) => T : never

/**
 * Conditional type that recursively sets an object to readonly, or a value to readonly.
*/
export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
}

export type DeepWritable<T> = {
  -readonly [P in keyof T]: DeepWritable<T[P]>;
};

// Taken from stackoverflow: https://stackoverflow.com/a/61960616
export type ValidateShape<A, B> = A extends B
  ? B extends A
    ? A
    : never
  : never

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T | undefined;