import {
  Box,
  Input,
  Button,
  Text,
  Tag,
  TagLabel,
  TagRightIcon,
} from "@chakra-ui/react";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { ChangeEvent, KeyboardEvent, useState, memo, useEffect } from "react";

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
  initialValue,
  showValueTag,
}: InputWrapperProps) => {
  const [value, setValue] = useState(initialValue+"");
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(() => {
    setValue(initialValue+"");
  }, [initialValue])

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

    setEdit(false);
  };

  return (
    <>
      {edit ? (
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
          <Button
            ml="10px"
            title="Add"
            colorScheme="blue"
            variant="outline"
            onClick={handleUpdate}
          >
            Add
          </Button>
          <Button
            title="Cancel"
            onClick={() => setEdit(false)}
            variant="outline"
          >
            <CloseIcon />
          </Button>
        </Box>
      ) : (
        <Box>
          <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
            <TagLabel fontSize="15px">{value}</TagLabel>
            <TagRightIcon
              as={EditIcon}
              cursor="pointer"
              onClick={() => setEdit(true)}
            />
          </Tag>
        </Box>
      )}
    </>
  );
};

export default InputWrapper;
