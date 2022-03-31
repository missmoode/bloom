import { Config } from "../config";

export type Goal = (config: Config) => NodeJS.ReadWriteStream;

export function asPromise(stream: NodeJS.ReadWriteStream) {
  return new Promise<void>((resolve, reject) => {
      stream.on("end", () => resolve());
      stream.on("error", error => reject(error));
  });
}
export * from './web';