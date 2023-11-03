import { Box, Input, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { ChangeEvent, useState } from "react";
import { SchemaToDataReturn } from "../utils/utils";
import InputWrapper from "./InputWrapper";
import { update } from "lodash";
import { v4 as uuidv4 } from 'uuid';

type ValueType = number | string;

const generateKey = (pre: string | number) => {
  return `${pre}_${new Date().getTime()}`;
};

type ArrayWrapperProps = {
    type: any
}

const ArrayWrapper = ({type}: ArrayWrapperProps) => {
  const [arrayItems, setArrayItems] = useState<ValueType[]>([]);

  const updateValue = (newValue: string) => {
    if(newValue){
        setArrayItems([...arrayItems, newValue]);
    }
  }

  return (
    <Box>
      {arrayItems.map((item) => (
        <Box key={uuidv4()} display="flex" alignItems="center">
          <Input w="100px" mr="10px" defaultValue={item}/>
          <CloseIcon cursor="pointer" />
        </Box>
      ))}
      <InputWrapper type={type} updateValue={updateValue} />
    </Box>
  );
};

export default ArrayWrapper;
