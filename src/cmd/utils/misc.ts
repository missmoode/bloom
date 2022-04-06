export function unicodeLength(str: string): number {
  if (str.length == 0) return 0;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return str.match(/./gu)!.length;
}