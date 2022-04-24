type Link<T> = {
  prev: Link<T> | null;
  next: Link<T> | null;
  value: T;
  unlink(): void;
}
/**
 * A standard doubly-linked list.
 * Optimised for iteration and queueing. Other operations are as optimal as I can think of.
 */
export class LinkedList<T> implements Iterable<T> {
  [Symbol.iterator](){
    let head: Link<T> = { prev: null, next: this._head, value: undefined };
    return {
      next: () => {
        return {
          done: (head = head.next) === null,
          value: head.value,
        };
      }
    };
  }

  constructor(items: T[]);
  constructor(...items: T[]);
  constructor(items: Iterable<T>);
  constructor(items: Iterable<T>) {
    this.pushAll(...items);
  }
  
  get [Symbol.toStringTag]() {
    return `(${Array.from(this).join(' -> ')})`;
  }
  [Symbol.toPrimitive](hint: 'default' | 'number' | 'string') {
    return hint === 'string' ? this.toString() : this.length;
  }
  toString() {
    return `LinkedList(${Array.from(this).join(' -> ')})`;
  }

  private _head: Link<T> | null = null;
  private _tail: Link<T> | null = null;

  /**
   * Returns the first item in the list
   */
  readonly get firstItem(): T {
    return (this._head != null) ? this._head.value : undefined;
  }

  /**
   * Returns the last item in the list
   */
  readonly get lastItem(): T {
    return (this._tail != null) ? this._tail.value : undefined;
  }

  private _length = 0;
  /**
   * Returns the number of items in the list
   */
  get length() {
    return this._length;
  }

  /**
   * Adds an item to the end of the list
   * @param {T} items The item(s) to add
   * @returns {LinkedList<T>} This list for chaining
   */
  pushAll(...items: T[]): this;
  pushAll(items: T[]): this;
  pushAll(items: Iterable<T>): this;
  pushAll(items: Iterable<T>): this {
    for (const item of items) {
      if (this._head === null) {
        this._head = this._tail = { prev: null, next: null, value: item };
      } else {
        const newLink = { prev: this._tail, next: null, value: item };
        this._tail.next = newLink;
        this._tail = newLink;
      }
      this._length++;
    }
    return this;
  }

  /**
   * Adds an item to the start of the list
   * @param {T} item The item(s) to add
   * @returns {LinkedList<T>} This list for chaining
   */
  pushFront(item: T): this;
  pushFront(...items: T[]): this;
  pushFront(...items: T[]): this {
    for (const item of items) {
      if (this._head === null) {
        this._head = this._tail = { prev: null, next: null, value: item };
      } else {
        const newLink = { prev: null, next: this._head, value: item };
        this._head.prev = newLink;
        this._head = newLink;
      }
      this._length++;
      return this;
    }
  }

  /**
   * Get an item at a specific index
   * @param index The index of the item to return
   * @returns {T} The item at the specified index
   * @throws {Error} If the index is out of bounds
   */
  getIndex(index: number): T {
    if (index == 0) {
      return this._head;
    } else if (index == this._length - 1) {
      return this._tail;
    } else if (index > this._length/2) {
      if (index >= this._length || index < 0) {
        throw new Error(`Index out of bounds: ${index}`);
      }
      let link = this._tail;
      for (let i = this._length - 1; i > index; i--) {
        link = link.prev;
      }
      return link.value;
    } else {
      if (index >= this._length || index < 0) {
        throw new Error(`Index out of bounds: ${index}`);
      }
      let link = this._head;
      for (let i = 0; i < index; i++) {
        link = link.next;
      }
      return link.value;
    }
  }

  /**
   * Removes an item at a specific index
   * @param {number} index The index of the item to remove 
   * @returns {T} The item at the specified index
   * @throws {Error} If the index is out of bounds
   */
  removeAt(index: number): T {
    if (index === 0) {
      return this.popFront();
    } else if (index === this._length - 1) {
      return this.pop();
    } else if (index > this._length/2) {
      if (index >= this._length || index < 0) {
        throw new Error(`Index out of bounds: ${index}`);
      }
      let link = this._tail;
      for (let i = this._length - 1; i > index; i--) {
        link = link.prev;
      }
      link.prev.next = link.next;
      return link.value;
    } else {
      if (index >= this._length || index < 0) {
        throw new Error(`Index out of bounds: ${index}`);
      }
      let link = this._head;
      for (let i = 0; i < index; i++) {
        link = link.next;
      }
      link.prev.next = link.next;
      return link.value;
    }
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
   * @returns {T} The item that was removed
   */
  pop() {
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
   * @returns {T} The item that was removed
   */
  popFront() {
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
    const list = new LinkedList<T>();
    let link = this._tail;
    while (link !== null) {
      list.pushAll(link.value);
      link = link.prev;
    }
    return list;
  }

  /**
   * @returns {LinkedList<T>} A copy of the list
   */
  clone(): LinkedList<T> {
    const list = new LinkedList<T>();
    let link = this._head;
    while (link !== null) {
      list.pushAll(link.value);
      link = link.next;
    }
    return list;
  }

  /**
   * Iterate over the list, removing elements matching the predicate
   * @param {CullingPredicate} predicate The predicate to use
   */
  cull(predicate: CullingPredicate): LinkedList<T> {
    let link = this._head;
    while (link !== null) {
      if (predicate(link.value)) {
        link = link.next;
      } else {
        link = link.prev.next = link.next;
      }
    }
  }

  map<U>(mapper: Mapper<T, U>): LinkedList<U> {
    const list = new LinkedList<U>();
    let link = this._head;
    while (link !== null) {
      const value = mapper(link.value);
      if (value !== null && value !== undefined) {
        list.pushAll(mapper(link.value));
      }
      link = link.next;
    }
    return list;
  }

  /**
   * Perform an operation once for each item in the list
   * @param callback The callback to use
   */
  forEach(callback: ForEachCallback<T>) {
    let link = this._head;
    while (link !== null) {
      callback(link.value);
      link = link.next;
    }
  }
}

type CullingPredicate =
/**
 * @param item The item to test
 * @returns {boolean} True if the item should be culled
 */
(item: T) => boolean;

type Mapper<T, U> =
/**
 * @param item The item to map
 * @returns {U} The mapped item
 */
(item: T) => U;

type ForEachCallback<T> =
/**
 * @param item The item to process
 * @returns {void}
 **/
(item: T) => void;