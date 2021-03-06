export type Interface<T, C> = C extends new (...args: infer A) => T ? new (...args: A) => T : never
