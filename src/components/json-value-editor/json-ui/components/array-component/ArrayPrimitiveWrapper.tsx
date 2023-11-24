import InputWrapper from "../helper-ui/InputWrapper";
import { useState, useContext } from "react";
import { Box, Tag, TagLabel } from "@chakra-ui/react";
import BooleanValueWrapper from "../helper-ui/BooleanValueWrapper";
import { PrimitiveType, DataType } from "../../type";

const ArrayPrimitiveWrapper = ({ type, value, handleArrayItemChange }: any) => {
  // const [arrayItems, setArrayItems] = useState<DataType[]>([]);

  // const updateArrayItems = (newValue: PrimitiveType) => {
  //   if (type !== "boolean" && newValue) {
  //     const newArray = [...arrayItems, newValue];
  //     setArrayItems(newArray);
  //     // updateValue(newArray);
  //   } else if (type === "boolean") {
  //     const newArray = [...arrayItems, newValue];
  //     setArrayItems(newArray);
  //     // updateValue(newArray);
  //   } else if (type === "null") {
  //     const newArray = [...arrayItems, newValue];
  //     setArrayItems(newArray);
  //     // updateValue(newArray);
  //   }
  // };

  if (type === "boolean") {
    return (
      <BooleanValueWrapper
        initialValue={value}
        updateValue={handleArrayItemChange}
      />
    );
  }

  if (type === "null") {
    return (
      <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
        <TagLabel>Null</TagLabel>
      </Tag>
    );
  }

  return (
    <>
      <InputWrapper
        type={type}
        initialValue={value}
        updateValue={handleArrayItemChange}
      />
    </>
  );
};

export default ArrayPrimitiveWrapper;
