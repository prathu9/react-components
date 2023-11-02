import { Box, Input, Text } from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent, useState, useEffect } from "react";

const InputWrapper = ({ type, updateValue }: any) => {
  const [value, setValue] = useState<number | string>(type === "number"? 0:"");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
        handleUpdate();
    }
  }

  const handleUpdate = () => {
    updateValue(value);
  };

  return (
    <Box display="flex" alignItems="center">
      <Text>Value</Text>
      <Text mx="10px">:</Text>
      <Input
        type={type === "number"? "number":"text"}
        w="50%"
        value={value}
        onChange={handleChange}
        onBlur={handleUpdate}
        onKeyDown={handleKeyDown}
      />
    </Box>
  );
};

export default InputWrapper;
