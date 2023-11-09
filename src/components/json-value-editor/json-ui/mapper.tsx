import { JSONSchema7 } from "json-schema";
import ArrayComponent from "./components/Array-component";
import ObjectComponent from "./components/Object-component";
import PrimitiveComponent from "./components/PrimitiveComponent";

const jsonComp = (
  data: JSONSchema7,
  objectKeys?: string[],
  objectKey?: string
) => {
  if (data.type === "object") {
    return (
      <ObjectComponent
        data={data}
        objectKeys={objectKeys}
        objectKey={objectKey}
      />
    );
  }

  if (data.type === "array") {
    return (
      <ArrayComponent
        data={data}
        objectKeys={objectKeys}
        objectKey={objectKey}
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
  requiredProperties?: string[];
};

const Mapper = ({ data, objectKeys, objectKey }: MapperProps) => {
  const item = jsonComp(data, objectKeys, objectKey);

  return item;
};

export default Mapper;
