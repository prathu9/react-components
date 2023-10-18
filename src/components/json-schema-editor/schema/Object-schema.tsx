import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  chakra,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Select,
  Input,
  AccordionIcon,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import {
  ChangeEvent,
  useContext,
  MouseEvent,
  useMemo,
  useEffect,
  useState,
} from "react";
import SelectType from "./SelectType";

import Mapper from "./mapper";
import { SchemaContext } from "./SchemaProvider";
import KeyInput from "./KeyInput";

type ObjectSchemaType = {
  properties:
    | {
        [key: string]: JSONSchema7Definition;
      }
    | undefined;
  objectKey: string;
  objectKeys?: string[];
};

const ObjectSchema = ({
  properties,
  objectKey,
  objectKeys = [],
}: ObjectSchemaType) => {
  const children =
    properties !== undefined
      ? Object.keys(properties).map((key) => ({ key, data: properties[key] }))
      : [];

  const { setSchema, uniqueKey, setUniqueKey } = useContext(SchemaContext)!;

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      const newType = e.target.value;
      for (let i = 1; i < objectKeys.length; i++) {
        currObj = currObj[objectKeys[i] as string];
      }

      currObj["type"] = newType;

      if (newType === "array") {
        delete currObj["properties"];
        currObj["items"] = {
          type: "string",
        };
      } else {
        delete currObj["properties"];
      }
    });
  };

  const handleDelete = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      for (let i = 1; i < objectKeys.length - 1; i++) {
        const key = objectKeys[i];
        if (currObj[key] == null || typeof currObj[key] !== "object") {
          return; // Property doesn't exist or is not an object
        }
        currObj = currObj[key as string];
      }

      const lastKey = objectKeys[objectKeys.length - 1];

      if (currObj.hasOwnProperty(lastKey)) {
        delete currObj[lastKey];
      }
    });
  };

  const addProperty = (e: MouseEvent<SVGElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      for (let i = 1; i < objectKeys.length - 1; i++) {
        const key = objectKeys[i];
        console.log("keys", key);
        if (currObj[key] == null || typeof currObj[key] !== "object") {
          return;
        }
        currObj = currObj[key as string];
      }

      const lastKey = objectKeys[objectKeys.length - 1];

      const newKey = `field_${uniqueKey}`;
      if (draftSchema.properties) {
        currObj[lastKey].properties[newKey] = {
          type: "string",
        };
      }
      setUniqueKey((prev) => prev + 1);
    });
  };

  return (
    <Accordion w="100%" allowToggle>
      <AccordionItem>
        <AccordionButton px="0" display="flex" justifyContent="space-between">
          <Box w="80%" display="flex" alignItems="center">
            {objectKey.length !== 0 ? (
              <>
                <KeyInput
                  flex="1"
                  mr="5px"
                  value={objectKey}
                  objectKeys={objectKeys}
                />{" "}
                :
              </>
            ) : null}
            <SelectType
              flex="2"
              w="70%"
              mx="5px"
              value="object"
              onChange={handleTypeChange}
            />
            {objectKeys[objectKeys.length - 1] !== "items" ? (
              <DeleteIcon ml="8px" boxSize={5} onClick={handleDelete} />
            ) : null}
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel px="0">
          <Box>
            <chakra.h2>Properties:</chakra.h2>
            {children.map((child) => {
              return (
                <Box
                  my="5px"
                  key={child.key}
                  display="flex"
                  gap="2"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {/* <Input flex="1" defaultValue={child.key} /> */}
                  <Box flex="2" display="flex" alignItems="center">
                    <Mapper
                      objectKeys={[...objectKeys, "properties", child.key]}
                      objectKey={child.key}
                      data={child.data as JSONSchema7}
                    />
                  </Box>
                </Box>
              );
            })}
            <Box my="20px" display="flex" alignItems="center">
              <Tooltip hasArrow label="Add child" placement="top">
                <AddIcon
                  cursor="pointer"
                  mx="8px"
                  my="10px"
                  boxSize={4}
                  onClick={addProperty}
                />
              </Tooltip>
              <Text fontSize="lg" as="i">
                Add More Properties
              </Text>
            </Box>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ObjectSchema;
