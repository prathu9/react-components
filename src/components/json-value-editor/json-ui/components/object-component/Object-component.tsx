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
import { Dispatch } from "react";

type ObjectComponentProps = {
  data: JSONSchema7Object;
  objectKeys?: string[];
  objectKey?: string;
  setEdit?: (editState: boolean) => void;
  handleItemDelete?: (index: number) => void;
};

const ObjectComponent = ({
  data,
  objectKeys = [],
  objectKey = "",
  setEdit,
}: ObjectComponentProps) => {
  const properties = Object.keys(data.properties as {});

  return (
    <Accordion allowToggle>
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
                <Text fontSize="15px">{isExpanded ? "Object" : "{...}"}</Text>
              </Box>
              {setEdit ? (
                <>
                  <Tag
                    mx="15px"
                    colorScheme="blue"
                    variant="outline"
                    aria-label="Done"
                    onClick={() => setEdit(false)}
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
