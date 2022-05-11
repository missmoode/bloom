/**
 * @hidden
 */
type Link<T> = {
  prev: Link<T> | null;
  next: Link<T> | null;
  value: T;
  remove(): T;
}


/**
 * A standard doubly-linked list.
 * Optimised for iteration and queueing. Other operations are as optimal as I can think of.
 * @typeParam T The type of the items in the list.
 */
export class LinkedList<T> {
  constructor(items?: Iterable<T>) {
    if (items !== undefined) this.pushAll(items);
  }

  /**
   * An iterable of links, containing the ability to remove the link from the list.
   */
  get links(): Iterable<LinkedList.ReadonlyLink<T>> {
    const head = this._head;
    return {
      [Symbol.iterator]: () => {
        let link = head;
        return {
          next: () => {
            if (link === null) {
              return { done: true, value: undefined };
            } else {
              const res = { done: false, value: link };
              link = link.next;
              return res;
            }
          }
        };
      }
    };
  }

  /**
   * An iterable of links in reverse order, containing the ability to remove the link from the list.
   */
  get reverseLinks(): Iterable<LinkedList.ReadonlyLink<T>> {
    const tail = this._tail;
    return {
      [Symbol.iterator]: () => {
        let link = tail;
        return {
          next: () => {
            if (link === null) {
              return { done: true, value: undefined };
            } else {
              const res = { done: false, value: link };
              link = link.prev;
              return res;
            }
          }
        };
      }
    };
  }

  /**
   * An iterable of values in the list.
   */
  get values(): Iterable<T> {
    const head = this._head;
    return {
      [Symbol.iterator]: () => {
        let link = head;
        return {
          next: () => {
            if (link === null) {
              return { done: true, value: undefined };
            } else {
              const res = { done: false, value: link.value };
              link = link.next;
              return res;
            }
          }
        };
      }
    };
  }

  /**
   * An iterable of values in the list in reverse order.
   */
  get reverseValues(): Iterable<T> {
    const tail = this._tail;
    return {
      [Symbol.iterator]: () => {
        let link = tail;
        return {
          next: () => {
            if (link === null) {
              return { done: true, value: undefined };
            } else {
              const res = { done: false, value: link.value };
              link = link.prev;
              return res;
            }
          }
        };
      }
    };
  }
    
  /** @internal */
  get [Symbol.toStringTag]() {
    return `(${Array.from(this.values).join(' -> ')})`;
  }
  /** @internal */
  [Symbol.toPrimitive](hint: 'default' | 'number' | 'string') {
    return hint === 'string' ? this.toString() : this.length;
  }
  toString() {
    return `LinkedList(${Array.from(this.values).join(' -> ')})`;
  }

  private _head: Link<T> | null = null;
  private _tail: Link<T> | null = null;

  /**
   * Returns the first item in the list
   */
  get head(): LinkedList.ReadonlyLink<T> | null {
    return this._head;
  }

  /**
   * Returns the last item in the list
   */
  get tail(): LinkedList.ReadonlyLink<T> | null {
    return this._tail;
  }

  private _length = 0;
  /**
   * Returns the number of items in the list
   */
  get length() {
    return this._length;
  }

  /**
   * Add an item to the list at the specified index
   * @param item The item to add to the list
   * @param position The position to add the item at. Negative values are from the end of the list, positive values are from the start.
   * @returns 
   */
  push(item: T, position = -1): LinkedList.ReadonlyLink<T> {
    if (position < 0) {
      position = this._length + position;
    }
    if (position < 0) {
      position = 0;
    }
    if (position > this._length) {
      position = this._length;
    }
    const newLink: Link<T> = {
      prev: null,
      next: null,
      value: item,
      remove: () => {
        if (newLink.prev != null) {
          newLink.prev.next = newLink.next;
        }
        if (newLink.next != null) {
          newLink.next.prev = newLink.prev;
        }
        if (this._head === newLink) {
          this._head = newLink.next;
        }
        if (this._tail === newLink) {
          this._tail = newLink.prev;
        }
        this._length--;
        return newLink.value;
      }
    };
    if (this._head === null || this._tail === null) {
      this._head = this._tail = newLink;
    } else {
      if (position === 0) {
        newLink.next = this._head;
        this._head.prev = newLink;
        this._head = newLink;
      } else if (position === this._length) {
        newLink.prev = this._tail;
        this._tail.next = newLink;
        this._tail = newLink;
      } else {
        const link = this.getIndex(position) as Link<T>;
        newLink.prev = link.prev;
        newLink.next = link;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        link.prev!.next = newLink;
        link.prev = newLink;
      }
    }
    this._length++;
    return newLink;
  }

  /**
   * Adds a collection of items to the end of the list
   * @param {Iterable<T>} items An iterable collection of items to add to the list
   * @param position The position to add the items at. Negative values are from the end of the list, positive values are from the start.
   * @returns {this This list for chaining
   */
  pushAll(items: Iterable<T>, position = 0): this {
    if (position < 0) {
      position = this._length + position;
    }
    for (const item of items) {
      this.push(item, position++);
    }
    return this;
  }
  /**
   * Get a link at a specific index
   * @param index The index of the link to return. Negative values are from the end of the list, positive values are from the start.
   * @returns {Link<T>} The link at the specified index
   * @throws If the index is out of bounds
   */
  getIndex(index: number): LinkedList.ReadonlyLink<T> {
    if (index < 0) {
      index = this._length + index;
    }
    if (index >= this._length || index < 0) {
      throw new Error(`Index out of bounds: ${index}`);
    }
    if (index == 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this._head!;
    } else if (index == this._length - 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this._tail!;
    } else if (index > this._length/2) {
      let i = this._length-1;
      for (const link of this.reverseLinks) {
        if (i-- === index) {
          return link;
        }
      }
    } else {
      for (const link of this.reverseLinks) {
        if (index === 0) {
          return link;
        }
        index--;
      }
    }
    throw new Error('Unreachable code');
  }

  /**
   * Removes an item at a specific index
   * @param {number} index The index of the item to remove 
   * @returns {T} The item at the specified index
   * @throws {Error} If the index is out of bounds
   */
  removeAt(index: number): T {
    const link = this.getIndex(index);
    this.getIndex(index).remove();
    return link.value;
  }
  
  /**
   * Find and remove an item from the list
   * @param {T} item The item to search for
   * @returns {boolean} True if the item was found and removed, false otherwise
   */
  remove(item: T): boolean {
    let link = this._head;
    while (link !== null) {
      if (link.value === item) {
        if (link.prev !== null) {
          link.prev.next = link.next;
        } else {
          this._head = link.next;
        }
        if (link.next !== null) {
          link.next.prev = link.prev;
        } else {
          this._tail = link.prev;
        }
        return true;
      }
      link = link.next;
    }
    this._length--;
    return false;
  }

  /**
   * Removes the last item from the list
   * @returns {T|undefined} The item that was removed, if any
   */
  pop(): T | undefined {
    if (this._tail === null) {
      return undefined;
    }
    const value = this._tail.value;
    this._tail = this._tail.prev;
    if (this._tail !== null) {
      this._tail.next = null;
    } else {
      this._head = null;
    }
    this._length--;
    return value;
  }

  /**
   * Removes the first item from the list
   * @returns {T|undefined} The item that was removed, if any
   */
  shift(): T | undefined {
    if (this._head === null) {
      return undefined;
    }
    const value = this._head.value;
    this._head = this._head.next;
    if (this._head !== null) {
      this._head.prev = null;
    } else {
      this._tail = null;
    }
    this._length--;
    return value;
  }


  /**
   * Clears the list
   */
  clear() {
    this._head = this._tail = null;
  }
  /**
   * @returns {boolean} True if the list is empty
   */
  isEmpty(): boolean {
    return this._head === null;
  }
  /**
   * Returns a copy of the list in reverse order
   */
  get inverse(): LinkedList<T> {
    return new LinkedList<T>(this.reverseValues);
  }

  /**
   * @returns {LinkedList<T>} A copy of the list
   */
  clone(): LinkedList<T> {
    const list = new LinkedList<T>();
    list.pushAll(this.values);
    return list;
  }

  /**
   * Iterate over the list, removing elements matching the predicate.
   * @param cullingPredicate The predicate to use
   * @returns The list for chaining.
   */
  cull(cullingPredicate: LinkedList.CullingPredicate<T>): this {
    for (const link of this.links) {
      if (!cullingPredicate(link.value)) {
        link.remove();
      }
    }
    return this;
  }

  /**
   * Create a new list with only the functions where the predicate returns true
   * @param cullingPredicate - The predicate to use
   * @returns The created list
   */
  filter(cullingPredicate: LinkedList.CullingPredicate<T>): LinkedList<T> {
    const list = new LinkedList<T>();
    for (const item of this.values) {
      if (cullingPredicate(item)) list.push(item);
    }
    return list;
  }
  
  /**
   * Create a new list with the results of applying a function to each item in the list.
   * @param mapper - The mapping function
   * @returns The new list
   */
  map<U>(mapper: LinkedList.Mapper<T, U>): LinkedList<U> {
    const list = new LinkedList<U>();
    for (const link of this.links) {
      list.push(mapper(link.value));
    }
    return list;
  }

  /**
   * Perform an operation once for each item in the list
   * @param callback - The callback to use
   */
  forEach(forEachCallback: LinkedList.ForEachCallback<T>) {
    let link = this._head;
    while (link !== null) {
      forEachCallback(link.value);
      link = link.next;
    }
  }
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LinkedList {
  /**
   * @callback cullingPredicate
   * @param item - The item to test
   * @returns {boolean} True if the item should be culled
   */
  export type CullingPredicate<T> = (item: T) => boolean;

  /**
   * @callback mapper
   * @param item The item to map
   * @returns {U} The mapped item
   */
  export type Mapper<T, U> = (item: T) => U;

  /**
   * @callback forEachCallback
   * @param item The item to process
   **/
  export type ForEachCallback<T> = (item: T) => void;

  /**
   * An item in a linked list.
   */
  export type ReadonlyLink<T> = {
    /**
     * The previous item in the list.
     */
    readonly prev: LinkedList.ReadonlyLink<T> | null;
    /**
     * The next item in the list.
     */
    readonly next: LinkedList.ReadonlyLink<T> | null;
    /**
     * The value of the item.
     */
    readonly value: T;
    /**
     * Remove this item from the list.
     */
    remove(): T;
  }
}