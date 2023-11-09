import { JSONSchema7 } from "json-schema";

type ArrayComponentProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
};

const ArrayComponent = ({data, objectKeys=[], objectKey=""}: ArrayComponentProps) => {
  return <h1>Array</h1>;
};

export default ArrayComponent;
