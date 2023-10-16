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
} from "@chakra-ui/react";

import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { ChangeEvent, useContext, MouseEvent, useMemo, useEffect } from "react";

import Mapper from "./mapper";
import { SchemaContext } from "./SchemaProvider";

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
  const children = properties !== undefined
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
        delete currObj["properties"]
        currObj["items"] = {
          type: "string",
        };
      }
      else{
        delete currObj["properties"]
      }
    });
  };

  const handleDelete = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      for(let i = 1; i < objectKeys.length - 1; i++){
        const key = objectKeys[i];
        if (currObj[key] == null || typeof currObj[key] !== 'object') {
          return; // Property doesn't exist or is not an object
        }
        currObj = currObj[key as string];
      }

      const lastKey = objectKeys[objectKeys.length - 1];

      if (currObj.hasOwnProperty(lastKey)) {
        delete currObj[lastKey];
      }
      
    })
  }

  const addProperty = (e: MouseEvent<SVGElement>) => {

    e.preventDefault();
    e.stopPropagation();

    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      for(let i = 1; i < objectKeys.length - 1; i++){
        const key = objectKeys[i];
        console.log("keys", key)
        if(currObj[key] == null || typeof currObj[key] !== 'object'){
          return;
        }
        currObj = currObj[key as string];
      }

      const lastKey = objectKeys[objectKeys.length - 1];
      console.log("lastkey", Object.keys(currObj[lastKey]), lastKey)

      // const newKey = `field_${uniqueKey}`;
      // if(draftSchema.properties){
      //   draftSchema.properties[newKey] = {
      //     type: "string"
      //   } 
      // }
      // setUniqueKey(prev => prev + 1)
    })
  }

  return (
    <Accordion w="100%" allowToggle>
      <AccordionItem>
        <AccordionButton px="0" display="flex" justifyContent="space-between">
          <Box w="80%" display="flex" alignItems="center">
            {objectKey.length !== 0 ? (
              <>
                <Input
                  value={objectKey}
                  flex="1"
                  mr="5px"
                  placeholder="key"
                  onChange={() => {}}
                />{" "}
                :
              </>
            ) : null}
            <Select
              defaultValue="object"
              onChange={handleTypeChange}
              flex="2"
              mx="5px"
              placeholder="select type"
              w="70%"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="object">Object</option>
              <option value="array">Array</option>
              {/*boolean, null*/}
            </Select>
            <AddIcon ml="8px" boxSize={5} onClick={addProperty}/>
            {
              objectKeys[objectKeys.length - 1] !== "items"?
                <DeleteIcon ml="8px" boxSize={5} onClick={handleDelete}/>
              :null
            }
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel px="0">
          <Box>
            <chakra.h2>Properties:</chakra.h2>
            {
              children.length !== 0 ? 
              <>
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
              </>:
              <AddIcon mx="8px" my="10px" boxSize={5}/>
            }
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ObjectSchema;
