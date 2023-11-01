import { JSONSchema7 } from "json-schema";
import React, { createContext, useEffect, useState } from "react";
import { type Updater, useImmer } from "use-immer";
import {schemaToData} from "./utils"

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
  value?: any,
  setValue?: () => void
};

type SchemaProviderProps = {
  jsonValue: JSONSchema7;
  setJsonValue: React.Dispatch<React.SetStateAction<JSONSchema7>>;
  children: React.ReactNode
}

export const SchemaContext = createContext<SchemaContextType | null>(null);

const SchemaProvider = ({ jsonValue, setJsonValue, children }: SchemaProviderProps) => {
  const [schema, setSchema] = useImmer<JSONSchema7>(jsonValue || {type: "string"});
  const [value, setValue] = useImmer(jsonValue? schemaToData(jsonValue):"");
  const [uniqueKey, setUniqueKey] = useState(0);

  useEffect(() => {
    setJsonValue(schema);
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
