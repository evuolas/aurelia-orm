import { OrmMetadata } from '../orm-metadata';
import { Validator } from 'aurelia-validation';

export function validation(ValidatorClass = Validator) {
  return function (target) {
    OrmMetadata.forTarget(target).put('validation', ValidatorClass);
  };
}