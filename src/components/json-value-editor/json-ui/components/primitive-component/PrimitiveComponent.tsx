import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import { Box, Tag, TagRightIcon, TagLabel, Text } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

import InputWrapper from "../helper-ui/InputWrapper";
import BooleanValueWrapper from "../helper-ui/BooleanValueWrapper";

type PrimitiveComponentProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
};

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

const PrimitiveComponent = ({
  data,
  objectKeys = [],
  objectKey = "",
}: PrimitiveComponentProps) => {
  const [primitiveValue, setPrimitiveValue] = useState<
    string | number | null | boolean
  >(getInitialPrimitiveValue(data.type));

  useEffect(() => {
    setPrimitiveValue(getInitialPrimitiveValue(data.type));
  }, [data.type]);

  const updateValue = (newValue: string | number | boolean) => {
    console.log(newValue);
    setPrimitiveValue(newValue);
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
            initialValue={primitiveValue as boolean}
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
          initialValue={primitiveValue as string | number}
        />
      </Box>
    </Box>
  );
};

export default PrimitiveComponent;
