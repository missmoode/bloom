declare const levels: readonly ["debug", "info", "warn", "error"];
declare type Level = typeof levels[number];
declare type LogFunction = (message: string, premoji?: string) => void;
export declare type Logger = {
    [loglevel in Level]: LogFunction;
} & {
    domain?: string;
    createLogger: typeof createLogger;
};
export declare function createLogger(domain?: string): Logger;
export {};
