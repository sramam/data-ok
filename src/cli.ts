#!/usr/bin/env node
import * as engchk from 'runtime-engine-check';
engchk(); // checks node version matches spec in package.json

import * as program from 'commander';
import { default as chalk } from 'chalk';
import * as fs from 'fs';
import * as a from 'awaiting';
import * as readPkg from 'read-pkg-up';
import { isValid, SchemaError } from '.';

const pkg = readPkg();
program
  .version(pkg.version)
  .option(`-d, --data <data>`, `data to validate`, null)
  .option(`-s, --schema <schema>`, `schema to use for validation`, {})
  .parse(process.argv);

Promise.resolve().then(async () => {
  const loadJson = async filename => {
    if (filename) {
      let contents;
      try {
        contents = await a.callback(fs.readFile, filename, 'utf8');
        return JSON.parse(contents);
      } catch (err) {
        throw new Error(`Invalid JSON ${filename}. ${err.message}`);
      }
    }
  };
  return {
    schema: await loadJson(program.schema),
    data: await loadJson(program.data)
  };
}).then(input => {
  return isValid(input.schema, input.data).then(() => {
    const msg = input.data ? `Data is valid` : `Schema is valid`;
    console.log(chalk.green(msg));
  });
}).catch(err => {
  console.error(chalk.red(err.message));
  if (err.errors) {
    console.error(chalk.red(JSON.stringify(err.errors, null, 2)));
  }
});
