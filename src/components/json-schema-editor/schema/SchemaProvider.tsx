import { JSONSchema7 } from "json-schema";
import  React, { createContext, useState, useEffect } from 'react'

import {type Updater, useImmer} from "use-immer"


const initialSchema = {
    type: "object",
    properties: {
      cars: {
        type: "array",
        items: {
              type: "object",
              properties: {
                electric: {
                  type: "string"
                }
              }
        }
      },
    },
    required: ["cars", "bmw"]
  } as JSONSchema7

export type SchemaContextType = {
    schema: JSONSchema7,
    setSchema: Updater<JSONSchema7> 
    uniqueKey: number,
    setUniqueKey: React.Dispatch<React.SetStateAction<number>>
}

export const SchemaContext = createContext<SchemaContextType | null>(null);

const SchemaProvider = ({value, setValue, children}: any) => {
    const [schema, setSchema] = useImmer<JSONSchema7>(value);
    const [uniqueKey, setUniqueKey] = useState(0);

    useEffect(() => {
      setValue(schema);
    },[schema])

    return(
        <SchemaContext.Provider value={{schema, setSchema, uniqueKey, setUniqueKey}}>
            {children}
        </SchemaContext.Provider>
    )
}

export default SchemaProvider;