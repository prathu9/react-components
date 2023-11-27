import { Box, Button, RadioGroup, Radio } from "@chakra-ui/react";
import { JSONSchema7TypeName } from "json-schema";
import { ChangeEvent, useState, useContext } from "react";
import InputWrapper from "../helper-ui/InputWrapper";
import { v4 as uuidv4 } from "uuid";
import BooleanValueWrapper from "../helper-ui/BooleanValueWrapper";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { PrimitiveType, DataType, ObjectType } from "../../type";
import ArrayPrimitiveWrapper from "./ArrayPrimitiveWrapper";
import { JSONContext } from "../../JsonProvider";
import useStore from "../../store/store";

const getInitialValue = (objectKeys: string[]) => {
  const value = useStore(state => state.jsonValue);

 if(value && typeof value === "object"){
    let obj = value;
    for(let i = 1; i < objectKeys.length; i++){
      const key = objectKeys[i];
      const value = obj[key];
      if(value && typeof value === "object" && !Array.isArray(value)){
        obj = value;
      }
    }
    const lastKey = objectKeys[objectKeys.length - 1]
    if(Array.isArray(obj[lastKey])){
      return obj[lastKey] as any[];
    }
  }
  else if(Array.isArray(value)){
    return value
  }
}

type ArrayItemsProps = {
  itemType: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
  updateValue: (newValue: any) => void;
  objectKeys: string[]
};

const ArrayItems = ({ itemType, updateValue, objectKeys }: ArrayItemsProps) => {
  const [arrayItems, setArrayItems] = useState<DataType[]>(getInitialValue(objectKeys) || []);

  const updateArrayItems = (newValue: PrimitiveType) => {
    console.log("check", itemType, arrayItems)
    if(itemType === "array"){
      console.log("array", newValue)
    }
    else if (itemType !== "boolean" && newValue) {
      const newArray = [...arrayItems, newValue];
      setArrayItems(newArray);
      updateValue(newArray);
    } else if (itemType === "boolean") {
      const newArray = [...arrayItems, newValue];
      setArrayItems(newArray);
      updateValue(newArray);
    } else if (itemType === "null") {
      const newArray = [...arrayItems, newValue];
      setArrayItems(newArray);
      updateValue(newArray);
    }
  };

  const handleItemChange = (newValue: string | ObjectType, index: number) => {
    if (newValue !== arrayItems[index]) {
      const updatedArray = [...arrayItems];
      updatedArray[index] = newValue;
      setArrayItems(updatedArray);
      updateValue(updatedArray);
    }
  };

  const handleItemDelete = (itemIndex: number) => {
    const filteredArray = arrayItems.filter((_, index) => itemIndex !== index);
    setArrayItems(filteredArray);
  };

  return (
    <Box>
      {arrayItems.map((item, index) => (
        <Box key={uuidv4()} display="flex" alignItems="center">
          <ArrayPrimitiveWrapper
            type={itemType}
            value={item}
            handleArrayItemChange={(newValue: string) =>
              handleItemChange(newValue, index)
            }
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
      ))}
      <Box my="10px">
        {itemType === "boolean" ? (
          <Button onClick={() => updateArrayItems(false)}>
            Add Boolean value
          </Button>
        ) : itemType === "null" ? (
          <Button
            leftIcon={<AddIcon />}
            variant="outline"
            colorScheme="blue"
            onClick={() => updateArrayItems(null)}
          >
            Null
          </Button>
        ) : (
          <Button
            onClick={() =>
              updateArrayItems(itemType === "number" ? 1 : "string")
            }
          >{`Add ${itemType === "number" ? "number" : "string"} value`}</Button>
        )}
      </Box>
    </Box>
  );
};

export default ArrayItems;
