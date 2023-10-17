import { useContext, ChangeEvent, MouseEvent, useState } from "react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { SchemaContext, SchemaContextType } from "./SchemaProvider";
import Mapper from "./mapper";
import { JSONSchema7 } from "json-schema";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  chakra,
  Input,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";

const SchemaJson = () => {
  const { schema, setSchema, uniqueKey, setUniqueKey } = useContext(
    SchemaContext
  ) as SchemaContextType;

  const data = schema || { type: "string" };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setSchema((draftSchema) => {
      const newType = e.target.value as any;
      draftSchema.type = newType;

      if (newType === "object") {
        draftSchema.properties = {
          field: {
            type: "string",
          },
        };
      }

      if (newType === "array") {
        draftSchema.items = {
          type: "string",
        };
      }
    });
  };

  const addProperty = (e: MouseEvent<SVGElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setSchema((draftSchema) => {
      const newKey = `field_${uniqueKey}`;
      if (draftSchema.properties) {
        draftSchema.properties[newKey] = {
          type: "string",
        };
      }
      setUniqueKey((prev) => prev + 1);
    });
  };

  if (data.type !== "object" && data.type !== "array") {
    return (
      <Box w="80%" display="flex" alignItems="center">
        <Select
          value="string"
          w="80%"
          onChange={handleTypeChange}
          placeholder="select type"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
          {/*boolean, null*/}
        </Select>
        <AddIcon ml="8px" boxSize={5} />
        <DeleteIcon ml="8px" boxSize={5} />
      </Box>
    );
  }

  if (data.type === "array") {
    return (
      <Accordion w="100%" allowToggle>
        <AccordionItem>
          <AccordionButton display="flex" justifyContent="space-between">
            <Box w="80%" display="flex" alignItems="center">
              <Select
                value="array"
                onChange={handleTypeChange}
                placeholder="select type"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
                {/*boolean, null*/}
              </Select>
              <AddIcon ml="8px" boxSize={5} />
              <DeleteIcon ml="8px" boxSize={5} />
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Box>
              <chakra.h2>Items:</chakra.h2>
              <Box
                display="flex"
                gap="2"
                justifyContent="space-between"
                alignItems="center"
              >
                <Mapper
                  objectKey=""
                  objectKeys={["root", "items"]}
                  data={data.items as JSONSchema7}
                />
              </Box>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }

  const properties = data.properties || {};

  const children =
    properties !== undefined
      ? Object.keys(properties).map((key) => ({ key, data: properties[key] }))
      : [];

  return (
    <>
      <Accordion w="100%" allowToggle>
        <AccordionItem>
          <AccordionButton display="flex" justifyContent="space-between">
            <Box w="80%" display="flex" alignItems="center">
              <Select
                value="object"
                onChange={handleTypeChange}
                onClick={(e: MouseEvent<HTMLSelectElement>) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                placeholder="select type"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
                {/*boolean, null*/}
              </Select>
              <DeleteIcon ml="8px" boxSize={5} />
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
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
                    <Mapper
                      objectKeys={["root", "properties", child.key]}
                      objectKey={child.key}
                      data={child.data as JSONSchema7}
                    />
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
    </>
  );
};

export default SchemaJson;
