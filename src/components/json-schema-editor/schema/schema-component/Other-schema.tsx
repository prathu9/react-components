import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Checkbox, Tooltip } from "@chakra-ui/react";
import { JSONSchema7TypeName } from "json-schema";
import { ChangeEvent, MouseEvent, useContext, useState } from "react";

import KeyInput from "../helper-ui/KeyInput";
import { SchemaContext } from "../SchemaProvider";
import SelectType from "../helper-ui/SelectType";
import {
  checkIsPropertyRequired,
  deleteProperty,
  handleRequiredCheckBox,
} from "../utils/utils";

type OtherSchemaType = {
  type: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
  objectKey: string;
  objectKeys?: string[];
  requiredProperties?: string[];
};

const OtherSchema = ({
  type,
  objectKey,
  objectKeys = [],
  requiredProperties,
}: OtherSchemaType) => {
  const { schema, setSchema } = useContext(SchemaContext)!;
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

      if (newType === "group") {
        delete currObj["type"];
        currObj["anyOf"] = [
          {
            type: "string",
          },
        ];
      } else {
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
  };

  return (
    <>
      <Box w="80%" display="flex" flexDirection="column">
        <Box w="100%" mt="10px" mb="5px" display="flex" alignItems="center">
          {objectKey && objectKey.length !== 0 ? (
            <>
              <KeyInput
                flex="1"
                mr="5px"
                value={objectKey}
                objectKeys={objectKeys}
              />
              :
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
      </Box>
    </>
  );
};

export default OtherSchema;
