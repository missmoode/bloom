declare const levels: readonly ["debug", "info", "warn", "error"];
declare type Level = typeof levels[number];
declare type LogFunction = (message: string, premoji?: string) => void;
declare type Logger = {
    [loglevel in Level]: LogFunction;
} & {
    createLogger: typeof createLogger;
};
export declare function createLogger(domain?: string): Logger;
export {};
