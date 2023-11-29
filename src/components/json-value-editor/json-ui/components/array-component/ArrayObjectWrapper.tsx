import { Box, Button } from "@chakra-ui/react";
import { useState, memo, useContext } from "react";
import { DataType, ObjectType } from "../../type";
import { v4 as uuidv4 } from "uuid";
import { JSONSchema7 } from "json-schema";
import ObjectWrapper from "../helper-ui/ObjectWrapper";
import Mapper from "../../mapper";
import { DeleteIcon } from "@chakra-ui/icons";
import {JSONContext} from "../../JsonProvider";

type ArrayObjectWrapperProps = {
  data: JSONSchema7;
  updateValue: (newValue: any) => void;
  objectKeys?: string[];
};

const getInitialValue = (objectKeys: string[]) => {
  const {value} = useContext(JSONContext)!;

 if(Array.isArray(value)){
  return value;
 }
 else if(value && typeof value === "object"){
    let obj = value;
    for(let i = 1; i < objectKeys.length; i++){
      const key = objectKeys[i];
      const value = obj[key];
      if(value && typeof value === "object" && !Array.isArray(value)){
        obj = value;
      }
    }
    const lastKey = objectKeys[objectKeys.length - 1];
    const arrayItems = obj[lastKey];

    if(Array.isArray(arrayItems)){
      return arrayItems;
    }
    else{
      return [];
    }
  }
  else{
    return [];
  }
}

const ArrayObjectWrapper = memo(({
  data,
  updateValue,
  objectKeys = [],
}: ArrayObjectWrapperProps) => {
  // const [arrayItems, setArrayItems] = useState<ObjectType[]>([]);

  const initialItems = getInitialValue(objectKeys);
  console.log(initialItems)

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
    const newArray = [...initialItems, newObj];
    // setArrayItems(newArray);
    updateValue(newArray);
  };

  const handleItemDelete = (itemIndex: number) => {
    const filteredArray = initialItems.filter((_, index) => itemIndex !== index);
    // setArrayItems(filteredArray);
    updateValue(filteredArray);
  };

  return (
    <Box>
      {initialItems.map((_, index) => {
        return (
          <Box my="10px" key={uuidv4()}>
            <ObjectWrapper
              data={data}
              objectKeys={[...objectKeys, `${index}`]}
              deleteBtn={
                <Button
                  mx="5px"
                  px="10px"
                  py="5px"
                  height="28px"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => handleItemDelete(index)}
                >
                  <DeleteIcon color="red" cursor="pointer" />
                </Button>
              }
            />
          </Box>
        );
      })}

      <Button onClick={addNewObject}>Add New Object</Button>
    </Box>
  );
});

export default ArrayObjectWrapper;
