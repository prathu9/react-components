import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import {
  Box,
  Button,
  Input,
  Text,
  Tag,
  TagRightIcon,
  TagLabel,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

import InputWrapper from "./InputWrapper";
import BooleanValueWrapper from "./BooleanValueWrapper";

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
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    setPrimitiveValue(getInitialPrimitiveValue(data.type));
  }, [data.type]);

  const updateValue = (newValue: string | number | boolean) => {
    console.log(newValue);
    setPrimitiveValue(newValue);
    setEdit(false);
  };

  const handleEdit = () => {
    setEdit(true);
  };

  if (data.type === "boolean") {
    return (
      <Box>
        {edit ? (
          <BooleanValueWrapper initialValue={primitiveValue as boolean} updateValue={updateValue} />
        ) : (
          <Box display="flex" alignItems="center">
            <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
              <TagLabel fontSize="20px">{primitiveValue+""}</TagLabel>
              <TagRightIcon
                as={EditIcon}
                cursor="pointer"
                onClick={handleEdit}
              />
            </Tag>
          </Box>
        )}
      </Box>
    );
  }

  if (data.type === "null") {
    return <Tag px="10px" py="5px" colorScheme="blue" variant="outline" fontSize="20px">Null</Tag>;
  }

  return (
    <Box>
      {edit ? (
        <InputWrapper type={data.type} updateValue={updateValue} />
      ) : (
        <Box display="flex" alignItems="center">
          <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
            <TagLabel fontSize="20px">{primitiveValue}</TagLabel>
            <TagRightIcon as={EditIcon} cursor="pointer" onClick={handleEdit} />
          </Tag>
        </Box>
      )}
    </Box>
  );
};

export default PrimitiveComponent;
