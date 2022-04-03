export declare type ResourceTarget = string;
export declare type ResourceContainer = {
    _resources: ResourceTarget[];
};
export declare type Resourceful<T> = T & ResourceContainer;
export declare class Resources {
    private static reservations;
    private constructor();
    /**
     * @param base The object to attach resources to
     * @param resources The resources the view requires
     * @returns The view constructor packed with the resource keys for later loading
     */
    static attach<T>(base: T, resources: ResourceTarget[]): Resourceful<T>;
    static loaded(resourcefulObject: ResourceContainer): boolean;
    static load(resourcefulObject: ResourceContainer): void;
    static unload(resourcefulObject: ResourceContainer): void;
}
