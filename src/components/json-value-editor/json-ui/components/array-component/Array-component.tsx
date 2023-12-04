import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Input,
  Tag,
  TagLabel,
  Text,
  Button,
  IconButton,
} from "@chakra-ui/react";
import ArrayItems from "./ArrayItems";
import { useCallback, useContext, useEffect } from "react";
import ArrayObjectWrapper from "./ArrayObjectWrapper";
import ArrayArrayWrapper from "./ArrayArrayWrapper";
import { JSONContext } from "../../JsonProvider";
import { produce } from "immer";
import ArrayProvider from "./ArrayProvider";
import { ObjectType } from "../../type";

type ArrayComponentDataType = JSONSchema7TypeName | JSONSchema7TypeName[];

type ArrayComponentProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
  setEdit?: (isEditable: boolean) => void;
};

const ArrayComponent = ({
  data,
  objectKeys = [],
  objectKey = "",
  setEdit,
}: ArrayComponentProps) => {
  if (data.items === undefined) {
    return <chakra.h1>items does not exist</chakra.h1>;
  }

  const { editList, setEditList, setValue } = useContext(JSONContext)!;

  const edit = editList.find((item) => item.id === objectKeys.join("/"));

  const setAccordionIndex = (newAccordionIndex: number) => {
    setEditList(
      produce((state) => {
        if (objectKeys) {
          const id: string = objectKeys.join("/") as string;
          const arrIndex = editList.findIndex((item) => item.id === id);

          if (arrIndex > -1) {
            state[arrIndex].accordionIndex = newAccordionIndex;
          } else {
            const editItem = {
              id,
              isEditable: false,
              accordionIndex: 0,
            };

            state.push(editItem);
          }
        }
      })
    );
  };

  const updateArrayValues = (newValue: any, index?: number) => {
    console.log("new", newValue)
    // console.log("o", objectKeys)
      setValue((draftValue) => {
        const lastKey = objectKeys[objectKeys.length - 1];
        if (Array.isArray(draftValue)) {
          // console.log("d",JSON.stringify(draftValue))
          if (Array.isArray(draftValue[0]) && !isNaN(parseInt(lastKey))) {
            draftValue[parseInt(lastKey)] = newValue;
          } else {
            draftValue = newValue;
          }
          return draftValue;
        } else if (typeof draftValue === "object") {
          let currObj = draftValue!;

          let tempValue;
          for(let i = 1; i < objectKeys.length; i++){
            const key = objectKeys[i];
          
            if(!isNaN(parseInt(key))){
              //console.log("loop", key, tempValue, currObj[parseInt(key)], JSON.stringify(currObj))
              tempValue = currObj[parseInt(key)];
            }
            else{
              //console.log("loop", key, tempValue, (currObj as ObjectType)[key], JSON.stringify(currObj))
              tempValue = (currObj as ObjectType)[key];
            }
      
            if((objectKeys[i] !== lastKey && Array.isArray(tempValue)) 
              ||  (typeof tempValue === "object" && !Array.isArray(tempValue)) ){
              currObj = tempValue as ObjectType;
            }  
            
          }
          
          console.log("obj to change", JSON.stringify(currObj))
          if(Array.isArray(currObj) && !isNaN(parseInt(lastKey))){
            currObj[lastKey] = newValue;
          }
          else{
            currObj[lastKey] = newValue;
          }
          
        }
      });
  }


  return (
    <Accordion index={edit?.accordionIndex} w="100%" allowToggle>
      <AccordionItem px="0">
        {({ isExpanded }) => (
          <>
            <AccordionButton
              px="0"
              onClick={() =>
                setAccordionIndex(edit?.accordionIndex === 0 ? -1 : 0)
              }
            >
              <Box display="flex" flex="1" textAlign="left" alignItems="center">
                {objectKey ? (
                  <>
                    <Tag
                      px="10px"
                      py="5px"
                      colorScheme="blue"
                      variant="outline"
                    >
                      <TagLabel fontSize="15px">{objectKey}</TagLabel>
                    </Tag>
                    <Text mx="10px">:</Text>
                  </>
                ) : null}
                <Text fontSize="15px">{isExpanded ? "Array" : "[...]"}</Text>
              </Box>
              {setEdit ? (
                <Tag
                  mx="15px"
                  colorScheme="blue"
                  variant="outline"
                  aria-label="Done"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEdit(false);
                  }}
                >
                  <TagLabel>Ok</TagLabel>
                </Tag>
              ) : null}
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="0">
              <ArrayProvider
                type={(data.items as JSONSchema7).type!}
                objectKeys={objectKeys}
              >
                {(data.items as JSONSchema7).type === "string" ? (
                  <ArrayItems
                    itemType="string"
                    updateValue={updateArrayValues}
                    objectKeys={objectKeys}
                  />
                ) : null}
                {(data.items as JSONSchema7).type === "number" ? (
                  <ArrayItems
                    itemType="number"
                    updateValue={updateArrayValues}
                    objectKeys={objectKeys}
                  />
                ) : null}
                {(data.items as JSONSchema7).type === "boolean" ? (
                  <ArrayItems
                    itemType="boolean"
                    updateValue={updateArrayValues}
                    objectKeys={objectKeys}
                  />
                ) : null}
                {(data.items as JSONSchema7).type === "null" ? (
                  <ArrayItems
                    itemType="null"
                    updateValue={updateArrayValues}
                    objectKeys={objectKeys}
                  />
                ) : null}
                {(data.items as JSONSchema7).type === "object" ? (
                  <ArrayObjectWrapper
                    data={data.items as JSONSchema7}
                    updateValue={updateArrayValues}
                    objectKeys={[...objectKeys]}
                  />
                ) : null}
                {(data.items as JSONSchema7).type === "array" ? (
                  <ArrayArrayWrapper
                    data={data.items as JSONSchema7}
                    updateValue={updateArrayValues}
                    objectKeys={[...objectKeys]}
                  />
                ) : null}
              </ArrayProvider>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default ArrayComponent;
