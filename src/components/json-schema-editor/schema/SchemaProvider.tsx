import { JSONSchema7 } from "json-schema";
import  React, { createContext, useState } from 'react'

import {type Updater, useImmer} from "use-immer"

// const initialSchema = {
//     type: "object",
//     properties: {},
// } as JSONSchema7

// user: {
//   type: "object",
//   properties: {
//     name: {
//       type: "string",
//     },
//     age: {
//       type: "object",
//       properties: {
//         date: {
//           type: "string"
//         }
//       }
//     }
//   },
// },

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
  } as JSONSchema7

export type SchemaContextType = {
    schema: JSONSchema7,
    setSchema: Updater<JSONSchema7> // React.Dispatch<React.SetStateAction<JSONSchema7>>,
    uniqueKey: number,
    setUniqueKey: React.Dispatch<React.SetStateAction<number>>
}

export const SchemaContext = createContext<SchemaContextType | null>(null);

const SchemaProvider = ({children}: any) => {
    const [schema, setSchema] = useImmer<JSONSchema7>(initialSchema);
    const [uniqueKey, setUniqueKey] = useState(0);

    return(
        <SchemaContext.Provider value={{schema, setSchema, uniqueKey, setUniqueKey}}>
            {children}
        </SchemaContext.Provider>
    )
}

export default SchemaProvider;