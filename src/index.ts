
import * as engchk from 'runtime-engine-check';
engchk(); // checks node version matches spec in package.json

import * as ajv from 'ajv';
import * as a from 'awaiting';
const ajv04 = require('ajv/lib/refs/json-schema-draft-04.json');

const deref = require('json-schema-deref');
export class SchemaError extends Error {
  _errors: Array<object>;
  constructor(message, errors) {
    super(message);
    this._errors = errors;
    Object.setPrototypeOf(this, SchemaError.prototype);
  }
  get errors() {
    return this._errors;
  }
}

function getVersion(schema) {
  const s = schema['$schema'] || schema.schema || 'http://json-schema.org/draft-06/schema#';
  const m = s.match(/.*draft-0(\d).*/);
  return m ? m[1] : null;
}

function getValidator(schema) {
  const version = getVersion(schema);
  const validator = version === '4' ? ajv(ajv04) : ajv();
  validator.validateSchema(schema);
  return validator.compile(schema);
}

/**
 * Provides a convenience interface to validate a data object
 * against a dereferenced schema object.
 *
 * Throws a SchemaError if either the schema or data is not valid.
 * SchemaError provides an `errors` property, detailing individual
 * violations.
 *
 * @async
 * @param schema schema to validate data against
 * @param data data to validate
 * @returns Promise<boolean>
 */
export const isValid = async (schema, data = null): Promise<boolean> => {
  const fullSchema = await a.callback(deref, schema);
  let validate;
  validate = getValidator(fullSchema);
  if (data) {
    if (validate(data)) {
      return true;
    }
    throw new SchemaError(`Invalid data`, validate.errors);
  }
};
