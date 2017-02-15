import { Action } from "@ngrx/store";
import { type } from "../../../shared/ngrx/type";
import { Collection } from "../../shared/collection.model";
import { PaginationOptions } from "../../shared/pagination-options.model";
import { SortOptions } from "../../shared/sort-options.model";

export const CollectionFindMultipleActionTypes = {
  FIND_MULTI_REQUEST: type('dspace/core/data/collection/FIND_MULTI_REQUEST'),
  FIND_MULTI_SUCCESS: type('dspace/core/data/collection/FIND_MULTI_SUCCESS'),
  FIND_MULTI_ERROR: type('dspace/core/data/collection/FIND_MULTI_ERROR')
};

export class CollectionFindMultipleRequestAction implements Action {
  type = CollectionFindMultipleActionTypes.FIND_MULTI_REQUEST;
  payload: {
    scope: Collection,
    paginationOptions: PaginationOptions,
    sortOptions: SortOptions
  };

  constructor(
    scope?: Collection,
    paginationOptions: PaginationOptions = new PaginationOptions(),
    sortOptions: SortOptions = new SortOptions()
  ) {
    this.payload = {
      scope,
      paginationOptions,
      sortOptions
    }
  }
}

export class CollectionFindMultipleSuccessAction implements Action {
  type = CollectionFindMultipleActionTypes.FIND_MULTI_SUCCESS;
  payload: Array<string>;

  constructor(collectionIDs: Array<string>) {
    this.payload = collectionIDs;
  }
}

export class CollectionFindMultipleErrorAction implements Action {
  type = CollectionFindMultipleActionTypes.FIND_MULTI_ERROR;
  payload: string;

  constructor(errorMessage: string) {
    this.payload = errorMessage;
  }
}

export type CollectionFindMultipleAction
  = CollectionFindMultipleRequestAction
  | CollectionFindMultipleSuccessAction
  | CollectionFindMultipleErrorAction;
