"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Struct = exports.StructType = void 0;
const fields_1 = require("./fields");
const types_1 = require("./types");
class StructType extends types_1.CustomType {
    constructor(name, fieldsDefinitions) {
        super(name);
        this.fieldsDefinitions = [];
        this.fieldsDefinitions = fieldsDefinitions;
    }
    static fromJSON(json) {
        let definitions = (json.fields || []).map(definition => fields_1.FieldDefinition.fromJSON(definition));
        return new StructType(json.name, definitions);
    }
    getFieldsDefinitions() {
        return this.fieldsDefinitions;
    }
}
exports.StructType = StructType;
// TODO: implement setField(), convenience method.
// TODO: Hold fields in a map (by name), and use the order within "field definitions" to perform codec operations.
class Struct extends types_1.TypedValue {
    /**
     * Currently, one can only set fields at initialization time. Construction will be improved at a later time.
     */
    constructor(type, fields) {
        super(type);
        this.fields = [];
        this.fields = fields;
        this.checkTyping();
    }
    checkTyping() {
        let type = this.getType();
        let definitions = type.getFieldsDefinitions();
        fields_1.Fields.checkTyping(this.fields, definitions);
    }
    getFields() {
        return this.fields;
    }
    valueOf() {
        let result = {};
        for (const field of this.fields) {
            result[field.name] = field.value.valueOf();
        }
        return result;
    }
    equals(other) {
        if (!this.getType().equals(other.getType())) {
            return false;
        }
        let selfFields = this.getFields();
        let otherFields = other.getFields();
        return fields_1.Fields.equals(selfFields, otherFields);
    }
}
exports.Struct = Struct;
//# sourceMappingURL=struct.js.map