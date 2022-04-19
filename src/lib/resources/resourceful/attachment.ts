

export type ResourceKey = string;

export type Attachment<T> = T & {
  _bloom_assets: ResourceKey[]
};

/**
 * @param base The object to attach resources to
 * @param resources The resources the view requires
 * @returns The view constructor packed with the resource keys for later loading
 */
export function attach<T>(base: T, resources: ResourceKey[]): Attachment<T> {
  return {
    ...base,
    _bloom_assets: resources
  } as Attachment<T>;
}

export function hasAttachedResources<T>(object: T): object is Attachment<T> {
  return (object as Attachment<T>)._bloom_assets !== undefined;
}