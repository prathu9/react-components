import {
  Box,
} from "@chakra-ui/react";

import { ChangeEvent, useContext } from "react";

import Mapper from "./mapper";
import { SchemaContext, SchemaContextType } from "./SchemaProvider";
import SelectType from "./SelectType";

const SchemaJson = () => {
  const { schema, setSchema } = useContext(SchemaContext) as SchemaContextType;

  const data = schema || { type: "string" };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setSchema((draftSchema) => {
      const newType = e.target.value as any;
      draftSchema.type = newType;

      if (newType === "group") {
        delete draftSchema["type"];
        draftSchema["anyOf"] = [
          {
            type: "string",
          },
        ];
      }
      if (newType === "object") {
        delete draftSchema["items"];
        draftSchema.properties = {
          field: {
            type: "string",
          },
        };
      } else if (newType === "array") {
        delete draftSchema["properties"];
        draftSchema.items = {
          type: "string",
        };
      } else {
        delete draftSchema["items"];
        delete draftSchema["properties"];
        delete draftSchema["required"];
      }
    });
  };

  if (!data.hasOwnProperty("type")) {
    return <Mapper data={data} objectKey="" objectKeys={["root"]} />;
  }

  if (data.type !== "object" && data.type !== "array") {
    return (
      <Box w="80%" display="flex" alignItems="center">
        <SelectType
          w="80%"
          value={schema.type as string}
          onChange={handleTypeChange}
        />
      </Box>
    );
  }

  if (data.type === "array") {
    return <Mapper objectKey="" objectKeys={["root"]} data={data} />;
  }

  return (
    <>
      <Mapper
        data={data}
        objectKey=""
        objectKeys={["root"]}
        requiredProperties={
          data.hasOwnProperty("required") ? data.required : undefined
        }
      />
    </>
  );
};

export default SchemaJson;
