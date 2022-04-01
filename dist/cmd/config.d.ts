export declare type Config = {
    name: string;
    shortname?: string;
    description?: string;
    icon: string;
    applicationRoot: string;
    resources: string | string[];
    themeColor: string;
    out: string;
    production: boolean;
};
export declare function resolve(options: any): Config;
