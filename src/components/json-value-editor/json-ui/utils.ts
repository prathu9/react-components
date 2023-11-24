type PrimitiveType = string | number | boolean | null;

interface ObjectType {
  [key: string]: PrimitiveType | ObjectType | PrimitiveType[];
}

type JSONType = ObjectType | PrimitiveType;

export const deepCopy = (obj1: JSONType, obj2: JSONType) => {
  if (!obj1 || typeof obj1 !== "object") {
    return obj1;
  }

  if (!obj2 || typeof obj2 !== "object") {
    return obj1;
  }

  const keys = Object.keys(obj1);

  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (obj2.hasOwnProperty(prop)) {
      if (typeof obj2[prop] === typeof obj1[prop]) {
        if (Array.isArray(obj2[prop]) && Array.isArray(obj1[prop])) {
          console.log("array", obj1, obj2)
          obj1[prop] = obj2[prop];
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

  return obj1;
};
