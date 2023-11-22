import { JSONSchema7 } from "json-schema";
import { ReactNode, createContext, useEffect } from "react";
import { useImmer, Updater } from "use-immer";

type PrimitiveType = string | number | boolean | null;

interface ObjectType {
  [key: string]: PrimitiveType | ObjectType | PrimitiveType[];
}

type JSONType = ObjectType | PrimitiveType;

export type JSONContextType = {
  jsonSchema: JSONSchema7;
  value: JSONType;
  setValue: Updater<JSONType>;
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
    return [];
  }
  else{
    const newObj = {} as any;
    if(jsonSchema.hasOwnProperty("properties")){
      const propKeys = Object.keys(jsonSchema.properties!);
      for(let i = 0; i < propKeys.length; i++){
        newObj[propKeys[i] as string] = getInitialValue(jsonSchema.properties![propKeys[i]] as JSONSchema7)
      }
    }
   
    return newObj;
  }
}

const JSONProvider = ({
  setJsonValue,
  jsonSchema,
  children,
}: JSONProviderProps) => {
  const [value, setValue] = useImmer<JSONType>(null);

  useEffect(() => {
    setJsonValue(value);
  }, [value])

  useEffect(() => {
    setValue(getInitialValue(jsonSchema))
  }, [jsonSchema])

  return (
    <JSONContext.Provider value={{ jsonSchema, value, setValue }}>
      {children}
    </JSONContext.Provider>
  );
};

export default JSONProvider;
