import { Injectable } from '@angular/core';
import { dataService } from '../cache/builders/build-decorators';
import { ResourceType } from '../shared/resource-type';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from '../shared/operators';
import { map } from 'rxjs/operators';
import { PaginatedList } from './paginated-list.model';
import { DataService } from './data.service';
import { FindListOptions } from './request.models';
import { RequestParam } from '../cache/models/request-param.model';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { MetadataValue } from '../metadata/metadata-value.model';
import { VocabularyEntry } from '../submission/vocabularies/models/vocabulary-entry.model';
import { isNotEmpty } from '../../shared/empty.util';
import { EMPTY } from 'rxjs';

export const linkName = 'metadatavalues';
export const AUTOCOMPLETE = new ResourceType(linkName);

/**
 * A service responsible for fetching/sending data from/to the REST API - vocabularies endpoint
 */
@Injectable()
@dataService(MetadataValue.type)
export class MetadataValueDataService extends DataService<MetadataValue> {
  protected linkPath = linkName;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService,
    protected objectCache: ObjectCacheService,
    protected comparator: DefaultChangeAnalyzer<MetadataValue>,
    protected http: HttpClient,
    protected notificationsService: NotificationsService,
  ) {
    super();
  }

  /**
   * Retrieve the MetadataValue object inside Vocabulary object body
   */
  findByMetadataNameAndByValue(metadataName, term = ''): Observable<PaginatedList<MetadataValue>> {
      const metadataFields = metadataName.split('.');

      const schemaRP = new RequestParam('schema', '');
      const elementRP = new RequestParam('element', '');
      const qualifierRP = new RequestParam('qualifier', '');
      const termRP = new RequestParam('searchValue', term);

      // schema and element are mandatory - cannot be empty
      if (!isNotEmpty(metadataFields[0]) && !isNotEmpty(metadataFields[1])) {
        return EMPTY;
      }

      // add value to the request params
      schemaRP.fieldValue = metadataFields[0];
      elementRP.fieldValue = metadataFields[1];
      qualifierRP.fieldValue = isNotEmpty(metadataFields[2]) ? metadataFields[2] : null;

      const optionParams = Object.assign(new FindListOptions(), {}, {
        searchParams: [
          schemaRP,
          elementRP,
          qualifierRP,
          termRP
        ]
      });
      const remoteData$ = this.searchBy('byValue', optionParams);

      return remoteData$.pipe(
        getFirstSucceededRemoteDataPayload(),
        map((list: PaginatedList<MetadataValue>) => {
          const vocabularyEntryList: VocabularyEntry[] = [];
          list.page.forEach((metadataValue: MetadataValue) => {
            const voc: VocabularyEntry = new VocabularyEntry();
            voc.display = metadataValue.value;
            voc.value = metadataValue.value;
            vocabularyEntryList.push(voc);
          });
          // @ts-ignore
          list.page = vocabularyEntryList;
          return list;
        })
      );
  }
}
