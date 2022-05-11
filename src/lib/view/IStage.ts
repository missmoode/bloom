import { Container, Point } from 'pixi.js';

type Passed = 'addChild' | 'addChildAt' | 'removeChild' | 'removeChildAt' | 'removeChildren' | 'swapChildren' | 'getChildIndex' | 'setChildIndex' | 'sortChildren' | 'sortDirty' | 'sortableChildren' | 'children';

export interface Stage extends Pick<Container, Passed> {
  get mid(): Point;
}