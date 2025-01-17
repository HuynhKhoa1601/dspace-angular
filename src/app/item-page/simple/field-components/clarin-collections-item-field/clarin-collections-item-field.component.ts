import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Collection } from '../../../../core/shared/collection.model';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import {
  getAllCompletedRemoteData,
  getAllSucceededRemoteDataPayload,
  getFirstSucceededRemoteDataPayload, getPaginatedListPayload
 } from '../../../../core/shared/operators';
import { map, scan, startWith, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { FindListOptions } from '../../../../core/data/request.models';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { hasValue } from '../../../../shared/empty.util';

@Component({
  selector: 'ds-clarin-collections-item-field',
  templateUrl: './clarin-collections-item-field.component.html',
  styleUrls: ['./clarin-collections-item-field.component.scss']
})
export class ClarinCollectionsItemFieldComponent implements OnInit {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Fontawesome v5. icon name with default settings.
   */
  @Input() iconName: string;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() separator: string;

  /**
   * Name of the metadata field.
   */
  label: 'item.page.collections';

  /**
   * Amount of mapped collections that should be fetched at once.
   */
  pageSize = 5;

  /**
   * Last page of the mapped collections that has been fetched.
   */
  lastPage$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * Push an event to this observable to fetch the next page of mapped collections.
   * Because this observable is a behavior subject, the first page will be requested
   * immediately after subscription.
   */
  loadMore$: BehaviorSubject<void> = new BehaviorSubject(undefined);

  /**
   * Whether or not a page of mapped collections is currently being loaded.
   */
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * Whether or not more pages of mapped collections are available.
   */
  hasMore$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * All collections that have been retrieved so far. This includes the owning collection,
   * as well as any number of pages of mapped collections.
   */
  collections$: Observable<Collection[]>;

  constructor(private cds: CollectionDataService) {

  }

  ngOnInit(): void {
    const owningCollection$: Observable<Collection> = this.cds.findOwningCollectionFor(this.item).pipe(
      getFirstSucceededRemoteDataPayload(),
      startWith(null as Collection),
    );

    const mappedCollections$: Observable<Collection[]> = this.loadMore$.pipe(
      // update isLoading$
      tap(() => this.isLoading$.next(true)),

      // request next batch of mapped collections
      withLatestFrom(this.lastPage$),
      switchMap(([_, lastPage]: [void, number]) => {
        return this.cds.findMappedCollectionsFor(this.item, Object.assign(new FindListOptions(), {
          elementsPerPage: this.pageSize,
          currentPage: lastPage + 1,
        }));
      }),

      getAllCompletedRemoteData<PaginatedList<Collection>>(),

      // update isLoading$
      tap(() => this.isLoading$.next(false)),

      getAllSucceededRemoteDataPayload(),

      // update hasMore$
      tap((response: PaginatedList<Collection>) => this.hasMore$.next(response.currentPage < response.totalPages)),

      // update lastPage$
      tap((response: PaginatedList<Collection>) => this.lastPage$.next(response.currentPage)),

      getPaginatedListPayload<Collection>(),

      // add current batch to list of collections
      scan((prev: Collection[], current: Collection[]) => [...prev, ...current], []),

      startWith([]),
    ) as Observable<Collection[]>;

    this.collections$ = combineLatest([owningCollection$, mappedCollections$]).pipe(
      map(([owningCollection, mappedCollections]: [Collection, Collection[]]) => {
        return [owningCollection, ...mappedCollections].filter(collection => hasValue(collection));
      }),
    );
  }

  handleLoadMore() {
    this.loadMore$.next();
  }

}
