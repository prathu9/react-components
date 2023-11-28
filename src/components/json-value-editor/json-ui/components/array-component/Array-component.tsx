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
import { ChangeEvent, useState, Dispatch, useContext } from "react";
import Mapper from "../../mapper";
import ArrayObjectWrapper from "./ArrayObjectWrapper";
import ArrayArrayWrapper from "./ArrayArrayWrapper";
import { JSONContext } from "../../JsonProvider";

type ArrayComponentDataType = JSONSchema7TypeName | JSONSchema7TypeName[];

type ArrayComponentProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
  setEdit?: Dispatch<React.SetStateAction<boolean>>;
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

  const {setValue} = useContext(JSONContext)!;

  const updateArrayValues = (newValue: any) => {
    setValue((draftValue) => {
      const lastKey = objectKeys[objectKeys.length - 1];
      if(Array.isArray(draftValue)){
        // console.log("d",JSON.stringify(draftValue))
        if(Array.isArray(draftValue[0]) && !isNaN(parseInt(lastKey))){
            draftValue[parseInt(lastKey)] = newValue;
        }
        else{
          draftValue = newValue;
        }
        return draftValue;
      }
      else if(typeof draftValue === "object"){
        let currObj = draftValue!;

        for(let i = 1; i < objectKeys.length; i++){
            const key = objectKeys[i];
            const value = currObj[key];
            if(value && typeof value === "object" && !Array.isArray(value)){
              currObj = value;
            }
        }
        currObj[lastKey] = newValue;
      }
    });
  };

  return (
    <Accordion w="100%" allowToggle>
      <AccordionItem px="0">
        {({ isExpanded }) => (
          <>
            <AccordionButton px="0">
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
                  onClick={() => setEdit(false)}
                >
                  <TagLabel>Ok</TagLabel>
                </Tag>
              ) : null}
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="0">
              {(data.items as JSONSchema7).type === "string" ? (
                <ArrayItems itemType="string" updateValue={updateArrayValues} objectKeys={objectKeys} />
              ) : null}
              {(data.items as JSONSchema7).type === "number" ? (
                <ArrayItems itemType="number" updateValue={updateArrayValues} objectKeys={objectKeys}/>
              ) : null}
              {(data.items as JSONSchema7).type === "boolean" ? (
                <ArrayItems
                  itemType="boolean"
                  updateValue={updateArrayValues}
                  objectKeys={objectKeys}
                />
              ) : null}
              {(data.items as JSONSchema7).type === "null" ? (
                <ArrayItems itemType="null" updateValue={updateArrayValues} objectKeys={objectKeys} />
              ) : null}
              {(data.items as JSONSchema7).type === "object" ? (
                <ArrayObjectWrapper
                  data={data.items as JSONSchema7}
                  updateValue={updateArrayValues}
                  objectKeys={[...objectKeys, "items"]}
                />
              ) : null}
              {
                (data.items as JSONSchema7).type === "array" ? (
                  <ArrayArrayWrapper 
                    data={data.items as JSONSchema7}
                    updateValue={updateArrayValues}
                    objectKeys={[...objectKeys, "items"]}
                  />
                ):null
              }
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default ArrayComponent;
