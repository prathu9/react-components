import { JSONSchema7 } from "json-schema";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Checkbox,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import KeyInput from "./KeyInput";
import SelectType from "./SelectType";
import { ChangeEvent, MouseEvent, useContext } from "react";
import { SchemaContext } from "./SchemaProvider";
import Mapper from "./mapper";

type GroupSchemaProps = {
  objectKey: string;
  data: JSONSchema7;
  objectKeys?: string[];
};

type ContraintType = "anyOf" | "allOf" | "not" | "oneOf";

const GroupSchema = ({
  objectKey,
  data,
  objectKeys = [],
}: GroupSchemaProps) => {
  // console.log("multischema", objectKey, data);
  const { setSchema } = useContext(SchemaContext)!;
  const constraint: ContraintType = Object.keys(data)[0] as ContraintType;
  const subSchema: JSONSchema7[] = data[constraint] as JSONSchema7[];

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      const newType = e.target.value;
      for (let i = 1; i < objectKeys.length; i++) {
        currObj = currObj[objectKeys[i] as string];
      }

      delete currObj[Object.keys(currObj)[0]];
      currObj["type"] = newType;

      if (newType === "array") {
        currObj["items"] = {
          type: "string",
        };
      } else if(newType === "object") {
        currObj["properties"] = {
          field: {
            type: "string",
          },
        };
      }
    });
  };

  const handleConstraintChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      const newConstraint = e.target.value;
      for (let i = 1; i < objectKeys.length; i++) {
        currObj = currObj[objectKeys[i] as string];
      }

      currObj[newConstraint] = currObj[constraint];
      delete currObj[constraint];
    });
  };

  const addNewSubSchema = (e: MouseEvent<SVGElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      for (let i = 1; i < objectKeys.length - 1; i++) {
        const key = objectKeys[i];

        if (currObj[key] == null || typeof currObj[key] !== "object") {
          return;
        }
        currObj = currObj[key as string];
      }

      const lastKey = objectKeys[objectKeys.length - 1];
      const constraint = Object.keys(currObj[lastKey])[0];
      
      currObj[lastKey][constraint].push({
        type: "string"
      })
    });
  }

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
              value="group"
              onChange={handleTypeChange}
            />
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel px="0">
          <Box>
            <Select
              w="120px"
              mb="10px"
              value={constraint}
              onChange={handleConstraintChange}
            >
              <option value="allOf">allOf</option>
              <option value="oneOf">oneOf</option>
              <option value="anyOf">anyOf</option>
              <option value="not">not</option>
            </Select>
            <chakra.h3>Subschema:</chakra.h3>
            {subSchema.map((item: JSONSchema7, i: number) => {
              return (
                <Box key={i} my="8px">
                  <Mapper
                    objectKeys={[...objectKeys, constraint, `${i}`]}
                    objectKey=""
                    data={item}
                  />
                </Box>
              );
            })}
          </Box>
          <Box my="20px" display="flex" alignItems="center">
              <Tooltip hasArrow label="Add SubSchema" placement="top">
                <AddIcon
                  cursor="pointer"
                  mx="8px"
                  my="10px"
                  boxSize={4}
                  onClick={addNewSubSchema}
                />
              </Tooltip>
              <Text fontSize="lg" as="i">
                Add New SubSchema
              </Text>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default GroupSchema;
