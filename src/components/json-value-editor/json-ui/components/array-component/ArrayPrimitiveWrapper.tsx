import InputWrapper from "../helper-ui/InputWrapper";
import { useState } from "react";
import { Box, Tag, TagLabel } from "@chakra-ui/react";
import PrimitiveValue from "../helper-ui/PrimitiveValue";
import BooleanValueWrapper from "../helper-ui/BooleanValueWrapper";

const ArrayPrimitiveWrapper = ({ type, value, handleArrayItemChange }: any) => {
  const [edit, setEdit] = useState<boolean>(false);

  const handleEdit = (edit: boolean) => {
    setEdit(edit);
  };

  if(type === "boolean"){
    return(
        <Box>
            {edit ? (
            <BooleanValueWrapper
                initialValue={value}
                updateValue={handleArrayItemChange}
                handleEdit={() => handleEdit(false)}
            />
            ) : (
            <PrimitiveValue value={value+""} handleEdit={() => handleEdit(true)} />
            )}
      </Box>
    )
  }

  if(type === "null"){
    return(
        <Box>
            <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
                <TagLabel>
                    Null
                </TagLabel>    
            </Tag>
        </Box>
    )
  }

  return (
    <>
      <Box>
        {edit ? (
          <InputWrapper
            type={type}
            initialValue={value}
            updateValue={handleArrayItemChange}
            handleEdit={() => handleEdit(false)}
          />
        ) : (
          <PrimitiveValue value={value+""} handleEdit={() => handleEdit(true)} />
        )}
      </Box>
    </>
  );
};

export default ArrayPrimitiveWrapper;
