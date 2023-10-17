import { chakra } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import SchemaJson from "./schema/SchemaJson";
import SchemaProvider from "./schema/SchemaProvider";
import { JSONSchema7 } from "json-schema";

const JSONSchemaEditor = ({value, setValue}: any) => {
  

  return (
    <>
      <SchemaProvider value={value} setValue={setValue}>
        <chakra.div>
          <chakra.h1>JSON</chakra.h1>
          <SchemaJson />
        </chakra.div>
      </SchemaProvider>
    </>
  );
};

export default JSONSchemaEditor;
