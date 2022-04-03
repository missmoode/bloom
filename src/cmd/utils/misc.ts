export function unicodeLength(str: string): number {
  if (str.length == 0) return 0;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return str.match(/./gu)!.length;
}

export function pad(str = '', length: number, padRight = false): string {
  if (unicodeLength(str) > length) {
    return `‥${str.slice(-length+1)}`;
  } else {
    return `${!padRight ? str : ''}${' '.repeat(length - unicodeLength(str))}${padRight ? str : ''}`;
  }
}