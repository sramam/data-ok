#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const engchk = require("runtime-engine-check");
engchk();
const program = require("commander");
const chalk = require("chalk");
const fs = require("fs");
const a = require("awaiting");
const readPkg = require("read-pkg-up");
const _1 = require(".");
const pkg = readPkg();
program
    .version(pkg.version)
    .option(`-d, --data <data>`, `data to validate`, null)
    .option(`-s, --schema <schema>`, `schema to use for validation`, {})
    .parse(process.argv);
Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
    const loadJson = (filename) => __awaiter(this, void 0, void 0, function* () {
        if (filename) {
            let contents;
            try {
                contents = yield a.callback(fs.readFile, filename, 'utf8');
                return JSON.parse(contents);
            }
            catch (err) {
                throw new Error(`Invalid JSON ${filename}. ${err.message}`);
            }
        }
    });
    return {
        schema: yield loadJson(program.schema),
        data: yield loadJson(program.data)
    };
})).then(input => {
    return _1.isValid(input.schema, input.data).then(() => {
        const msg = input.data ? `Data is valid` : `Schema is valid`;
        console.log(chalk.green(msg));
    });
}).catch(err => {
    console.error(chalk.red(err.message));
    if (err.errors) {
        console.error(chalk.red(JSON.stringify(err.errors, null, 2)));
    }
});
