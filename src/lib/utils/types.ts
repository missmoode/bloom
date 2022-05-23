export type Dict<T> = { [key: string]: T };

export type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
}