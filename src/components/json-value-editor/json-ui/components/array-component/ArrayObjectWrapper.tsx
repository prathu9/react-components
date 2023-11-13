import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { DataType, ObjectType } from "../../type";
import { v4 as uuidv4 } from "uuid";
import { JSONSchema7 } from "json-schema";
import ObjectWrapper from "../helper-ui/ObjectWrapper";

type ArrayObjectWrapperProps = {
  data: JSONSchema7;
  updateValue: (newValue: string) => void;
};

const ArrayObjectWrapper = ({ data, updateValue }: ArrayObjectWrapperProps) => {
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
    console.log(newObj)
    setArrayItems([...arrayItems, newObj]);
  };
console.log(arrayItems)
  return (
    <Box>
      <Box>
        {arrayItems.map((item) => (
          <Box key={uuidv4()}>
            <ObjectWrapper />
          </Box>
        ))}
      </Box>
      <Button onClick={addNewObject}>Add New Object</Button>
    </Box>
  );
};

export default ArrayObjectWrapper;
