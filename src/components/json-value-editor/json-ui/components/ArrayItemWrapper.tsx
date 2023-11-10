import { Box, Input, Text, Button } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";

import { useState } from "react";

import { CloseIcon } from "@chakra-ui/icons";

type ArrayItemWrapperProp = {
  itemValue: any;
  itemIndex: number;
  handleItemChange: (newValue: any, index: number) => void;
  handleItemDelete: (itemIndex: number) => void;
};

const ArrayItemWrapper = ({
  itemValue,
  itemIndex,
  handleItemChange,
  handleItemDelete
}: ArrayItemWrapperProp) => {
  const [value, setValue] = useState(itemValue);
  const [keyPressed, setKeyPressed] = useState(false);

  const handleArrayItemChange = (newValue: string) => {
    setValue(newValue);
    setKeyPressed(false);
  };

  return (
    <>
      <Input
        w="120px"
        mx="5px"
        onChange={(e) => handleArrayItemChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value) {
            handleItemChange(value, itemIndex);
          }
        }}
        onBlur={() => {
            if(!keyPressed && value){
                handleItemChange(value, itemIndex);
            }
            else{
                setKeyPressed(false);
            }
        }}
        value={value}
      />
      <Button mx="5px" p="8px" colorScheme="blue" onClick={() => handleItemDelete(itemIndex)}>
        <CloseIcon cursor="pointer" />
      </Button>
    </>
  );
};

export default ArrayItemWrapper;
