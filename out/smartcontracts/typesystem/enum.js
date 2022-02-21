"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumValue = exports.EnumVariantDefinition = exports.EnumType = void 0;
const utils_1 = require("../../utils");
const fields_1 = require("./fields");
const types_1 = require("./types");
const SimpleEnumMaxDiscriminant = 256;
class EnumType extends types_1.CustomType {
    constructor(name, variants) {
        super(name);
        this.variants = [];
        this.variants = variants;
    }
    static fromJSON(json) {
        let variants = (json.variants || []).map((variant) => EnumVariantDefinition.fromJSON(variant));
        return new EnumType(json.name, variants);
    }
    getVariantByDiscriminant(discriminant) {
        let result = this.variants.find((e) => e.discriminant == discriminant);
        utils_1.guardValueIsSet(`variant by discriminant (${discriminant})`, result);
        return result;
    }
    getVariantByName(name) {
        let result = this.variants.find((e) => e.name == name);
        utils_1.guardValueIsSet(`variant by name (${name})`, result);
        return result;
    }
}
exports.EnumType = EnumType;
class EnumVariantDefinition {
    constructor(name, discriminant, fieldsDefinitions = []) {
        this.fieldsDefinitions = [];
        utils_1.guardTrue(discriminant < SimpleEnumMaxDiscriminant, `discriminant for simple enum should be less than ${SimpleEnumMaxDiscriminant}`);
        this.name = name;
        this.discriminant = discriminant;
        this.fieldsDefinitions = fieldsDefinitions;
    }
    static fromJSON(json) {
        let definitions = (json.fields || []).map((definition) => fields_1.FieldDefinition.fromJSON(definition));
        return new EnumVariantDefinition(json.name, json.discriminant, definitions);
    }
    getFieldsDefinitions() {
        return this.fieldsDefinitions;
    }
}
exports.EnumVariantDefinition = EnumVariantDefinition;
class EnumValue extends types_1.TypedValue {
    constructor(type, variant, fields) {
        super(type);
        this.fields = [];
        this.name = variant.name;
        this.discriminant = variant.discriminant;
        this.fields = fields;
        let definitions = variant.getFieldsDefinitions();
        fields_1.Fields.checkTyping(this.fields, definitions);
    }
    /**
     * Utility (named constructor) to create a simple (i.e. without fields) enum value.
     */
    static fromName(type, name) {
        let variant = type.getVariantByName(name);
        return new EnumValue(type, variant, []);
    }
    /**
     * Utility (named constructor) to create a simple (i.e. without fields) enum value.
     */
    static fromDiscriminant(type, discriminant) {
        let variant = type.getVariantByDiscriminant(discriminant);
        return new EnumValue(type, variant, []);
    }
    equals(other) {
        if (!this.getType().equals(other.getType())) {
            return false;
        }
        let selfFields = this.getFields();
        let otherFields = other.getFields();
        const nameIsSame = this.name == other.name;
        const discriminantIsSame = this.discriminant == other.discriminant;
        const fieldsAreSame = fields_1.Fields.equals(selfFields, otherFields);
        return nameIsSame && discriminantIsSame && fieldsAreSame;
    }
    getFields() {
        return this.fields;
    }
    valueOf() {
        let result = { name: this.name, fields: [] };
        this.fields.forEach((field) => (result.fields[field.name] = field.value.valueOf()));
        return result;
    }
}
exports.EnumValue = EnumValue;
//# sourceMappingURL=enum.js.map