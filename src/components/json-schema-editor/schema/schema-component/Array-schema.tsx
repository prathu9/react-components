import { DeleteIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Checkbox,
  Tooltip,
} from "@chakra-ui/react";
import { ChangeEvent, MouseEvent, useContext, useState } from "react";

import KeyInput from "../helper-ui/KeyInput";
import Mapper from "../mapper";
import { SchemaContext } from "../SchemaProvider";
import SelectType from "../helper-ui/SelectType";
import {
  checkIsPropertyRequired,
  deleteProperty,
  handleRequiredCheckBox,
} from "../utils/utils";

const ArraySchema = ({
  items,
  objectKey,
  objectKeys = [],
  requiredProperties,
}: any) => {
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

      if (newType === "group") {
        delete currObj["items"];
        delete currObj["type"];
        currObj["anyOf"] = [
          {
            type: "string",
          },
        ];
      } else {
        currObj["type"] = newType;

        if (newType === "object") {
          delete currObj["items"];
          currObj["properties"] = {
            field: {
              type: "string",
            },
          };
        } else {
          delete currObj["items"];
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
    <Accordion w="100%" allowToggle>
      <AccordionItem>
        <AccordionButton px="0" display="flex" justifyContent="space-between">
          <Box w="80%" display="flex" alignItems="center">
            {objectKey.length !== 0 ? (
              <>
                <KeyInput
                  value={objectKey}
                  flex="1"
                  mr="5px"
                  placeholder="key"
                  objectKeys={objectKeys}
                />{" "}
                :
              </>
            ) : null}
            <SelectType
              flex="2"
              value="array"
              mx="5px"
              onChange={handleTypeChange}
              placeholder="select type"
              w="70%"
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
                 {objectKeys[objectKeys.length - 1] !== "root" ? (
                  <DeleteIcon ml="8px" boxSize={5} onClick={handleDelete} />
                ) : null}
              </>
            ) : null}
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
