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

import { useContext, ChangeEvent, MouseEvent } from "react";
import { SchemaContext } from "./SchemaProvider";
import { JSONSchema7Definition } from "json-schema";

import Mapper from "./mapper";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

type ObjectSchemaType = {
  items: JSONSchema7Definition | JSONSchema7Definition[] | undefined;
  objectKey: string;
  objectKeys?: string[];
};

const ArraySchema = ({ items, objectKey, objectKeys = [] }: any) => {
  const { setSchema } = useContext(SchemaContext)!;

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      for (let i = 1; i < objectKeys.length; i++) {
        currObj = currObj[objectKeys[i] as string];
      }

      const newType = e.target.value;

      currObj["type"] = newType;

      if (newType === "object") {
        currObj["properties"] = {
          field: {
            type: "string",
          },
        };
      } else if (newType === "array") {
        currObj["items"] = {
          type: "string",
        };
      }
    });
  };

  const handleDelete = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    // setSchema((draftSchema) => {
    //   let currObj = draftSchema as any;
    //   for(let i = 1; i < objectKeys.length - 1; i++){
    //     const key = objectKeys[i];
    //     // if (currObj[key] == null || typeof currObj[key] !== 'object') {
    //     //   return; // Property doesn't exist or is not an object
    //     // }
    //     console.log("key", key)
    //     // currObj = currObj[key as string];
    //   }

    //   // const lastKey = objectKeys[objectKeys.length - 1];

    //   // if (currObj.hasOwnProperty(lastKey)) {
    //   //   delete currObj[lastKey];
    //   // }
      
    // })
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
              flex="2"
              value="array"
              mx="5px"
              onChange={handleTypeChange}
              placeholder="select type"
              w="70%"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="object">Object</option>
              <option value="array">Array</option>
              {/*boolean, null*/}
            </Select>
            <AddIcon ml="8px" boxSize={5}/>
            <DeleteIcon ml="8px" boxSize={5} onClick={handleDelete} />
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel px="0">
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
                data={items}
                objectKeys={[...objectKeys, "items"]}
              />
            </Box>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ArraySchema;
