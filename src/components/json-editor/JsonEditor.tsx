import { chakra } from "@chakra-ui/react";
import { useJsonString } from "./useJsonString";
import Editor from "@monaco-editor/react";

export const JsonEditor = ({
  usedJsonString,
  label,
}: {
  usedJsonString: ReturnType<typeof useJsonString>;
  label: string;
}) => {
  return (
    <chakra.div>
      <chakra.p>{label}</chakra.p>
      <Editor
        height="300px"
        defaultLanguage="json"
        defaultValue={usedJsonString.string}
        onChange={(v) => usedJsonString.setString(v ?? "")}
        options={{}}
      />
    </chakra.div>
  );
};
