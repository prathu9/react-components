import { chakra } from "@chakra-ui/react";
import JsonUI from "./json-ui/Jsonui";

import JSONProvider from "./json-ui/JsonProvider";

const JSONValueEditor = ({ jsonSchema, setJsonValue }: any) => {
  return (
    <>
      <JSONProvider jsonSchema={jsonSchema} setJsonValue={setJsonValue}>
        <chakra.div>
          <chakra.h1>JSON UI</chakra.h1>
          <JsonUI />
        </chakra.div>
      </JSONProvider>
    </>
  );
};

export default JSONValueEditor;
