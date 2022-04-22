import { Filter } from 'pixi.js';
import { LoaderResource, ILoaderPlugin } from 'pixi.js';

const fileExtension = 'glsl';

export class DotShader implements ILoaderPlugin {
  add() {
    // shader files loaded as text
    LoaderResource.setExtensionXhrType(
      fileExtension,
      LoaderResource.XHR_RESPONSE_TYPE.TEXT
    );
  }
  use(resource: LoaderResource, next: ()=>void) {
    if (resource.extension !== fileExtension) {
      return next();
    }

    const text: string = resource.data;

    const vertFinder = /(?:\/\/ VERTEX SHADER\n)((?:.|\n)*?)(?=(?:\/\/ FRAGMENT SHADER\n)|$)/;
    const fragFinder = /(?:\/\/ FRAGMENT SHADER\n)((?:.|\n)*?)(?=(?:\/\/ VERTEX SHADER\n)|$)/;

    const vertexShader = vertFinder.exec(text);
    const fragmentShader = fragFinder.exec(text);

    const filter = new Filter(vertexShader != null ? vertexShader[1] : undefined, fragmentShader != null ? fragmentShader[1] : undefined);
    resource.data = filter;
    next();
  }
}