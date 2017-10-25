
import { test } from 'ava';
import { isValid } from '../..';
import { fixtures } from '../fixtures';
import * as execa from 'execa';

const JSON2 = j => JSON.stringify(j, null, 2);

test('data-ok API schema-ok', async (t) => {
  try {
    await isValid(fixtures.valid.schema);
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('data-ok API schema-v04-ok', async (t) => {
  try {
    await isValid(fixtures.v04.schema, null);
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('data-ok API schema with invalid version', async (t) => {
  try {
    await isValid(fixtures.invalidVersion.schema, null);
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('data-ok API schema-ok, data-ok', async (t) => {
  try {
    await isValid(fixtures.valid.schema, fixtures.valid.data);
    t.pass();
  } catch (err) {
    t.fail(err.message);
  }
});

test('data-ok API schema-fail', async (t) => {
  try {
    await isValid(fixtures.invalid.schema);
    t.fail('invalid *schema* passed validation!');
  } catch (err) {
    // console.log(err);
    t.regex(
      err.message,
      /Invalid schema/,
      err.message);
    t.deepEqual(
      err.errors,
      [{
        keyword: 'type',
        dataPath: '.properties',
        schemaPath: '#/properties/properties/type',
        params: {
          type: 'object'
        },
        message: 'should be object',
        schema: 'object',
        parentSchema: {
          type: 'object',
          additionalProperties: {
            $ref: '#'
          },
          default: {}
        },
        data: [
          'string',
          'number'
        ]
      }],
      JSON2(err.errors)
    );
  }
});

test('data-ok API schema-ok, data-fail', async (t) => {
  try {
    await isValid(fixtures.valid.schema, fixtures.invalid.data);
    t.fail('invalid *data* passed validation!');
  } catch (err) {
    t.regex(
      err.message,
      /Invalid data.*/
    );
    t.regex(
      err.errors[0].message,
      /should NOT have additional properties/
    );
  }
});

test('data-ok CLI schema-ok', async (t) => {
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-s',
      'src/test/fixtures/valid-schema.json'
    ]
  );
  t.regex(result.stdout, /Schema is valid/, JSON2(result));
});

test('data-ok CLI schema-ok, data-ok', async (t) => {
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-s',
      'src/test/fixtures/valid-schema.json',
      '-d',
      'src/test/fixtures/valid-data.json'
    ]
  );
  t.regex(result.stdout, /Data is valid/, JSON2(result));
});


test('data-ok CLI schema-fail', async (t) => {
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-s',
      'src/test/fixtures/invalid-schema.json'
    ]
  ).catch(err => {
    console.log(`#### schema-fail error`);
    console.log(err);
  });
  t.regex(
    result.stderr,
    /Invalid schema(.|[\n])*"message": "should be object".*/,
    JSON2(result));
});

test('data-ok CLI schema-fail, data-fail', async (t) => {
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-s',
      'src/test/fixtures/valid-schema.json',
      '-d',
      'src/test/fixtures/invalid-data.json'
    ]
  );
  t.regex(result.stderr, /Invalid data.*/, JSON2(result));
});

test(`data-ok CLI invalid schema file`, async t => {
  const result = await execa(
    'node',
    [
      'build/cli.js',
      '-s',
      'src/test/fixtures/non-existant.yaml'
    ]).catch(err => {
      t.fail(err.message);
    });
  t.regex(
    result.stderr,
    /ENOENT: no such file or directory, open .*non-existant.yaml.*/,
    JSON2(result));
});


test(`data-ok CLI invalid schema file`, async t => {
  const result = await execa(
    'node',
    [
      'build/cli.js',
    ]);
  t.regex(
    result.stderr,
    /--schema not specified/,
    JSON2(result));
});
