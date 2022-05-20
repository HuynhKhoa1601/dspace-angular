import { FieldParser } from './field-parser';
import { FormFieldMetadataValueObject } from '../models/form-field-metadata-value.model';
import { DynamicTagModel, DynamicTagModelConfig } from '../ds-dynamic-form-ui/models/tag/dynamic-tag.model';
import {
  DynamicAutocompleteModel,
  DynamicAutocompleteModelConfig
} from '../ds-dynamic-form-ui/models/autocomplete/dynamic-autocomplete.model';

export class AutocompleteFieldParser extends FieldParser {

  public modelFactory(fieldValue?: FormFieldMetadataValueObject | any, label?: boolean): any {
    // return new Dynamic
    const autocompleteModelConfig: DynamicAutocompleteModelConfig = this.initModel(null, label);
    if (this.configData.selectableMetadata[0].controlledVocabulary
      && this.configData.selectableMetadata[0].controlledVocabulary.length > 0) {
      this.setVocabularyOptions(autocompleteModelConfig);
    }

    // get options from the server v componente, ked zacnem nieco pisat

    this.setValues(autocompleteModelConfig, fieldValue, null, true);

    const autocompleteModel = new DynamicAutocompleteModel(autocompleteModelConfig);

    return autocompleteModel;
  }

}