export type PrimitiveType = number | string | boolean | null;

export interface ObjectType {
  [key: string]: ObjectType | PrimitiveType | PrimitiveType[] | ObjectType[]
}

export type ArrayType = (PrimitiveType | ArrayType | ObjectType)[];

export type DataType = PrimitiveType | ObjectType | ArrayType

export type EditType = {
  id: string,
  isEditable: boolean,
  accordionIndex: number
}

export type JSType = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
