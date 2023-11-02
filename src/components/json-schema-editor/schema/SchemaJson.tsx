import {
  Box,
} from "@chakra-ui/react";

import { ChangeEvent, useContext } from "react";

import Mapper from "./mapper";
import { SchemaContext, SchemaContextType } from "./SchemaProvider";
import SelectType from "./SelectType";

import {schemaToData} from "./utils";

const SchemaJson = () => {
  const { schema, setSchema, setJsonValue } = useContext(SchemaContext) as SchemaContextType;

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
      
      setJsonValue(schemaToData(draftSchema));
    });
  };

  if (!schema.hasOwnProperty("type")) {
    return <Mapper data={schema} objectKey="" objectKeys={["root"]} />;
  }

  if (schema.type !== "object" && schema.type !== "array") {
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

  if (schema.type === "array") {
    return <Mapper objectKey="" objectKeys={["root"]} data={schema} />;
  }

  return (
    <>
      <Mapper
        data={schema}
        objectKey=""
        objectKeys={["root"]}
        requiredProperties={
          schema.hasOwnProperty("required") ? schema.required : undefined
        }
      />
    </>
  );
};

export default SchemaJson;
