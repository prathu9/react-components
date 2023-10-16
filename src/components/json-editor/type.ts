import { JSONSchema } from "json-schema-to-ts";

export type StateDataSource =
  | {
      id: string;
      name: string;
      type: "scalar";
      initialValue: any;
      jsonSchema: JSONSchema;
      dsType: "state";
    }
  | {
      id: string;
      name: string;
      type: "collection";
      initialItems: any[];
      jsonSchema: JSONSchema;
      dsType: "state";
    };