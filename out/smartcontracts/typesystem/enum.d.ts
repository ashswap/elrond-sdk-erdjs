import { Field, FieldDefinition } from "./fields";
import { CustomType, TypedValue } from "./types";
export declare class EnumType extends CustomType {
    readonly variants: EnumVariantDefinition[];
    constructor(name: string, variants: EnumVariantDefinition[]);
    static fromJSON(json: {
        name: string;
        variants: any[];
    }): EnumType;
    getVariantByDiscriminant(discriminant: number): EnumVariantDefinition;
    getVariantByName(name: string): EnumVariantDefinition;
}
export declare class EnumVariantDefinition {
    readonly name: string;
    readonly discriminant: number;
    private readonly fieldsDefinitions;
    constructor(name: string, discriminant: number, fieldsDefinitions?: FieldDefinition[]);
    static fromJSON(json: {
        name: string;
        discriminant: number;
        fields: any[];
    }): EnumVariantDefinition;
    getFieldsDefinitions(): FieldDefinition[];
}
export declare class EnumValue extends TypedValue {
    readonly name: string;
    readonly discriminant: number;
    private readonly fields;
    constructor(type: EnumType, variant: EnumVariantDefinition, fields: Field[]);
    /**
     * Utility (named constructor) to create a simple (i.e. without fields) enum value.
     */
    static fromName(type: EnumType, name: string): EnumValue;
    /**
     * Utility (named constructor) to create a simple (i.e. without fields) enum value.
     */
    static fromDiscriminant(type: EnumType, discriminant: number): EnumValue;
    equals(other: EnumValue): boolean;
    getFields(): ReadonlyArray<Field>;
    valueOf(): any;
}
