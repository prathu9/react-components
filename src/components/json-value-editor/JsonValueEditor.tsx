import { chakra } from "@chakra-ui/react";
import JsonUI from "./json-ui/Jsonui";

import JSONProvider from "./json-ui/JsonProvider";
import useStore from "./json-ui/store/store";
import { useEffect } from "react";

const JSONValueEditor = ({ jsonSchema, setJsonValue }: any) => {

  const loadJson = useStore(state => state.loadJson);
  const jsonValue = useStore(state => state.jsonValue);

  useEffect(() => {
    loadJson(jsonSchema);
  }, [jsonSchema])

  useEffect(() => {
    setJsonValue(jsonValue);
  },[jsonValue])
  
  console.log("json",jsonValue)

  return (
    <>
      {/* <JSONProvider jsonSchema={jsonSchema} setJsonValue={setJsonValue}> */}
        <chakra.div>
          <chakra.h1>JSON UI</chakra.h1>
          <JsonUI />
        </chakra.div>
      {/* </JSONProvider> */}
    </>
  );
};

export default JSONValueEditor;
