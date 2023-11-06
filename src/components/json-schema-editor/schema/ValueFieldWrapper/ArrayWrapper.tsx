import { Box } from "@chakra-ui/react";
import { useState } from "react";

import InputWrapper from "./InputWrapper";
import { v4 as uuidv4 } from "uuid";
import ArrayItemWrapper from "./ArrayItemWrapper";

type ValueType = number | string;

type ArrayWrapperProps = {
  type: any;
  updateValue: (newValue: ValueType | ValueType[]) => void;
};

const ArrayWrapper = ({ type, updateValue }: ArrayWrapperProps) => {
  const [arrayItems, setArrayItems] = useState<ValueType[]>([]);

  const updateArrayItems = (newValue: string | number) => {
    if (newValue) {
      const newArray = [...arrayItems, newValue];
      setArrayItems(newArray);
      updateValue(newArray);
    }
  };

  const handleItemChange = (newValue: string, index: number) => {
    if(newValue !== arrayItems[index]){
      const updatedArray = [...arrayItems];
      updatedArray[index] = newValue;
      setArrayItems(updatedArray);
      updateValue(updatedArray);
    }
  };

  const handleItemDelete = (itemIndex: number) => {
    const filteredArray = arrayItems.filter((_, index) => itemIndex !== index);
    setArrayItems(filteredArray);
  }

  return (
    <Box mt="5px">
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
      <Box my="10px" ml="5px">
        <InputWrapper type={type} updateValue={updateArrayItems} />
      </Box>
    </Box>
  );
};

export default ArrayWrapper;
