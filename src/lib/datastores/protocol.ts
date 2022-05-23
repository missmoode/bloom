/* eslint-disable @typescript-eslint/no-explicit-any */
export type DataStoreType =
  | string
  | number
  | boolean
  | DataStoreType[]
  | { [key: string]: DataStoreType };

export interface StoreState {
  [key: string]: DataStoreType;
}


/**
 * A key-value store of data actions, where the key is the name of the action and the value is the function that updates the data store
 */
export interface StoreProtocol<Store extends StoreState> {
  [name: string]: StoreUpdateReducer<Store>
}

export type StoreUpdateReducer<Store extends StoreState>
/**
 * A function that takes the data store and the arguments of the action and updates the data store
 * @param store The data store for mutation
 * @param DataStoreType args The arguments of the action
 */
= (state: Store, ...args: any[]) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UpdateParameters<A extends StoreUpdateReducer<any>> = Parameters<A> extends [unknown, ...infer P] ? P : [];
