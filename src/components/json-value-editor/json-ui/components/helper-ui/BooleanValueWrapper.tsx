import {
  Box,
  Radio,
  RadioGroup,
  Button,
  Tag,
  TagLabel,
  TagRightIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";

type BooleanValueWrapperProp = {
  initialValue: boolean;
  updateValue: (newValue: boolean) => void;
  handleEdit?: () => void;
};

const BooleanValueWrapper = ({
  initialValue,
  updateValue,
}: BooleanValueWrapperProp) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [value, setValue] = useState<string>(
    initialValue === true ? "true" : "false"
  );

  useEffect(() => {
    console.log("boolean", initialValue);
    setValue(initialValue === true ? "true" : "false");
  }, [initialValue]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  const handleUpdate = () => {
    const newValue = value === "true" ? true : false;

    updateValue(newValue);
    setEdit(false);
  };

  return (
    <>
      {edit ? (
        <Box display="flex" alignItems="center">
          <RadioGroup value={value} onChange={handleChange}>
            <Radio
              value="true"
              size="lg"
              mr="10px"
              colorScheme="blue"
              border="1px solid cyan"
            >
              true
            </Radio>
            <Radio
              value="false"
              size="lg"
              colorScheme="blue"
              border="1px solid cyan"
            >
              false
            </Radio>
          </RadioGroup>
          <Button
            mx="5px"
            py="5px"
            onClick={handleUpdate}
            colorScheme="blue"
            variant="outline"
          >
            Add
          </Button>
          <Button title="Cancel" onClick={() => setEdit(false)} variant="outline">
            <CloseIcon />
          </Button>
        </Box>
      ) : (
        <Box>
          <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
            <TagLabel fontSize="15px">{value}</TagLabel>
            <TagRightIcon as={EditIcon} cursor="pointer" onClick={() => setEdit(true)} />
          </Tag>
        </Box>
      )}
    </>
  );
};

export default BooleanValueWrapper;
