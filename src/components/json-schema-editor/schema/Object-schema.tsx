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
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { JSONSchema7 } from "json-schema";
import { ChangeEvent, MouseEvent, useContext, useState } from "react";

import KeyInput from "./KeyInput";
import Mapper from "./mapper";
import { SchemaContext } from "./SchemaProvider";
import SelectType from "./SelectType";
import {
  checkIsPropertyRequired,
  deleteProperty,
  handleRequiredCheckBox,
} from "./utils";

type ObjectSchemaType = {
  data: JSONSchema7;
  objectKey: string;
  objectKeys?: string[];
  requiredProperties?: string[];
};

const ObjectSchema = ({
  data,
  objectKey,
  objectKeys = [],
  requiredProperties,
}: ObjectSchemaType) => {
  console.log("data", data);
  const children =
    data.properties !== undefined
      ? Object.keys(data.properties).map((key) => ({
          key,
          data: data.properties![key],
        }))
      : [];

  const { setSchema, uniqueKey, setUniqueKey } = useContext(SchemaContext)!;

  const [isPropertyRequired, setIsPropertyRequired] = useState(
    checkIsPropertyRequired(objectKey, requiredProperties),
  );

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      const newType = e.target.value;
      for (let i = 1; i < objectKeys.length; i++) {
        currObj = currObj[objectKeys[i] as string];
      }
      if(newType === "group"){
        delete currObj["type"];
        delete currObj["properties"];
        currObj["anyof"] = [
          {
            type: "string"
          }
        ];
      }
      else{
        currObj["type"] = newType;

        if (newType === "array") {
          delete currObj["properties"];
          currObj["items"] = {
            type: "string",
          };
        } else {
          delete currObj["properties"];
        }
      }
    });
  };

  const handleDelete = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    deleteProperty(objectKeys, setSchema);
  };

  const addProperty = (e: MouseEvent<SVGElement>) => {
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

      const newKey = `field_${uniqueKey}`;
      
      if (draftSchema.properties) {
        currObj[lastKey].properties[newKey] = {
          type: "string",
        };
      }
      setUniqueKey((prev) => prev + 1);
    });
  };
console.log(objectKeys)
  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    setIsPropertyRequired(e.target.checked);
    handleRequiredCheckBox(e.target.checked, objectKeys, setSchema);
  };
console.log("object",objectKey)
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
          <>
            {objectKeys[objectKeys.length - 2] === "properties" ? (
              <Tooltip label="required" hasArrow placement="top">
                <Box ml="8px" display="flex">
                  <Checkbox
                    isChecked={isPropertyRequired}
                    colorScheme="blue"
                    onChange={handleCheckBox}
                  />
                </Box>
              </Tooltip>
            ) : null}
            <DeleteIcon ml="8px" boxSize={5} onClick={handleDelete} />
          </>
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
                      requiredProperties={
                        data.hasOwnProperty("required")
                          ? data.required
                          : undefined
                      }
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
