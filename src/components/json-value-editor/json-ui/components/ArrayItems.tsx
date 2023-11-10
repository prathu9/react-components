import { Box } from "@chakra-ui/react";
import { JSONSchema7TypeName } from "json-schema";
import { ChangeEvent, useState } from "react";
import InputWrapper from "./InputWrapper";
import { v4 as uuidv4 } from "uuid";
import ArrayItemWrapper from "./ArrayItemWrapper";
import BooleanValueWrapper from "./BooleanValueWrapper";

type ValueType = number | string | boolean;

type ArrayItemsProps = {
  itemType: JSONSchema7TypeName | JSONSchema7TypeName[] | undefined;
  updateValue: (newValue: any) => void;
};

const ArrayItems = ({ itemType, updateValue }: ArrayItemsProps) => {
  const [arrayItems, setArrayItems] = useState<ValueType[]>([]);

  const updateArrayItems = (newValue: string | number | boolean) => {
    if (itemType !== "boolean" && newValue) {
      const newArray = [...arrayItems, newValue];
      setArrayItems(newArray);
      updateValue(newArray);
    }
    else if(itemType === "boolean"){
      const newArray = [...arrayItems, newValue];
      setArrayItems(newArray);
      updateValue(newArray);
    }
  };

  const handleItemChange = (newValue: string, index: number) => {
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
          <ArrayItemWrapper
            itemValue={item}
            itemIndex={index}
            handleItemChange={handleItemChange}
            handleItemDelete={handleItemDelete}
          />
        </Box>
      ))}
      <Box my="10px" ml="5px">{
        itemType === "boolean"? <BooleanValueWrapper initialValue={false} updateValue={updateArrayItems} />:
        <InputWrapper type={itemType} updateValue={updateArrayItems} />
        }
      </Box>
    </Box>
  );
};

export default ArrayItems;
