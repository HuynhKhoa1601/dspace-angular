import { URLCombiner } from '../core/url-combiner/url-combiner';
import { Item } from '../core/shared/item.model';
import { isNotEmpty } from '../shared/empty.util';
import {HANDLE_TABLE_MODULE_PATH} from '../app-routing-paths';

export const ITEM_MODULE_PATH = 'items';

export function getItemModuleRoute() {
  return `/${ITEM_MODULE_PATH}`;
}

/**
 * Get the route to an item's page
 * Depending on the item's entity type, the route will either start with /items or /entities
 * @param item  The item to retrieve the route for
 */
export function getItemPageRoute(item: Item) {
  const type = item.firstMetadataValue('dspace.entity.type');
  return getEntityPageRoute(type, item.uuid);
}

export function getItemEditRoute(item: Item) {
  return new URLCombiner(getItemPageRoute(item), ITEM_EDIT_PATH).toString();
}

export function getItemEditVersionhistoryRoute(item: Item) {
  return new URLCombiner(getItemPageRoute(item), ITEM_EDIT_PATH, ITEM_EDIT_VERSIONHISTORY_PATH).toString();
}

export function getEntityPageRoute(entityType: string, itemId: string) {
  if (isNotEmpty(entityType)) {
    return new URLCombiner('/entities', encodeURIComponent(entityType.toLowerCase()), itemId).toString();
  } else {
    return new URLCombiner(getItemModuleRoute(), itemId).toString();
  }
}

export function getEntityEditRoute(entityType: string, itemId: string) {
  return new URLCombiner(getEntityPageRoute(entityType, itemId), ITEM_EDIT_PATH).toString();
}

/**
 * Get the route to an item's version
 * @param versionId the ID of the version for which the route will be retrieved
 */
export function getItemVersionRoute(versionId: string) {
  return new URLCombiner(getItemModuleRoute(), ITEM_VERSION_PATH, versionId).toString();
}


export const TOMBSTONE_ITEM_PATH = 'tombstone';
export function getItemTombstoneRoute(item: Item) {
  return new URLCombiner(getItemPageRoute(item), TOMBSTONE_ITEM_PATH).toString();
}

export const ITEM_EDIT_PATH = 'edit';
export const ITEM_EDIT_VERSIONHISTORY_PATH = 'versionhistory';
export const ITEM_VERSION_PATH = 'version';
export const UPLOAD_BITSTREAM_PATH = 'bitstreams/new';

export const MATOMO_STATISTICS_PATH = 'matomo-statistics';
export function getMatomoStatisticsPath() {
  return `/${HANDLE_TABLE_MODULE_PATH}`;
}
