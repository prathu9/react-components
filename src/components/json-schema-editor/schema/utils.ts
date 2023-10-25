import { JSONSchema7 } from "json-schema";

import { DraftFunction} from "use-immer";

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
  console.log(objectKey, requiredProperties)
  if (requiredProperties === undefined) {
    return false;
  }

  return requiredProperties.some((prop) => prop === objectKey);
};
