import { Input, InputProps } from "@chakra-ui/react"
import { ChangeEvent, useContext } from "react";

import { SchemaContext } from "./SchemaProvider";

type KeyInputType = {
    value: string,
    objectKeys: string[],
} & InputProps

const KeyInput = ({value, objectKeys, ...props}: KeyInputType) => {
    const { setSchema } = useContext(SchemaContext)!;

    // console.log(value, objectKeys)

    const handleKeyUpdate = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("check")

        setSchema((draftSchema) => {
          let currObj = draftSchema as any;
          for(let i = 0; i < objectKeys.length; i++){
            const key = objectKeys[i];
            if (currObj[key] == null || typeof currObj[key] !== "object") {
              return;
            }
            currObj = currObj[key as string];
          }
    
          console.log(Object.keys(currObj))
    
        })
    
      }


    return (
        <Input
            value={value}
            placeholder="key"
            onChange={handleKeyUpdate}
            {...props}
        />
    )
}

export default KeyInput