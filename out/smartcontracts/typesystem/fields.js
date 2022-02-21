"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fields = exports.Field = exports.FieldDefinition = void 0;
const errors = __importStar(require("../../errors"));
const typeExpressionParser_1 = require("./typeExpressionParser");
class FieldDefinition {
    constructor(name, description, type) {
        this.name = name;
        this.description = description;
        this.type = type;
    }
    static fromJSON(json) {
        let parsedType = new typeExpressionParser_1.TypeExpressionParser().parse(json.type);
        return new FieldDefinition(json.name, json.description, parsedType);
    }
}
exports.FieldDefinition = FieldDefinition;
class Field {
    constructor(value, name = "") {
        this.value = value;
        this.name = name;
    }
    checkTyping(expectedDefinition) {
        const actualType = this.value.getType();
        if (!actualType.equals(expectedDefinition.type)) {
            throw new errors.ErrTypingSystem(`check type of field "${expectedDefinition.name}; expected: ${expectedDefinition.type}, actual: ${actualType}"`);
        }
        if (this.name != expectedDefinition.name) {
            throw new errors.ErrTypingSystem(`check name of field "${expectedDefinition.name}"`);
        }
    }
    equals(other) {
        return this.name == other.name && this.value.equals(other.value);
    }
}
exports.Field = Field;
class Fields {
    static checkTyping(fields, definitions) {
        if (fields.length != definitions.length) {
            throw new errors.ErrTypingSystem("fields length vs. field definitions length");
        }
        for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let definition = definitions[i];
            field.checkTyping(definition);
        }
    }
    static equals(actual, expected) {
        if (actual.length != expected.length) {
            return false;
        }
        for (let i = 0; i < actual.length; i++) {
            let selfField = actual[i];
            let otherField = expected[i];
            if (!selfField.equals(otherField)) {
                return false;
            }
        }
        return true;
    }
}
exports.Fields = Fields;
//# sourceMappingURL=fields.js.map