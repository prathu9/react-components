import InputWrapper from "../helper-ui/InputWrapper";
import { useState, useContext } from "react";
import { Box, Tag, TagLabel } from "@chakra-ui/react";
import BooleanValueWrapper from "../helper-ui/BooleanValueWrapper";

const ArrayPrimitiveWrapper = ({ type, value, handleArrayItemChange }: any) => {

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
