import { Loader, LoaderResource } from 'pixi.js';
import { Dict } from '../../../utils/types';
import { Attachment } from '../attachment';
import { Availability } from './object';

type Reservation = {
  resource: LoaderResource,
  count: number
}

const reservations: Dict<Reservation> = {};

/**
 * @param {Attachment<T>} container The object resources are attached to
 * @returns 
 */
// TODO: place a breakpoint here: is the first argument being shunted to the context?
export function prepare<T>(container: Attachment<T>): Availability {
  const resources: LoaderResource[] = [];
  let mustLoad = false;
  for (const key in container._bloom_assets) {
    if (!reservations[key]) {
      Loader.shared.add(key, key, () => {
        delete Loader.shared.resources[key];
      });
      mustLoad = true;
      reservations[key] = {
        resource: Loader.shared.resources[key],
        count: 0
      };
    }
    const reservation = reservations[key];
    reservation.count++;
    resources.push(reservation.resource);
  }
  if (mustLoad) Loader.shared.load();
  return new Availability(resources);
}

export function release<T>(resourcefulObject: Attachment<T>): void {
  for (const key in resourcefulObject._bloom_assets) {
    if (reservations[key]) {
      const reservation = reservations[key];
      reservation.count--;
      if (reservation.count == 0) {
        delete reservations[key];
      }
    }
  }
}

export function get(key: string): LoaderResource {
  return reservations[key].resource;
}