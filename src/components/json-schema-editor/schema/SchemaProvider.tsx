import { JSONSchema7 } from "json-schema";
import React, { createContext, useEffect, useState } from "react";
import { type Updater, useImmer } from "use-immer";
import {schemaToData, SchemaToDataReturn} from "./utils/utils"

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
  jsonValue?: any,
  setJsonValue: Updater<SchemaToDataReturn>
};

type SchemaProviderProps = {
  jsonSchema: JSONSchema7;
  setJsonSchemaValue: React.Dispatch<React.SetStateAction<JSONSchema7>>;
  children: React.ReactNode,
  setValue: React.Dispatch<React.SetStateAction<SchemaToDataReturn>>;
}

export const SchemaContext = createContext<SchemaContextType | null>(null);

const SchemaProvider = ({ jsonSchema, setJsonSchemaValue,setValue, children }: SchemaProviderProps) => {
  const [schema, setSchema] = useImmer<JSONSchema7>(jsonSchema || {type: "string"});
  const [jsonValue, setJsonValue] = useImmer<SchemaToDataReturn>(schemaToData(jsonSchema));
  const [uniqueKey, setUniqueKey] = useState(0);

  useEffect(() => {
    setJsonSchemaValue(schema);
  }, [schema]);

  useEffect(() => {
    console.log("v", jsonValue)
    setValue(jsonValue);
  }, [jsonValue])

  return (
    <SchemaContext.Provider
      value={{ setJsonValue, schema, setSchema, uniqueKey, setUniqueKey }}
    >
      {children}
    </SchemaContext.Provider>
  );
};

export default SchemaProvider;
