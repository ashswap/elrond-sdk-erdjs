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
exports.TypeMapper = void 0;
const errors = __importStar(require("../../errors"));
const address_1 = require("./address");
const boolean_1 = require("./boolean");
const bytes_1 = require("./bytes");
const composite_1 = require("./composite");
const enum_1 = require("./enum");
const generic_1 = require("./generic");
const h256_1 = require("./h256");
const numerical_1 = require("./numerical");
const struct_1 = require("./struct");
const fields_1 = require("./fields");
const tokenIdentifier_1 = require("./tokenIdentifier");
const variadic_1 = require("./variadic");
const algebraic_1 = require("./algebraic");
const genericArray_1 = require("./genericArray");
const string_1 = require("./string");
const tuple_1 = require("./tuple");
const codeMetadata_1 = require("./codeMetadata");
const nothing_1 = require("./nothing");
class TypeMapper {
    constructor(customTypes = []) {
        this.openTypesFactories = new Map([
            ["Option", (...typeParameters) => new generic_1.OptionType(typeParameters[0])],
            ["List", (...typeParameters) => new generic_1.ListType(typeParameters[0])],
            // For the following open generics, we use a slightly different typing than the one defined by elrond-wasm-rs (temporary workaround).
            ["VarArgs", (...typeParameters) => new variadic_1.VariadicType(typeParameters[0])],
            ["MultiResultVec", (...typeParameters) => new variadic_1.VariadicType(typeParameters[0])],
            ["variadic", (...typeParameters) => new variadic_1.VariadicType(typeParameters[0])],
            ["OptionalArg", (...typeParameters) => new algebraic_1.OptionalType(typeParameters[0])],
            ["optional", (...typeParameters) => new algebraic_1.OptionalType(typeParameters[0])],
            ["OptionalResult", (...typeParameters) => new algebraic_1.OptionalType(typeParameters[0])],
            ["multi", (...typeParameters) => new composite_1.CompositeType(...typeParameters)],
            ["MultiArg", (...typeParameters) => new composite_1.CompositeType(...typeParameters)],
            ["MultiResult", (...typeParameters) => new composite_1.CompositeType(...typeParameters)],
            ["multi", (...typeParameters) => new composite_1.CompositeType(...typeParameters)],
            // Perhaps we can adjust the ABI generator to only output "tuple", instead of "tupleN"?
            ["tuple", (...typeParameters) => new tuple_1.TupleType(...typeParameters)],
            ["tuple2", (...typeParameters) => new tuple_1.TupleType(...typeParameters)],
            ["tuple3", (...typeParameters) => new tuple_1.TupleType(...typeParameters)],
            ["tuple4", (...typeParameters) => new tuple_1.TupleType(...typeParameters)],
            ["tuple5", (...typeParameters) => new tuple_1.TupleType(...typeParameters)],
            ["tuple6", (...typeParameters) => new tuple_1.TupleType(...typeParameters)],
            ["tuple7", (...typeParameters) => new tuple_1.TupleType(...typeParameters)],
            ["tuple8", (...typeParameters) => new tuple_1.TupleType(...typeParameters)],
            // Known-length arrays.
            // TODO: Handle these in typeExpressionParser, perhaps?
            ["array20", (...typeParameters) => new genericArray_1.ArrayVecType(20, typeParameters[0])],
            ["array32", (...typeParameters) => new genericArray_1.ArrayVecType(32, typeParameters[0])],
            ["array64", (...typeParameters) => new genericArray_1.ArrayVecType(64, typeParameters[0])],
        ]);
        // For closed types, we hold actual type instances instead of type constructors / factories (no type parameters needed).
        this.closedTypesMap = new Map([
            ["u8", new numerical_1.U8Type()],
            ["u16", new numerical_1.U16Type()],
            ["u32", new numerical_1.U32Type()],
            ["u64", new numerical_1.U64Type()],
            ["U64", new numerical_1.U64Type()],
            ["BigUint", new numerical_1.BigUIntType()],
            ["i8", new numerical_1.I8Type()],
            ["i16", new numerical_1.I16Type()],
            ["i32", new numerical_1.I32Type()],
            ["i64", new numerical_1.I64Type()],
            ["Bigint", new numerical_1.BigIntType()],
            ["BigInt", new numerical_1.BigIntType()],
            ["bool", new boolean_1.BooleanType()],
            ["bytes", new bytes_1.BytesType()],
            ["Address", new address_1.AddressType()],
            ["H256", new h256_1.H256Type()],
            ["utf-8 string", new string_1.StringType()],
            ["TokenIdentifier", new tokenIdentifier_1.TokenIdentifierType()],
            ["CodeMetadata", new codeMetadata_1.CodeMetadataType()],
            ["nothing", new nothing_1.NothingType()],
            ["AsyncCall", new nothing_1.NothingType()]
        ]);
        for (const customType of customTypes) {
            this.closedTypesMap.set(customType.getName(), customType);
        }
    }
    mapRecursiveType(type) {
        let isGeneric = type.isGenericType();
        if (type instanceof enum_1.EnumType) {
            // This will call mapType() recursively, for all the enum variant fields.
            return this.mapEnumType(type);
        }
        if (type instanceof struct_1.StructType) {
            // This will call mapType() recursively, for all the struct's fields.
            return this.mapStructType(type);
        }
        if (isGeneric) {
            // This will call mapType() recursively, for all the type parameters.
            return this.mapGenericType(type);
        }
        return null;
    }
    mapType(type) {
        var _a;
        let mappedType = this.mapRecursiveType(type);
        if (mappedType !== null) {
            return mappedType;
        }
        let knownClosedType = this.closedTypesMap.get(type.getName());
        if (!knownClosedType) {
            throw new errors.ErrTypingSystem(`Cannot map the type "${type.getName()}" to a known type`);
        }
        return (_a = this.mapRecursiveType(knownClosedType)) !== null && _a !== void 0 ? _a : knownClosedType;
    }
    feedCustomType(type) {
        this.closedTypesMap.delete(type.getName());
        this.closedTypesMap.set(type.getName(), type);
    }
    mapStructType(type) {
        let mappedFields = this.mappedFields(type.getFieldsDefinitions());
        let mappedStruct = new struct_1.StructType(type.getName(), mappedFields);
        return mappedStruct;
    }
    mapEnumType(type) {
        let variants = type.variants.map((variant) => new enum_1.EnumVariantDefinition(variant.name, variant.discriminant, this.mappedFields(variant.getFieldsDefinitions())));
        let mappedEnum = new enum_1.EnumType(type.getName(), variants);
        return mappedEnum;
    }
    mappedFields(definitions) {
        return definitions.map((definition) => new fields_1.FieldDefinition(definition.name, definition.description, this.mapType(definition.type)));
    }
    mapGenericType(type) {
        let typeParameters = type.getTypeParameters();
        let mappedTypeParameters = typeParameters.map((item) => this.mapType(item));
        let factory = this.openTypesFactories.get(type.getName());
        if (!factory) {
            throw new errors.ErrTypingSystem(`Cannot map the generic type "${type.getName()}" to a known type`);
        }
        return factory(...mappedTypeParameters);
    }
}
exports.TypeMapper = TypeMapper;
//# sourceMappingURL=typeMapper.js.map