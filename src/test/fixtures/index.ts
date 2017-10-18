
import * as path from 'path';
const cwd = process.cwd();

const validSchema = require(path.join(cwd, 'src/test/fixtures/valid-schema.json'));
const validData = require(path.join(cwd, 'src/test/fixtures/valid-data'));
const inValidSchema = require(path.join(cwd, 'src/test/fixtures/invalid-schema'));
const inValidData = require(path.join(cwd, 'src/test/fixtures/invalid-data'));
const valid04Schema = require(path.join(cwd, 'src/test/fixtures/valid-schema-v04.json'));
const validSchemaInvalidVersion = require(path.join(cwd, 'src/test/fixtures/valid-schema-invalid-version.json'));

export const fixtures = {
  valid: {
    schema: validSchema,
    data: validData
  },
  invalid: {
    schema: inValidSchema,
    data: inValidData
  },
  v04: {
    schema: valid04Schema,
    data: validData
  },
  invalidVersion: {
    schema: validSchemaInvalidVersion,
    data: validData
  }
};
