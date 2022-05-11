import { Stage } from './IStage';
import { View } from './View';


export type ViewConstructor = new (stage: Stage, ...args: any[]) => View;

// export type ViewConstructorParameters<T extends ViewConstructor> = ConstructorParameters<T> extends [unknown, ...infer A] ? A : [];
export type ViewConstructorParameters<T extends ViewConstructor> = ConstructorParameters<T> extends [unknown, ...infer A] ? A : [];

export type ViewTarget<T extends ViewConstructor = ViewConstructor> = {View: T, params: ViewConstructorParameters<T>};

export function target<T extends ViewConstructor>(View: T, ...params: ViewConstructorParameters<T>): ViewTarget<T> {
  return { View, params };
}