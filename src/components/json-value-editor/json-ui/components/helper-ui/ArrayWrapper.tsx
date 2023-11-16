import {
  Box,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState, ReactNode } from "react";
import Mapper from "../../mapper";
import { EditIcon } from "@chakra-ui/icons";
import { JSONSchema7 } from "json-schema";

type ArrayWrapperProps = {
  data: JSONSchema7,
  objectKey?: string,
  objectKeys?: string[],
  deleteBtn?: ReactNode
}

const ArrayWrapper = ({ data, objectKey, objectKeys, deleteBtn }: ArrayWrapperProps) => {
  const [edit, setEdit] = useState(false);
  return (
    <>
      {edit ? (
        <Box display="flex">
          <Box w="100%" position="relative">
            <Mapper
              data={data}
              objectKey={objectKey}
              objectKeys={objectKeys}
              setEdit={setEdit}
            />
          </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="center">
          {objectKey ? (
            <>
              <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
                <TagLabel fontSize="15px">{objectKey}</TagLabel>
              </Tag>
              <Text mx="10px">:</Text>
            </>
          ) : null}
          <Box>
            <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
              <TagLabel fontSize="15px">Array</TagLabel>
              <TagRightIcon
                as={EditIcon}
                cursor="pointer"
                onClick={() => setEdit(true)}
              />
            </Tag>
            {deleteBtn}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ArrayWrapper;
