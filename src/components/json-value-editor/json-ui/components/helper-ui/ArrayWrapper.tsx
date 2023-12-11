import {
  Box,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState, ReactNode, useContext, useEffect, memo } from "react";
import Mapper from "../../mapper";
import { EditIcon } from "@chakra-ui/icons";
import { JSONSchema7 } from "json-schema";
import { JSONContext } from "../../JsonProvider";
import {produce} from "immer";

type ArrayWrapperProps = {
  data: JSONSchema7,
  objectKey?: string,
  objectKeys?: string[],
  deleteBtn?: ReactNode
}

const ArrayWrapper = ({ data, objectKey, objectKeys, deleteBtn }: ArrayWrapperProps) => {

  const {editList, setEditList} = useContext(JSONContext)!;

  const edit = editList.find(item => item.id === objectKeys?.join("/"))

  // useEffect(() => {
  //   console.log("check")
  //     }, [])

  const setEdit = (isEditable: boolean) => {
    setEditList(
      produce(state => {
        if (objectKeys) {
          const id: string = objectKeys.join("/") as string;
         
          if(isEditable){
            const editItem = {
              id,
              isEditable,
              accordionIndex: -1
            };

            state.push(editItem);
          }
          else{
            return state.filter(item => item.id !== id);
          }
        }
      })
    )
  }

  return (
    <>
      {edit?.isEditable ? (
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
