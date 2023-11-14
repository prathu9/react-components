import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { DataType, ObjectType } from "../../type";
import { v4 as uuidv4 } from "uuid";
import { JSONSchema7 } from "json-schema";
import ObjectWrapper from "../helper-ui/ObjectWrapper";
import Mapper from "../../mapper";
import { DeleteIcon } from "@chakra-ui/icons";

type ArrayObjectWrapperProps = {
  data: JSONSchema7;
  updateValue: (newValue: any) => void;
  objectKeys?: string[];
};

const ArrayObjectWrapper = ({
  data,
  updateValue,
  objectKeys = [],
}: ArrayObjectWrapperProps) => {
  const [arrayItems, setArrayItems] = useState<ObjectType[]>([]);

  const addNewObject = () => {
    // console.log(data);
    const properties = data.properties;
    const newObjKeyValue: any = [];
    for (const [key, value] of Object.entries(properties!)) {
      if ((value as JSONSchema7).type === "string") {
        newObjKeyValue.push([key, ""]);
      }
    }
    const newObj = Object.fromEntries(newObjKeyValue);
    const newArray = [...arrayItems, newObj];
    setArrayItems(newArray);
    updateValue(newArray);
  };

  const handleItemDelete = (itemIndex: number) => {
    const filteredArray = arrayItems.filter((_, index) => itemIndex !== index);
    setArrayItems(filteredArray);
    updateValue(filteredArray);
  };

  return (
    <Box>
      <Box>
        {arrayItems.map((_, index) => {
          return (
            <Box my="10px" key={uuidv4()} display="flex">
              <ObjectWrapper
                data={data}
                objectKeys={[...objectKeys, `${index}`]}
              />
              <Button
                m="5px"
                px="10px"
                py="5px"
                height="28px"
                colorScheme="red"
                variant="outline"
                onClick={() => handleItemDelete(index)}
              >
                <DeleteIcon color="red" cursor="pointer" />
              </Button>
            </Box>
          );
        })}
      </Box>
      <Button onClick={addNewObject}>Add New Object</Button>
    </Box>
  );
};

export default ArrayObjectWrapper;
