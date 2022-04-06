declare type ResolvedValue = (options: Configuration) => ValueType;
declare type ValueType = string | boolean | number;
declare type ValueLike = ValueType | ResolvedValue;
declare type DescribedOption = [value: ValueLike, description: string];
declare type OptionDefaults = {
    [key: string]: OptionDefaults | ValueLike | DescribedOption;
};
declare type ExtractValueType<T extends ValueLike> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : T extends ResolvedValue ? ExtractValueType<ReturnType<T>> : never;
declare type OptionsInferredFromDefaults<T extends OptionDefaults> = {
    [key in keyof T]: T[key] extends DescribedOption ? ExtractValueType<T[key][0]> : T[key] extends ValueType ? ExtractValueType<T[key]> : T[key] extends ResolvedValue ? ExtractValueType<T[key]> : T[key] extends OptionDefaults ? OptionsInferredFromDefaults<T[key]> : never;
};
declare const optionSchema: {
    name: DescribedOption;
    presentation: {
        icon: string;
        themeColor: string;
    };
    build: {
        clean: boolean;
        out: DescribedOption;
        assets: {
            resources: string;
        };
        bundle: {
            main: DescribedOption;
            minify: DescribedOption;
            sourcemaps: DescribedOption;
        };
    };
};
export declare type Configuration = OptionsInferredFromDefaults<typeof optionSchema>;
export declare function populateConfiguration(set: Partial<Configuration>): any;
export {};
//# sourceMappingURL=config.d.ts.map