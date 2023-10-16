import { Box, Select, Input } from "@chakra-ui/react";
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";
import { ChangeEvent,MouseEventHandler,MouseEvent, useContext } from "react";
import { SchemaContext } from "./SchemaProvider";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

type OtherSchemaType = {
  type: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
  objectKey: string;
  objectKeys?: string[];
};

const OtherSchema = ({ type, objectKey, objectKeys = [] }: OtherSchemaType) => {
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
              type: "string"
            }
        }
      } else if (newType === "array") {
        currObj["items"] = {
          type: "string",
        };
      }
    });
  };

  const handleDelete = (e: MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      
      for(let i = 1; i < objectKeys.length - 1; i++){
        const key = objectKeys[i];
        console.log("obj key", key)
        // if (currObj[key] == null || typeof currObj[key] !== 'object') {
        //   return; // Property doesn't exist or is not an object
        // }
        // currObj = currObj[key as string];
      }

      const lastKey = objectKeys[objectKeys.length - 1];

      if (currObj.hasOwnProperty(lastKey)) {
        delete currObj[lastKey];
      }
      
    })
  }

  return (
    <>
      <Box w="80%" display="flex" alignItems="center">
        {objectKey && objectKey.length !== 0 ? (
          <>
            <Input flex="1" mr="5px" defaultValue={objectKey} />:
          </>
        ) : null}
        <Select
          w={objectKey.length !==0 ? "50%":"70%"}
          flex="2"
          ml="5px"
          value={type}
          onChange={handleTypeChange}
          placeholder="select type"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
          {/*boolean, null*/}
        </Select>
        {objectKeys[objectKeys.length -1] === "items"? null:
          <>
            <AddIcon ml="8px" boxSize={5}/>
        
            <DeleteIcon ml="8px" boxSize={5} onClick={handleDelete} />
          </>  
        }
      </Box>
    </>
  );
};

export default OtherSchema;
