import { JSONSchema7 } from "json-schema";
import { DraftFunction } from "use-immer";

export const handleRequiredCheckBox = (
  isChecked: boolean,
  objectKeys: string[],
  setSchema: (arg: JSONSchema7 | DraftFunction<JSONSchema7>) => void
) => {
  setSchema((draftSchema) => {
    let currObj = draftSchema as any;
    for (let i = 1; i < objectKeys.length - 2; i++) {
      currObj = currObj[objectKeys[i] as string];
    }

    const lastKey = objectKeys[objectKeys.length - 1];

    if (isChecked) {
      if (!currObj.hasOwnProperty("required")) {
        currObj["required"] = [];
      }
      currObj["required"].push(lastKey);
    } else {
      if (currObj.hasOwnProperty("required")) {
        currObj["required"] = currObj["required"].filter(
          (requiredProp: string) => requiredProp !== lastKey
        );
        if (currObj["required"].length === 0) {
          delete currObj["required"];
        }
      }
    }
  });
};

export const checkIsPropertyRequired = (
  objectKey: string,
  requiredProperties?: string[]
) => {
  if (requiredProperties === undefined) {
    return false;
  }

  return requiredProperties.some((prop) => prop === objectKey);
};

export const deleteProperty = (
  objectKeys: string[],
  setSchema: (arg: JSONSchema7 | DraftFunction<JSONSchema7>) => void
) => {
  setSchema((draftSchema) => {
    let currObj = draftSchema as any;
    for (let i = 1; i < objectKeys.length - 2; i++) {
      const key = objectKeys[i];
      if (currObj[key] == null || typeof currObj[key] !== "object") {
        return; // Property doesn't exist or is not an object
      }
      currObj = currObj[key as string];
    }

    const lastKey = objectKeys[objectKeys.length - 1];

    const constraints = ["anyOf", "oneOf", "allOf", "not"];

    if (Object.keys(currObj).some((key) => constraints.includes(key))) {
      const constraint = Object.keys(currObj)[0];
      currObj[constraint].splice(parseInt(lastKey), 1);
    }

    if (currObj.hasOwnProperty("required")) {
      currObj.required = currObj.required.filter(
        (prop: string) => prop !== lastKey
      );
    }

    if (
      currObj.hasOwnProperty("properties") &&
      currObj.properties.hasOwnProperty(lastKey)
    ) {
      delete currObj.properties[lastKey];
    }

    
  });
};

type DataValue = string | boolean | null | undefined;
interface DataObject {
    [key: string]: DataValue | DataObject | DataValue[];
}
  
