import { Box, Input, Button, Text } from "@chakra-ui/react";
import {ChangeEvent, KeyboardEvent, useState} from "react";

const InputWrapper = ({type, updateValue}: any) => {
 const [value, setValue] = useState("");

 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
 }
 const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdate();
    }
  };

 const handleUpdate = () => {
    if(value.trim().length < 1){
      return;
    }

    if (type === "number") {
      const newValue = parseInt(value);
      if (!Number.isNaN(newValue)) {
        updateValue(newValue);
      }
    } else if (type === "string") {
      updateValue(value);
    }
  };

  return (
    <Box display="flex" alignItems="center">
    <Text>Value</Text>
    <Text mx="10px">:</Text>
    <Input
      type={type === "number" ? "number" : "text"}
      w="50%"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
    <Button mx="5px" py="18px" colorScheme="blue" onClick={handleUpdate}>
      Add
    </Button>
  </Box>
  );
};

export default InputWrapper;
