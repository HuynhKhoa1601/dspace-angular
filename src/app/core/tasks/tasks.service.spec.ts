/* eslint-disable max-classes-per-file */
import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { TasksService } from './tasks.service';
import { RequestService } from '../data/request.service';
import { TaskDeleteRequest, TaskPostRequest } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { TaskObject } from './models/task-object.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HttpHeaders } from '@angular/common/http';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { compare, Operation } from 'fast-json-patch';
import { of as observableOf } from 'rxjs';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { CoreState } from '../core-state.model';
import { FindListOptions } from '../data/find-list-options.model';
import { testSearchDataImplementation } from '../data/base/search-data.spec';

const LINK_NAME = 'test';

class TestTask extends TaskObject {
}

class TestService extends TasksService<TestTask> {
  protected linkPath = LINK_NAME;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super('testtasks', requestService, rdbService, objectCache, halService);
  }
}

class DummyChangeAnalyzer implements ChangeAnalyzer<TestTask> {
  diff(object1: TestTask, object2: TestTask): Operation[] {
    return compare((object1 as any).metadata, (object2 as any).metadata);
  }

}


describe('TasksService', () => {
  let scheduler: TestScheduler;
  let service: TestService;
  const taskEndpoint = 'https://rest.api/task';
  const linkPath = 'testTask';
  const requestService = getMockRequestService();
  const halService: any = new HALEndpointServiceStub(taskEndpoint);
  const rdbService = getMockRemoteDataBuildService();
  const objectCache = {
    addPatch: () => {
      /* empty */
    },
    getObjectBySelfLink: () => {
      /* empty */
    }
  } as any;
  const store = {} as Store<CoreState>;

  function initTestService(): TestService {
    return new TestService(
      requestService,
      rdbService,
      objectCache,
      halService,
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();
    service = initTestService();
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;

  });

  describe('composition', () => {
    const initService = () => new TestService(null, null, null, null);
    testSearchDataImplementation(initService);
  });

  describe('postToEndpoint', () => {

    it('should send a new TaskPostRequest', () => {
      const expected = new TaskPostRequest(requestService.generateRequestId(), `${taskEndpoint}/${linkPath}`, {});
      scheduler.schedule(() => service.postToEndpoint('testTask', {}).subscribe());
      scheduler.flush();

      expect(requestService.send).toHaveBeenCalledWith(expected);
    });
  });

  describe('deleteById', () => {

    it('should send a new TaskDeleteRequest', () => {
      const scopeId = '1234';
      const expected = new TaskDeleteRequest(requestService.generateRequestId(), `${taskEndpoint}/${linkPath}/${scopeId}`, null);
      scheduler.schedule(() => service.deleteById('testTask', scopeId).subscribe());
      scheduler.flush();

      expect(requestService.send).toHaveBeenCalledWith(expected);
    });
  });

  describe('searchTask', () => {

    it('should call findByHref with the href generated by getSearchByHref', () => {

      spyOn((service as any).searchData, 'getSearchByHref').and.returnValue(observableOf('generatedHref'));
      spyOn(service, 'findByHref').and.returnValue(observableOf(null));

      const followLinks = {};
      const options = new FindListOptions();
      options.searchParams = [];

      scheduler.schedule(() => service.searchTask('method', options, followLinks as any).subscribe());
      scheduler.flush();

      expect((service as any).searchData.getSearchByHref).toHaveBeenCalledWith('method', options, followLinks as any);
      expect(service.findByHref).toHaveBeenCalledWith('generatedHref', false, true);
    });
  });

  describe('getEndpointById', () => {

    it('should call halService.getEndpoint and then getEndpointByIDHref', () => {

      spyOn(halService, 'getEndpoint').and.returnValue(observableOf('generatedHref'));
      spyOn(service, 'getEndpointByIDHref').and.returnValue(null);

      scheduler.schedule(() => service.getEndpointById('scopeId').subscribe());
      scheduler.flush();

      expect(halService.getEndpoint).toHaveBeenCalledWith(service.getLinkPath());
      expect(service.getEndpointByIDHref).toHaveBeenCalledWith('generatedHref', 'scopeId');
    });
  });

});
