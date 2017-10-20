#!/usr/bin/env node
import * as engchk from 'runtime-engine-check';
engchk(); // checks node version matches spec in package.json

import * as program from 'commander';
import { default as chalk } from 'chalk';
import { readFile } from 'fs-read-data';
import * as a from 'awaiting';
import * as readPkg from 'read-pkg-up';
import { isValid, SchemaError } from '.';

const pkg = readPkg();
program
  .version(pkg.version)
  .option(`-d, --data <data>`, `data to validate {json, yaml}`, null)
  .option(`-s, --schema <schema>`, `schema to use for validation {json, yaml}`, null)
  .parse(process.argv);

const JSON2 = j => JSON.stringify(j, null, 2);

Promise.resolve().then(async () => {
  if (!program.schema) {
    throw new Error(`--schema not specified`);
  }
  const schema = await readFile(program.schema);
  const data = program.data ? await readFile(program.data) : null;
  return {
    schema,
    data
  };
}).then(input => {
  return isValid(input.schema, input.data).then(() => {
    const msg = input.data ? `Data is valid` : `Schema is valid`;
    console.log(chalk.green(msg));
  });
}).catch(err => {
  console.error(chalk.red(err.message));
  if (err.errors) {
    console.error(chalk.red(JSON2(err.errors)));
    console.error(chalk.red(err.stack));
  }
});
