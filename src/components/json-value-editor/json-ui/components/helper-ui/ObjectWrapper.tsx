import {
  Box,
  Button,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
} from "@chakra-ui/react";
import { useState, ReactNode, useRef, useEffect } from "react";
import Mapper from "../../mapper";
import { EditIcon } from "@chakra-ui/icons";
import { DeleteIcon } from "@chakra-ui/icons";
import { JSONSchema7 } from "json-schema";
import useStore from "../../store/store";


type ObjectWrapperProps = {
  data: JSONSchema7,
  objectKey?: string,
  objectKeys?: string[],
  deleteBtn?: ReactNode
}

const ObjectWrapper = ({ data, objectKey, objectKeys, deleteBtn }: ObjectWrapperProps) => {
  // const [edit, setEdit] = useState(false);
  const edit = useStore(state => state.edit.find(item => item.id === objectKeys?.join("/")));
  const setEdit = useStore(state => state.setEdit);

  const setEditValue = (isEditable: boolean) => {
    setEdit(objectKeys?.join("/")!, isEditable);
  }

  return (
    <>
      {edit ? (
        <Box display="flex">
          <Box w="100%" position="relative">
            <Mapper
              data={data}
              objectKey={objectKey}
              objectKeys={objectKeys}
              setEdit={setEditValue}
            />
          </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="center">
          {objectKey ? (
            <>
              <Tag px="10px" py="5px" height="28px" colorScheme="blue" variant="outline">
                <TagLabel fontSize="15px">{objectKey}</TagLabel>
              </Tag>
              <Text mx="10px">:</Text>
            </>
          ) : null}
          <Box>
            <Tag px="10px" py="5px" height="28px" colorScheme="blue" variant="outline">
              <TagLabel>Object</TagLabel>
              <TagRightIcon
                as={EditIcon}
                cursor="pointer"
                onClick={() => {setEditValue(true)}}
              />
            </Tag>
            {deleteBtn}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ObjectWrapper;
