import { Box, Input, Text, Button } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import ArrayPrimitiveWrapper from "./ArrayPrimitiveWrapper";

import { ChangeEvent, useState } from "react";

import { CloseIcon, DeleteIcon } from "@chakra-ui/icons";

type ArrayItemWrapperProp = {
  itemType: any;
  itemValue: any;
  itemIndex: number;
  handleItemChange: (newValue: any, index: number) => void;
  handleItemDelete: (itemIndex: number) => void;
};

const ArrayItemWrapper = ({
  itemType,
  itemValue,
  itemIndex,
  handleItemChange,
  handleItemDelete,
}: ArrayItemWrapperProp) => {
  const [value, setValue] = useState(itemValue);

  const handleArrayItemChange = (newValue: string) => {
    setValue(newValue);
    handleItemChange(newValue, itemIndex);
  };

  return (
    <>
      <ArrayPrimitiveWrapper
        type={itemType}
        value={value}
        handleArrayItemChange={handleArrayItemChange}
      />
    </>
  );
};

export default ArrayItemWrapper;
