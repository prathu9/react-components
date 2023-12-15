import { JSType, JSONType, PrimitiveType, ObjectType, ArrayType } from "./type";


export const deepCopy = (obj1: JSONType, obj2: JSONType) => {
  if (!obj1 || typeof obj1 !== "object") {
    return obj1;
  }

  if (!obj2 || typeof obj2 !== "object") {
    return obj1;
  }

  if(Array.isArray(obj1) || Array.isArray(obj2)){
    return obj1;
  }

  const keys = Object.keys(obj1);

  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (obj2.hasOwnProperty(prop)) {
      if (typeof obj2[prop] === typeof obj1[prop]) {
        if (Array.isArray(obj2[prop]) && Array.isArray(obj1[prop])) {
          (obj1 as ObjectType)[prop] = (obj2[prop] as ArrayType)?.map((item, i) => {
            if(item && typeof item === "object" && !Array.isArray(item)){
              return deepCopy((obj1[prop] as ArrayType)[0], item);
            }
           else{
            return item
           }
          }) as ArrayType
        } else if (
          typeof obj2[prop] === "object" &&
          typeof obj1[prop] === "object"
        ) {
          obj1[prop] = deepCopy(
            obj1[prop] as ObjectType,
            obj2[prop] as ObjectType
          );
        } else {
          obj1[prop] = obj2[prop];
        }
      }
    }
  }

  return {...obj1};
};

export const checkValueType =  (value: JSONType, jsonSchemaType: JSONType | ArrayType) => {
  if(typeof value === "object"){
    if(Array.isArray(value) && jsonSchemaType==="array"){
      return true;
    }
    else if(value === null && jsonSchemaType === "null"){
      return true;
    }
    else if(jsonSchemaType === "object"){
      return true;
    }
    else{
      return false;
    }
  }
  else{
    return typeof value === jsonSchemaType;
  }
}
