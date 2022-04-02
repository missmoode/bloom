import { LoaderResource, ILoaderPlugin } from '@pixi/loaders';
export declare class ShaderLoaderPlugin implements ILoaderPlugin {
    add(): void;
    use(resource: LoaderResource, next: () => void): void;
}
