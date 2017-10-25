
import * as engchk from 'runtime-engine-check';
engchk(); // checks node version matches spec in package.json

import * as Ajv from 'ajv';
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
  const ajv = new Ajv({
    allErrors: true,
    format: 'full',
    verbose: true
  });
  if (getVersion(schema) === '4') {
    ajv.addMetaSchema(ajv04);
  }
  if (!ajv.validateSchema(fullSchema)) {
    throw new SchemaError(`Invalid schema`, ajv.errors);
  }
  if (data && !ajv.validate(fullSchema, data)) {
    throw new SchemaError(`Invalid data`, ajv.errors);
  }
  return true;
};
