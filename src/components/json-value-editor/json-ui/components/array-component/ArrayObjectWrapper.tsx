import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import { DataType, ObjectType } from "../../type";
import { v4 as uuidv4 } from "uuid";
import { JSONSchema7 } from "json-schema";
import ObjectWrapper from "../helper-ui/ObjectWrapper";
import Mapper from "../../mapper";

type ArrayObjectWrapperProps = {
  data: JSONSchema7;
  updateValue: (newValue: string) => void;
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
    console.log(newObj);
    setArrayItems([...arrayItems, newObj]);
  };

  return (
    <Box>
      <Box>
        {arrayItems.map((item, index) => {
          const properties = Object.keys(item);
          return (
            <Box my="10px" key={uuidv4()}>
              <ObjectWrapper data={data} objectKeys={[...objectKeys, `${index}`]}  />
            </Box>
          );
        })}
      </Box>
      <Button onClick={addNewObject}>Add New Object</Button>
    </Box>
  );
};

export default ArrayObjectWrapper;
