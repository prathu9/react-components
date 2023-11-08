import { chakra } from "@chakra-ui/react";
import SchemaJson from "./schema/SchemaJson";
import SchemaProvider from "./schema/SchemaProvider";

const JSONSchemaEditor = ({jsonSchema, setJsonSchemaValue}: any) => {
  

  return (
    <>
      <SchemaProvider jsonSchema={jsonSchema} setJsonSchemaValue={setJsonSchemaValue}>
        <chakra.div>
          <chakra.h1>JSON</chakra.h1>
          <SchemaJson />
        </chakra.div>
      </SchemaProvider>
    </>
  );
};

export default JSONSchemaEditor;
