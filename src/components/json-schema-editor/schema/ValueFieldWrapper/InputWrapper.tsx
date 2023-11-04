import { Box, Input, Text } from "@chakra-ui/react";
import { ChangeEvent, KeyboardEvent, useState } from "react";

type InputWrapperProps = {
  type: "string" | "number";
  updateValue: (newValue: any) => void;
};

const InputWrapper = ({ type, updateValue }: InputWrapperProps) => {
  const [value, setValue] = useState<string>("");
  const [keyPressed, setKeyPressed] = useState(false); // To avoid keydown and onblur from running simultaneously

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdate();
      setKeyPressed(true);
    }
  };

  const handleUpdate = () => {
    if (keyPressed) {
      setKeyPressed(false);
    } else {
      if (type === "number") {
        const newValue = parseInt(value);
        if (!Number.isNaN(newValue)) {
          updateValue(newValue);
        }
      } else if (type === "string") {
        updateValue(value);
      }
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
        onBlur={handleUpdate}
        onKeyDown={handleKeyDown}
      />
    </Box>
  );
};

export default InputWrapper;
