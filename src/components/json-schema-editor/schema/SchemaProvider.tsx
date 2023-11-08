import { JSONSchema7 } from "json-schema";
import React, { createContext, useEffect, useState } from "react";
import { type Updater, useImmer } from "use-immer";

const initialSchema = {
  type: "object",
  properties: {
    cars: {
      type: "array",
      items: {
        type: "object",
        properties: {
          electric: {
            type: "string",
          },
        },
      },
    },
  },
  required: ["cars", "bmw"],
} as JSONSchema7;

export type SchemaContextType = {
  schema: JSONSchema7;
  setSchema: Updater<JSONSchema7>;
  uniqueKey: number;
  setUniqueKey: React.Dispatch<React.SetStateAction<number>>;
};

type SchemaProviderProps = {
  jsonSchema: JSONSchema7;
  setJsonSchemaValue: React.Dispatch<React.SetStateAction<JSONSchema7>>;
  children: React.ReactNode,
}

export const SchemaContext = createContext<SchemaContextType | null>(null);

const SchemaProvider = ({ jsonSchema, setJsonSchemaValue, children }: SchemaProviderProps) => {
  const [schema, setSchema] = useImmer<JSONSchema7>(jsonSchema || {type: "string"});
  const [uniqueKey, setUniqueKey] = useState(0);

  useEffect(() => {
    setJsonSchemaValue(schema);
  }, [schema]);

  return (
    <SchemaContext.Provider
      value={{ schema, setSchema, uniqueKey, setUniqueKey }}
    >
      {children}
    </SchemaContext.Provider>
  );
};

export default SchemaProvider;
