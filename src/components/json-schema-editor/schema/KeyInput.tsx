import { Input, InputProps, Tooltip } from "@chakra-ui/react";
import {
  FocusEvent,
  ChangeEvent,
  KeyboardEvent,
  useContext,
  useState,
  useCallback,
} from "react";

import { SchemaContext } from "./SchemaProvider";

type KeyInputType = {
  value: string;
  objectKeys: string[];
} & InputProps;

const KeyInput = ({ value, objectKeys, ...props }: KeyInputType) => {
  const { schema, setSchema } = useContext(SchemaContext)!;
  const [inputValue, setInputValue] = useState(value);
  const [inputError, setInputError] = useState({
    status: false,
    message: "",
  });

  const updateSchema = useCallback(() => {
    setSchema((draftSchema) => {
      let currObj = draftSchema as any;
      let objToChange;

      for (let i = 1; i < objectKeys.length - 1; i++) {
        const key = objectKeys[i];
        if (currObj[key] == null || typeof currObj[key] !== "object") {
          return;
        }

        if (i === objectKeys.length - 2) {
          objToChange = currObj;
        }
        currObj = currObj[key as string];
      }

      const remainingKeys = Object.keys(currObj);
      const newKey = inputValue;
      const lastKey = objectKeys[objectKeys.length - 1];

      if (remainingKeys.includes(newKey) && lastKey !== newKey) {
        setInputError({
          status: true,
          message: "duplicate key",
        });
        return;
      }

      if(newKey.length === 0){
        setInputError({
          status: true,
          message: "Key cannot be empty",
        });
        return;
      }

      if(objToChange.hasOwnProperty("required")){
        if(objToChange.required.some((prop: string) => prop === lastKey)){
          objToChange.required = objToChange.required.filter((prop: string) => prop !== lastKey);
          objToChange.required.push(newKey);
        }
      }

      objToChange.properties = remainingKeys.reduce(
        (acc: Record<string, any>, val) => {
          if (val === lastKey) {
            acc[newKey] = currObj[lastKey];
          } else {
            acc[val] = currObj[val];
          }

          return acc;
        },
        {}
      );
    });
  }, [setSchema, objectKeys, inputValue]);

  const handleKeyUpdate = (e: FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    updateSchema();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInputError({
      status: false,
      message: "",
    });

    if (newValue.length > 10) {
      return;
    }
    setInputValue(newValue);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateSchema();
    }
  };

  return (
    <Tooltip
      label={inputError.message}
      isDisabled={!inputError.status}
      isOpen
      hasArrow
      color="red.500"
      bg="white"
    >
      <Input
        value={inputValue}
        placeholder="key"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleKeyUpdate}
        errorBorderColor="crimson"
        isInvalid={inputError.status}
        {...props}
      />
    </Tooltip>
  );
};

export default KeyInput;
