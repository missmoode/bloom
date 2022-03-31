export interface Config {
    name: string;
    shortname?: string;
    iconSVGPath: string;
    themeColor: string;
    rootScript: string;
    resources: string | string[];
    outDir: string;
    sourceMaps: boolean;
}
export declare const defaults: {
    outDir: string;
    sourceMaps: boolean;
};
