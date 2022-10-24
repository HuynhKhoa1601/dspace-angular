import { Injectable } from '@angular/core';
import { DsoPageSingleFeatureGuard } from '../../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { Item } from '../../core/shared/item.model';
import { ItemPageResolver } from '../item-page.resolver';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { Observable, of as observableOf } from 'rxjs';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';

@Injectable({
  providedIn: 'root'
})
/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring manage clarin licenses
 */
export class ItemPageClarinLicenseGuard extends DsoPageSingleFeatureGuard<Item> {
  constructor(protected resolver: ItemPageResolver,
              protected authorizationService: AuthorizationDataService,
              protected router: Router,
              protected authService: AuthService) {
    super(resolver, authorizationService, router, authService);
  }

  /**
   * Check manage clarin licenses authorization rights
   */
  getFeatureID(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FeatureID> {
    return observableOf(FeatureID.CanManageClarinLicenses);
  }
}
