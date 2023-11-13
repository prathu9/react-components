export type PrimitiveType = number | string | boolean | null;

export interface ObjectType {
  [key: string]: ObjectType | PrimitiveType | PrimitiveType[] | ObjectType[]
}

export type DataType = PrimitiveType | PrimitiveType[] | ObjectType