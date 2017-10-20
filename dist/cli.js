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
const chalk_1 = require("chalk");
const fs_read_data_1 = require("fs-read-data");
const readPkg = require("read-pkg-up");
const _1 = require(".");
const pkg = readPkg();
program
    .version(pkg.version)
    .option(`-d, --data <data>`, `data to validate {json, yaml}`, null)
    .option(`-s, --schema <schema>`, `schema to use for validation {json, yaml}`, null)
    .parse(process.argv);
const JSON2 = j => JSON.stringify(j, null, 2);
Promise.resolve().then(() => __awaiter(this, void 0, void 0, function* () {
    if (!program.schema) {
        throw new Error(`--schema not specified`);
    }
    const schema = yield fs_read_data_1.readFile(program.schema);
    const data = program.data ? yield fs_read_data_1.readFile(program.data) : null;
    return {
        schema,
        data
    };
})).then(input => {
    return _1.isValid(input.schema, input.data).then(() => {
        const msg = input.data ? `Data is valid` : `Schema is valid`;
        console.log(chalk_1.default.green(msg));
    });
}).catch(err => {
    console.error(chalk_1.default.red(err.message));
    if (err.errors) {
        console.error(chalk_1.default.red(JSON2(err.errors)));
        console.error(chalk_1.default.red(err.stack));
    }
});
