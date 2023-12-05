import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Box, Tag, TagRightIcon, TagLabel, Text } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useState, useEffect, useContext, memo, useRef } from "react";
import { Draft } from 'immer';

import InputWrapper from "../helper-ui/InputWrapper";
import BooleanValueWrapper from "../helper-ui/BooleanValueWrapper";
import { JSONContext } from "../../JsonProvider";
import { PrimitiveType, ObjectType, JSONType } from "../../type";

type PrimitiveComponentProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
};

const getInitialValue = (objectKeys: string[]) => {
  const {value} = useContext(JSONContext)!;
// console.log("O",objectKeys)
  if(Array.isArray(value)){
    return value;
  }
 else if(value && typeof value === "object"){
    let obj = value as ObjectType;
    let tempValue;
    for(let i = 1; i < objectKeys.length; i++){
      const key = objectKeys[i];
    
      if(!isNaN(parseInt(key))){
        // console.log("loop", key, tempValue, obj[parseInt(key)], JSON.stringify(obj))
        tempValue = obj[parseInt(key)];
      }
      else{
        // console.log("loop", key, tempValue, (obj as ObjectType)[key], JSON.stringify(obj))
        tempValue = (obj as ObjectType)[key];
      }
      if(tempValue && typeof tempValue === "object"){
        obj = tempValue as ObjectType;
      }
    }

    const lastKey = objectKeys[objectKeys.length - 1];
    return (obj as ObjectType)[lastKey];
  }
  else{
    return value;
  }
}

const getInitialPrimitiveValue = (
  type: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined
) => {
  if (type === "string") {
    return "string";
  } else if (type === "number") {
    return 0;
  } else if (type === "boolean") {
    return false;
  } else {
    return null;
  }
};


const PrimitiveComponent = memo(({
  data,
  objectKeys=[],
  objectKey,
}: PrimitiveComponentProps) => {
  const { setValue } = useContext(JSONContext)!;

  const initialValue = getInitialValue(objectKeys) || getInitialPrimitiveValue(data.type);
 
  const updateValue = (newValue: string | number | boolean) => {
    setValue((draftValue: Draft<JSONType>) => {
      if(typeof draftValue !== "object"){
        draftValue = newValue;
        return draftValue;
      }
      else if(Array.isArray(draftValue)){
        console.log("root", draftValue[0])
      }
      else if(typeof draftValue === "object"){
        let currObj= draftValue!;
        let value;
        for(let i = 1; i < objectKeys.length; i++){
            const key = objectKeys[i];
            // console.log("c", key, JSON.stringify(value), JSON.stringify(currObj))
            if(!isNaN(parseInt(key)) && Array.isArray(currObj)){
              value = (currObj as PrimitiveType[])[parseInt(key)];
            }
            else{
              value = (currObj as ObjectType)[key];
            }
          
            if(value && typeof value === "object" && !Array.isArray(currObj)){
              currObj = value as ObjectType;
            }
        }

        const lastKey = objectKeys[objectKeys.length - 1];
        (currObj as ObjectType)[lastKey] = newValue;
      }
      else{
        console.log(JSON.stringify(draftValue))
      }
    });
  };

  if (data.type === "boolean") {
    return (
      <Box display="flex" alignItems="center">
        {objectKey ? (
          <>
            <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
              <TagLabel fontSize="15px">{objectKey}</TagLabel>
            </Tag>
            <Text mx="10px">:</Text>
          </>
        ) : null}
        <Box>
          <BooleanValueWrapper
            initialValue={initialValue as boolean}
            updateValue={updateValue}
          />
        </Box>
      </Box>
    );
  }

  if (data.type === "null") {
    return (
      <Box display="flex" alignItems="center">
        {objectKey ? (
          <>
            <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
              <TagLabel fontSize="15px">{objectKey}</TagLabel>
            </Tag>
            <Text mx="10px">:</Text>
          </>
        ) : null}
        <Tag
          px="10px"
          py="5px"
          colorScheme="blue"
          variant="outline"
          fontSize="15px"
        >
          Null
        </Tag>
      </Box>
    );
  }

  return (
    <Box display="flex" alignItems="center">
      {objectKey ? (
        <>
          <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
            <TagLabel fontSize="15px">{objectKey}</TagLabel>
          </Tag>
          <Text mx="10px">:</Text>
        </>
      ) : null}
      <Box>
        <InputWrapper
          type={data.type as string | number}
          updateValue={updateValue}
          initialValue={initialValue as string | number}
        />
      </Box>
    </Box>
  );
});

export default PrimitiveComponent;
