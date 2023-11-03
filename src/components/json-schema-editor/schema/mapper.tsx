import { JSONSchema7 } from "json-schema";

import ArraySchema from "./SchemaComponent/Array-schema";
import GroupSchema from "./SchemaComponent/GroupSchema";
import ObjectSchema from "./SchemaComponent/Object-schema";
import OtherSchema from "./SchemaComponent/Other-schema";

type MapperProps = {
  data: JSONSchema7;
  objectKey: string;
  objectKeys?: string[];
  requiredProperties?: string[];
};

const schemaComp = (
  data: JSONSchema7,
  objectKey: string,
  objectKeys?: string[],
  requiredProperties?: string[]
) => {
  if (!data.hasOwnProperty("type")) {
    return (
      <GroupSchema
        objectKey={objectKey}
        data={data}
        objectKeys={objectKeys}
        requiredProperties={requiredProperties}
      />
    );
  }

  if (data.type === "object") {
    const properties = data.properties;

    return (
      <ObjectSchema
        data={data}
        objectKey={objectKey}
        objectKeys={objectKeys}
        requiredProperties={requiredProperties}
      />
    );
  }

  if (data.type === "array") {
    return (
      <ArraySchema
        items={data.items}
        objectKey={objectKey}
        objectKeys={objectKeys}
        requiredProperties={requiredProperties}
      />
    );
  }

  return (
    <>
      <OtherSchema
        type={data.type}
        objectKey={objectKey}
        objectKeys={objectKeys}
        requiredProperties={requiredProperties}
      />
    </>
  );
};

const Mapper = ({
  data,
  objectKey,
  objectKeys = [],
  requiredProperties,
}: MapperProps) => {
  const item = schemaComp(data, objectKey, objectKeys, requiredProperties);

  return item;
};

export default Mapper;
