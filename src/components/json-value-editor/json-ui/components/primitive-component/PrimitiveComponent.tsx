import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Box, Tag, TagRightIcon, TagLabel, Text } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useState, useEffect, useContext, memo, useRef } from "react";

import InputWrapper from "../helper-ui/InputWrapper";
import BooleanValueWrapper from "../helper-ui/BooleanValueWrapper";
import { JSONContext } from "../../JsonProvider";
import { PrimitiveType, ObjectType } from "../../type";
import { Draft } from "immer";

type PrimitiveComponentProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
};

const getInitialValue = (objectKeys: string[]) => {
  const {value} = useContext(JSONContext)!;

 if(value && typeof value === "object"){
    let obj = value;
    for(let i = 1; i < objectKeys.length; i++){
      const key = objectKeys[i];
      const value = obj[key];
      if(value && typeof value === "object" && !Array.isArray(value)){
        obj = value;
      }
    }
    const lastKey = objectKeys[objectKeys.length - 1]
    return obj[lastKey];
  }
  else if(Array.isArray(value)){
    return value
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
  // console.log("initialvalue", currObj)
  
  // const [primitiveValue, setPrimitiveValue] = useState<
  //   string | number | null | boolean
  // >(getInitialPrimitiveValue(data.type));

  // useEffect(() => {
  //   setPrimitiveValue(getInitialPrimitiveValue(data.type));
  // }, [data.type]);

  const updateValue = (newValue: string | number | boolean) => {
    // setPrimitiveValue(newValue);
    console.log(objectKeys)
    setValue((draftValue) => {
      if(typeof draftValue !== "object"){
        draftValue = newValue;
        return draftValue;
      }
      else if(Array.isArray(draftValue)){
        console.log("root", draftValue[0])
      }
      else if(typeof draftValue === "object"){
        let currObj = draftValue!;

        for(let i = 1; i < objectKeys.length; i++){
            const key = objectKeys[i];
            const value = currObj[key];
            if(value && typeof value === "object" && !Array.isArray(value)){
              currObj = value;
            }
        }

        const lastKey = objectKeys[objectKeys.length - 1];
        currObj[lastKey] = newValue;
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
