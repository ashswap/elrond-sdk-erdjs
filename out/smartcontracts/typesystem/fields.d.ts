import { Type, TypedValue } from "./types";
export declare class FieldDefinition {
    readonly name: string;
    readonly description: string;
    readonly type: Type;
    constructor(name: string, description: string, type: Type);
    static fromJSON(json: {
        name: string;
        description: string;
        type: string;
    }): FieldDefinition;
}
export declare class Field {
    readonly value: TypedValue;
    readonly name: string;
    constructor(value: TypedValue, name?: string);
    checkTyping(expectedDefinition: FieldDefinition): void;
    equals(other: Field): boolean;
}
export declare class Fields {
    static checkTyping(fields: Field[], definitions: FieldDefinition[]): void;
    static equals(actual: ReadonlyArray<Field>, expected: ReadonlyArray<Field>): boolean;
}
