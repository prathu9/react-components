import { JSONSchema7, JSONSchema7Object } from "json-schema";
import ArrayComponent from "./components/array-component/Array-component";
import ObjectComponent from "./components/object-component/Object-component";
import PrimitiveComponent from "./components/primitive-component/PrimitiveComponent";
import {Dispatch} from "react";

const jsonComp = (
  data: JSONSchema7,
  objectKeys?: string[],
  objectKey?: string,
  setEdit?:  Dispatch<React.SetStateAction<boolean>>
) => {
  if (data.type === "object") {
    return (
      <ObjectComponent
        data={data as JSONSchema7Object}
        objectKeys={objectKeys}
        objectKey={objectKey}
        setEdit={setEdit}
      />
    );
  }

  if (data.type === "array") {
    return (
      <ArrayComponent
        data={data}
        objectKeys={objectKeys}
        objectKey={objectKey}
        setEdit={setEdit}
      />
    );
  }

  return (
    <PrimitiveComponent
      data={data}
      objectKeys={objectKeys}
      objectKey={objectKey}
    />
  );
};

type MapperProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
  setEdit?: Dispatch<React.SetStateAction<boolean>>;
  requiredProperties?: string[];
};

const Mapper = ({ data, objectKeys, objectKey, setEdit }: MapperProps) => {
  const item = jsonComp(data, objectKeys, objectKey, setEdit);

  return item;
};

export default Mapper;
