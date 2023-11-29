import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Tag,
  TagLabel,
  Text,
  Button,
} from "@chakra-ui/react";
import { JSONSchema7, JSONSchema7Object } from "json-schema";
import { v4 as uuidv4 } from "uuid";
import Mapper from "../../mapper";
import ArrayWrapper from "../helper-ui/ArrayWrapper";
import ObjectWrapper from "../helper-ui/ObjectWrapper";
import { useContext, useEffect, useState } from "react";
import { JSONContext } from "../../JsonProvider";
import {produce} from "immer";

type ObjectComponentProps = {
  data: JSONSchema7Object;
  objectKeys?: string[];
  objectKey?: string;
  setEdit?: (isEditable: boolean) => void;
  handleItemDelete?: (index: number) => void;
};

const ObjectComponent = ({
  data,
  objectKeys = [],
  objectKey = "",
  setEdit,
}: ObjectComponentProps) => {
  const { editList, setEditList } = useContext(JSONContext)!;

  const edit = editList.find(item => item.id === objectKeys.join("/"));

  const properties = Object.keys(data.properties as {});

  const setAccordionIndex = (newAccordionIndex: number) => {
    setEditList(
      produce((state) => {
        if (objectKeys && objectKeys.length > 1) {
          const id: string = objectKeys.join("/") as string;
          const arrIndex = editList.findIndex((item) => item.id === id);
         console.log("accindex", arrIndex)
          if (arrIndex > -1) {
            state[arrIndex].accordionIndex = newAccordionIndex;
          } else {
            const editItem = {
              id,
              isEditable: false,
              accordionIndex: 0
            };

            state.push(editItem);
          }
        }
      })
    );
  }

  return (
    <Accordion index={edit?.accordionIndex} allowToggle>
      <AccordionItem px="0">
        {({ isExpanded }) => (
          <>
            <AccordionButton
              px="0"
              onClick={() => setAccordionIndex(edit?.accordionIndex === 0 ? -1 : 0)}
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
                <Text fontSize="15px">{isExpanded ? "Object" : "{...}"}</Text>
              </Box>
              {setEdit ? (
                <>
                  <Tag
                    mx="15px"
                    colorScheme="blue"
                    variant="outline"
                    aria-label="Done"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEdit(false)
                    }}
                  >
                    <TagLabel>Ok</TagLabel>
                  </Tag>
                </>
              ) : null}
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="0">
              <chakra.h1>properties:</chakra.h1>
              <Box>
                {properties.map((property) => {
                  const type = (
                    (data["properties"] as JSONSchema7Object)[
                      property
                    ] as JSONSchema7
                  )["type"];
                  return (
                    <Box key={uuidv4()} my="10px">
                      {type === "object" ? (
                        <ObjectWrapper
                          data={
                            (data["properties"] as JSONSchema7Object)[
                              property
                            ] as JSONSchema7
                          }
                          objectKey={property}
                          objectKeys={[...objectKeys, property]}
                        />
                      ) : (
                        <>
                          {type === "array" ? (
                            <ArrayWrapper
                              data={
                                (data["properties"] as JSONSchema7Object)[
                                  property
                                ] as JSONSchema7
                              }
                              objectKey={property}
                              objectKeys={[...objectKeys, property]}
                            />
                          ) : (
                            <Mapper
                              data={
                                (data["properties"] as JSONSchema7Object)[
                                  property
                                ] as JSONSchema7
                              }
                              objectKey={property}
                              objectKeys={[...objectKeys, property]}
                            />
                          )}
                        </>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default ObjectComponent;
