import { Input, InputProps } from "@chakra-ui/react"
import { FocusEvent, ChangeEvent, KeyboardEvent, useContext, useState, useCallback } from "react";

import { SchemaContext } from "./SchemaProvider";

import { JSONSchema7 } from "json-schema";

type KeyInputType = {
    value: string,
    objectKeys: string[],
} & InputProps

const KeyInput = ({value, objectKeys, ...props}: KeyInputType) => {
    const { setSchema } = useContext(SchemaContext)!;
    const [inputValue, setInputValue] = useState(value);

    const updateSchema = useCallback(() => {
        setSchema((draftSchema) => {
            let currObj = draftSchema as any;
            let objToChange;
            
            for(let i = 1; i < objectKeys.length - 1; i++){
              const key = objectKeys[i];
              if (currObj[key] == null || typeof currObj[key] !== "object") {
                return;
              }
  
              if(i === objectKeys.length-2){
                  objToChange = currObj;
              }
              currObj = currObj[key as string];
            }
  
            const remainingKeys = Object.keys(currObj);
            const newKey = inputValue;
            const lastKey = objectKeys[objectKeys.length - 1];
  
            objToChange.properties = remainingKeys.reduce((acc: Record<string, any>, val) => {
              if(val === lastKey){
                  acc[newKey] = currObj[lastKey];
              }
              else{
                  acc[val] = currObj[val]
              }
  
              return acc;
            }, {})
        })
    }, [setSchema, objectKeys, inputValue])

    const handleKeyUpdate = (e: FocusEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("changed")
        updateSchema();
      }

      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        
        if(newValue.length > 10){
            return;
        }
        setInputValue(newValue);
      } 

      const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            updateSchema();
        }
      }

    return (
        <Input
            value={inputValue}
            placeholder="key"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleKeyUpdate}
            {...props}
        />
    )
}

export default KeyInput