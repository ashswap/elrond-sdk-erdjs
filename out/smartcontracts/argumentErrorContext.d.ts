import { EndpointParameterDefinition, Type } from ".";
export declare class ArgumentErrorContext {
    endpointName: string;
    argumentIndex: string;
    parameterDefinition: EndpointParameterDefinition;
    constructor(endpointName: string, argumentIndex: string, parameterDefinition: EndpointParameterDefinition);
    throwError(specificError: string): never;
    convertError(native: any, typeName: string): never;
    unhandledType(functionName: string, type: Type): never;
    guardSameLength<T>(native: any[], valueTypes: T[]): void;
    guardHasField(native: any, fieldName: string): void;
}
