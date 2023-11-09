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

const JSONProvider = ({
  setJsonValue,
  jsonSchema,
  children,
}: JSONProviderProps) => {
  const [value, setValue] = useImmer<JSONType>(null);

  useEffect(() => {
    setJsonValue(value);
  }, [value])

  return (
    <JSONContext.Provider value={{ jsonSchema, value, setValue }}>
      {children}
    </JSONContext.Provider>
  );
};

export default JSONProvider;
