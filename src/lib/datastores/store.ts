import { Immutable, LinkedList } from '../utils';
import { StoreProtocol, StoreState, UpdateParameters } from './protocol';



// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ActionName<T extends DataStore<any, StoreProtocol<any>>> = T extends DataStore<infer S, infer Protocol> ? Extract<keyof Protocol, string> : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreUpdate<T extends DataStore<any, StoreProtocol<any>>, Action extends ActionName<T> = ActionName<T>> =
// eslint-disable-next-line @typescript-eslint/no-unused-vars
T extends DataStore<infer S, infer Protocol>
? {
    [K in keyof Protocol]: { name: K, data: UpdateParameters<Protocol[K]>}
  }[Action]
: never;

export class DataStore<State extends StoreState, Protocol extends StoreProtocol<State>> {
  public static beginSchema<State extends StoreState, Protocol extends StoreProtocol<State>>(initialState: State, protocol: Protocol)
  : StoreConstructor<State, Protocol> {
    return StoreConstructor.from(initialState, protocol);
  }

  private listeners: { [key: string]: LinkedList<(store: Immutable<State>) => void> } = {};
  
  private protocol: Protocol;
  private _state: State;
  
  public constructor(initialState: State, protocol: Protocol) {
    this._state = initialState;
    this.protocol = protocol;
  }
  
  public get state(): Immutable<State> {
    return this._state;
  }
  public replaceState(state: State) {
    this._state = state;
  }

  /**
   * 
   * @param action The name of the action to dispatch (from the protocol)
   * @param data The data required by the action (the arguments of the action, after "store")
   */
  public dispatch<A extends StoreUpdate<typeof this>>(action: A['name'], ...data: A['data']) {
    if (!this.protocol[action]) throw new Error(`Action not found: ${action}`);
    this.protocol[action](this._state, ...data);
    if (this.listeners[action]) {
      this.listeners[action].forEach(listener => listener(this._state));
    }
  }

  /**
   * Register a listener for a specific action
   * @param action The action to listen for - can be any action name
   * @param callback The callback to be called when the event is dispatched
   * @returns A callback that can be used to remove the listener
   */
  public on(action: ActionName<typeof this>, callback: (store: Immutable<State>) => void): () => void {
    if (!this.protocol[action]) throw new Error(`Action not found: ${action}`);
    if (!this.listeners[action]) {
      this.listeners[action] = new LinkedList();
    }
    return this.listeners[action].push(callback).remove;
  }
}

class StoreConstructor<State extends StoreState, Protocol extends StoreProtocol<State>> {
  public static from<State extends StoreState, Protocol extends StoreProtocol<State>>(initialState: State, protocol: Protocol) {
    return new StoreConstructor(initialState, protocol);
  }

  private _state: State;
  public get initialState(): Immutable<State> {
    return this._state;
  }
  
  private constructor(initialState: State, private protocol: Protocol) {
    this._state = initialState;
  }

  /**
   * Extend the store with new actions and state. Will overwrite existing actions and state.
   * @param newValues Initial values for any new state, which will be shallow merged with the existing state
   * @param protocol Additional protocol action for the new store, which will be shallow merged with the existing protocol
   * @returns A new schema with the new state and protocol
   */
  public extend
  <ExtensionState extends StoreState, ExtensionProtocol extends StoreProtocol<State & ExtensionState>>
  (newValues: ExtensionState, protocol: ExtensionProtocol)
  : StoreConstructor<State & ExtensionState, Protocol & ExtensionProtocol> {
    return new StoreConstructor(
      { ...this._state, ...newValues },
      { ...this.protocol, ...protocol }
    );
  }

  public combine
  <ExtensionState extends StoreState, ExtensionProtocol extends StoreProtocol<ExtensionState>>
  (other: StoreConstructor<ExtensionState, ExtensionProtocol>)
  : StoreConstructor<State & ExtensionState, Protocol & ExtensionProtocol> {
    return new StoreConstructor(
      { ...this._state, ...other.initialState as ExtensionState },
      { ...this.protocol, ...other.protocol }
    );
  }

  public construct(): DataStore<State, Protocol> {
    return new DataStore(this._state, this.protocol);
  }
}