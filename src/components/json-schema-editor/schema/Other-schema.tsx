import { Box, Tooltip } from "@chakra-ui/react";
import {
  JSONSchema7TypeName,
} from "json-schema";
import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import { SchemaContext } from "./SchemaProvider";
import { Checkbox } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import SelectType from "./SelectType";
import KeyInput from "./KeyInput";
import {handleRequiredCheckBox, checkIsPropertyRequired, deleteProperty} from "./utils";

type OtherSchemaType = {
  type: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
  objectKey: string;
  objectKeys?: string[];
  requiredProperties?: string[];
};

const OtherSchema = ({ type, objectKey, objectKeys = [], requiredProperties }: OtherSchemaType) => {
  const { setSchema } = useContext(SchemaContext)!;
  const [isPropertyRequired, setIsPropertyRequired] = useState(
    checkIsPropertyRequired(objectKey, requiredProperties)
  );

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
    deleteProperty(objectKeys, setSchema);
  };

  const handleCheckBox = (e: ChangeEvent<HTMLInputElement>) => {
    setIsPropertyRequired(e.target.checked);
    handleRequiredCheckBox(e.target.checked, objectKeys, setSchema);
  }
  
  return (
    <>
      <Box w="80%" display="flex" alignItems="center">
        {objectKey && objectKey.length !== 0 ? (
          <>
            <KeyInput flex="1" mr="5px" value={objectKey} objectKeys={objectKeys} />:
          </>
        ) : null}
        <SelectType
          w={objectKey.length !== 0 ? "50%" : "70%"}
          flex="2"
          ml="5px"
          value={type as string}
          onChange={handleTypeChange}
          placeholder="select type"
        />
        {objectKeys[objectKeys.length - 1] !== "items" ? (
          <>
            <Tooltip label="required" hasArrow placement="top">
              <Box ml="8px" display="flex">
                <Checkbox isChecked={isPropertyRequired} colorScheme="blue" onChange={handleCheckBox}/>
              </Box>
            </Tooltip>
            <DeleteIcon ml="8px" boxSize={5} onClick={handleDelete} />
          </>
        ) : null}
      </Box>
    </>
  );
};

export default OtherSchema;
