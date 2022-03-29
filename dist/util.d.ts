export declare type Constructor<Type = any, Args extends [] = any> = new (...args: Args) => Type;
export declare function Masquerade<Real extends Mask, Mask extends object>(Real: Constructor<Real>, Mask: Constructor<Mask>): Mask;
