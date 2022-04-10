import { Runner } from '@pixi/runner';
import { Ticker } from '@pixi/ticker';

export const updateRunner = new Runner('update');

Ticker.shared.add(() => updateRunner.emit(Ticker.shared.deltaMS));