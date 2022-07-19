import {link, typedObject} from '../cache/builders/build-decorators';
import {ListableObject} from '../../shared/object-collection/shared/listable-object.model';
import {HALResource} from '../shared/hal-resource.model';
import {excludeFromEquals} from '../utilities/equals.decorators';
import {autoserialize, deserialize, inheritSerialization} from 'cerialize';
import {ResourceType} from '../shared/resource-type';
import {HALLink} from '../shared/hal-link.model';
import {Observable} from 'rxjs';
import {RemoteData} from '../data/remote-data';
import {GenericConstructor} from '../shared/generic-constructor';
import {HANDLE} from './handle.resource-type';
import {DSPACE_OBJECT} from '../shared/dspace-object.resource-type';
import {DSpaceObject} from '../shared/dspace-object.model';
import {isNotEmpty} from '../../shared/empty.util';

/**
 * Class the represents a metadata field
 */
@typedObject
export class Handle extends ListableObject implements HALResource {
  static type = HANDLE;

  /**
   * The object type
   */
  @excludeFromEquals
  @autoserialize
  type: ResourceType;

  /**
   * The identifier of this metadata field
   */
  @autoserialize
  id: number;

  /**
   * The qualifier of this metadata field
   */
  @autoserialize
  handle: string;

  /**
   * The element of this metadata field
   */
  @autoserialize
  resourceTypeID: number;

  /**
   * The {@link HALLink}s for this MetadataField
   */
  @deserialize
  _links: {
    self: HALLink,
    dspaceObject: HALLink
  };

  /**
   * The MetadataSchema for this MetadataField
   * Will be undefined unless the schema {@link HALLink} has been resolved.
   */
  @link(DSPACE_OBJECT)
  public dspaceObject?: Observable<RemoteData<DSpaceObject>>;

  // /**
  //  * Method to print this metadata field as a string without the schema
  //  * @param separator The separator between element and qualifier in the string
  //  */
  // toString(separator: string = '.'): string {
  //   let key = this.;
  //   if (isNotEmpty(this.qualifier)) {
  //     key += separator + this.qualifier;
  //   }
  //   return key;
  // }

  toString(): string {
    return 'fwefwe';
  }

  /**
   * Method that returns as which type of object this object should be rendered
   */
  getRenderTypes(): (string | GenericConstructor<ListableObject>)[] {
    return [this.constructor as GenericConstructor<ListableObject>];
  }
}