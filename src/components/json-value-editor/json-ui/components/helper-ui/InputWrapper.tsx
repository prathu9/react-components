import { Box, Input, Button, Text } from "@chakra-ui/react";
import { CloseIcon } from "@saas-ui/react";
import { ChangeEvent, KeyboardEvent, useState } from "react";

type InputWrapperProps = {
  type: string | number;
  updateValue: (newValue: any) => void;
  handleEdit?: () => void;
  initialValue?: string | number;
  showValueTag?: boolean;
};

const InputWrapper = ({
  type,
  updateValue,
  handleEdit,
  initialValue,
  showValueTag,
}: InputWrapperProps) => {
  const [value, setValue] = useState(initialValue? initialValue+"": "");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleUpdate();
    }
  };

  const handleUpdate = () => {
    if (value.trim().length < 1) {
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
      {showValueTag ? (
        <>
          <Text>Value</Text>
          <Text mx="10px">:</Text>
        </>
      ) : null}
      <Input
        type={type === "number" ? "number" : "text"}
        w="50%"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Button title="Add" mx="5px" py="5px" colorScheme="blue" variant="outline" onClick={handleUpdate}>
        Add
      </Button>
      <Button title="Cancel" onClick={handleEdit} variant="outline">
        <CloseIcon />
      </Button>
    </Box>
  );
};

export default InputWrapper;
