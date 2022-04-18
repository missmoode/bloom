import isEqual from 'lodash.isequal';

/**
 * Array equality check
 * @param a - The first array.
 * @param b - The array to compare to.
 * @returns {boolean} - True if the arrays are equal, false otherwise.
 */
export function arraysEqual(a: any[], b: any[]): boolean {
  return a.length === b.length && a.every((item, index) => isEqual(item, b[index]));
}
