import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { useImmer, Updater } from "use-immer";
import {deepCopy} from "./utils";
import {ArrayType, EditType} from "./type";
import {JSONType, PrimitiveType, ObjectType} from "./type";

export type JSONContextType = {
  jsonSchema: JSONSchema7;
  setValue: Updater<JSONType>;
  value?: JSONType;
  editList: EditType[];
  setEditList: React.Dispatch<React.SetStateAction<EditType[]>>;
};

type JSONProviderProps = {
  jsonSchema: JSONSchema7;
  setJsonValue: React.Dispatch<React.SetStateAction<JSONType>>;
  children: ReactNode;
};

export const JSONContext = createContext<JSONContextType | null>(null);

const getInitialValue = (jsonSchema: JSONSchema7) => {
  if(jsonSchema.type==="string"){
    return "";
  }
  else if(jsonSchema.type === "number"){
    return 0;
  }
  else if(jsonSchema.type === "boolean"){
    return false;
  }
  else if(jsonSchema.type === "null"){
    return null;
  }
  else if(jsonSchema.type === "array"){
    // console.log("json", (jsonSchema.items as JSONSchema7Definition)?.items)
    const newArray: ArrayType = [];
    if((jsonSchema.items as JSONSchema7Definition)?.type === "object"){
      newArray.push(getInitialValue(jsonSchema.items as JSONSchema7))
    }
    if((jsonSchema.items as JSONSchema7)?.type === "array"){
      const itemsType: any = ((jsonSchema.items as JSONSchema7)?.items  as JSONSchema7)!.type
      newArray.push(itemsType);
    }
    console.log("check", newArray, jsonSchema.items)
    return newArray;
  }
  else{
    const newObj = {} as any;
    if(jsonSchema.hasOwnProperty("properties")){
      const propKeys = Object.keys(jsonSchema.properties!);
      for(let i = 0; i < propKeys.length; i++){
        newObj[propKeys[i] as string] = getInitialValue(jsonSchema.properties![propKeys[i]] as JSONSchema7)
      }
    }
    return {...newObj};
  }
}

const JSONProvider = ({
  setJsonValue,
  jsonSchema,
  children,
}: JSONProviderProps) => {
  const [value, setValue] = useImmer<JSONType>(getInitialValue(jsonSchema));
  const [editList, setEditList] = useState<EditType[]>([]);
  const jsonSchemaRef = useRef(jsonSchema)
  const valueRef = useRef(value);
// console.log(editList)
  useEffect(() => {
    setJsonValue(value);
    valueRef.current = value;
  }, [value])

  if(jsonSchemaRef.current !== jsonSchema){
    jsonSchemaRef.current = jsonSchema;
    const defaultValue = getInitialValue(jsonSchema);
    console.log("d", defaultValue)
    setValue(deepCopy(Object.assign({}, defaultValue), Object.assign({}, valueRef.current)));
    // setEditList([]);
  }

  return (
    <JSONContext.Provider value={{ jsonSchema, value, setValue, editList,  setEditList }}>
      {children}
    </JSONContext.Provider>
  );
};

export default JSONProvider;
