import {map, take} from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {combineLatest, Observable} from 'rxjs';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';

import { Item } from '../../core/shared/item.model';

import { fadeInOut } from '../../shared/animations/fade';
import { getAllSucceededRemoteDataPayload, redirectOn4xx } from '../../core/shared/operators';
import { ViewMode } from '../../core/shared/view-mode.model';
import { AuthService } from '../../core/auth/auth.service';
import {getItemPageRoute, getItemTombstoneRoute, ITEM_EDIT_PATH} from '../item-page-routing-paths';
import {isNotEmpty} from '../../shared/empty.util';
import {FeatureID} from '../../core/data/feature-authorization/feature-id';
import {AuthorizationDataService} from '../../core/data/feature-authorization/authorization-data.service';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-item-page',
  styleUrls: ['./item-page.component.scss'],
  templateUrl: './item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
export class ItemPageComponent implements OnInit {

  /**
   * The item's id
   */
  id: number;

  /**
   * The item wrapped in a remote-data object
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The view-mode we're currently on
   */
  viewMode = ViewMode.StandalonePage;

  /**
   * Route to the item's page
   */
  itemPageRoute$: Observable<string>;

  /**
   * Whether the current user is an admin or not
   */
  isAdmin$: Observable<boolean>;

  /**
   * If item is withdrawn and has new destination show custom tombstone page
   */
  showTombstone = false;

  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private items: ItemDataService,
    private authService: AuthService,
    private authorizationService: AuthorizationDataService,
  ) { }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService)
    );
    this.itemPageRoute$ = this.itemRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((item) => getItemPageRoute(item))
    );

    let isWithdrawn = false;
    let newDestination = '';
    let reasonOfWithdrawal = '';

    this.itemRD$.pipe(
      take(1),
      getAllSucceededRemoteDataPayload())
    .subscribe(item => {
      isWithdrawn = item.isWithdrawn;
      newDestination = item.metadata['dc.relation.isreplacedby']?.[0]?.value;
      const lastIndexOfProvenance = item.metadata['dc.description.provenance']?.length - 1;
      reasonOfWithdrawal = item.metadata['dc.description.provenance']?.[lastIndexOfProvenance]?.value;
    });

    // isNotEmpty(newDestination)
    if (isWithdrawn) {
      this.itemRD$.pipe(
        take(1),
        getAllSucceededRemoteDataPayload())
        .subscribe(item => {
          // for users navigate to the custom tombstone
          // for admin stay on the item page with tombstone flag
          this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
          this.isAdmin$.pipe(
            take(1)
          ).subscribe(isAdmin => {
            // do not show tombstone for admin but show it for users
            // this.showTombstone = !isAdmin;
            // @TODO uncomment code higher
            this.showTombstone = true;
            console.log('this.showTombstone',this.showTombstone);
          });
          // this.router.navigate([getItemTombstoneRoute(item)]);
        });
    }
  }
}
