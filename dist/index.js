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
const ajv = require("ajv");
const a = require("awaiting");
const ajv04 = require('ajv/lib/refs/json-schema-draft-04.json');
const deref = require('json-schema-deref');
class SchemaError extends Error {
    constructor(message, errors) {
        super(message);
        this._errors = errors;
        Object.setPrototypeOf(this, SchemaError.prototype);
    }
    get errors() {
        return this._errors;
    }
}
exports.SchemaError = SchemaError;
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
exports.isValid = (schema, data = null) => __awaiter(this, void 0, void 0, function* () {
    const fullSchema = yield a.callback(deref, schema);
    let validate;
    validate = getValidator(fullSchema);
    if (data) {
        if (validate(data)) {
            return true;
        }
        throw new SchemaError(`Invalid data`, validate.errors);
    }
});
