import { JSONType } from "../../type";
import { useContext } from "react";
import { Box, Button } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import ArrayWrapper from "../helper-ui/ArrayWrapper";
import { ArrayContext } from "./ArrayProvider";

const ArrayArrayWrapper = ({ data, updateValue, objectKeys }: any) => {

  const { arrayItems } = useContext(ArrayContext);

  const addNewArray = () => {
    const type = data.items.type;
    let newArray: JSONType[] = [];
    
    if (type === "string") {
      newArray = [...arrayItems, ['string']];
    }
    else if(type === "number"){
      newArray = [...arrayItems, [1]];
    }
    else if(type === "null"){
      newArray = [...arrayItems, [null]];
    }
    else if(type === "boolean"){
      newArray = [...arrayItems, [false]];
    }
    else if(type === "array"){
      newArray = [...arrayItems, []];
    }
    updateValue(newArray);
  };

  const handleItemDelete = (itemIndex: number) => {
    const filteredArray = arrayItems.filter(
      (_, index: number) => itemIndex !== index
    );
    updateValue(filteredArray);
  };

  return (
    <Box>
      {arrayItems.map((_, index) => (
        <Box my="10px" key={uuidv4()}>
          <ArrayWrapper
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
      ))}
      <Box mt="10px">
        <Button onClick={addNewArray}>Add New Array</Button>
      </Box>
    </Box>
  );
};

export default ArrayArrayWrapper;
