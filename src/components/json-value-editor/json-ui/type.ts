export type PrimitiveType = number | string | boolean | null;

export interface ObjectType {
  [key: string]: ObjectType | PrimitiveType | ArrayType
}

export type PrimitiveArrayType = PrimitiveType[];
export type ObjectArrayType = ObjectType[];
export type NestedArrayType = ArrayType[];

export type ArrayType = PrimitiveArrayType | ObjectArrayType | NestedArrayType;

export type JSONType = PrimitiveType | ObjectType | ArrayType

export type EditType = {
  id: string,
  isEditable: boolean,
  accordionIndex: number
}

export type JSType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
