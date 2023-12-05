import { createContext, ReactNode, useContext, useMemo } from "react";
import {JSONContext} from "../../JsonProvider";
import { ArrayType, JSONType, ObjectType, PrimitiveType } from "../../type";
import { checkValueType } from "../../utils";

type ArrayContextType = {
    arrayItems: JSONType[]
}

export const ArrayContext = createContext<ArrayContextType>({
    arrayItems: []
});

type ArrayProviderProps = {
    type: JSONType,
    objectKeys: string[],
    children: ReactNode;
}

const getInitialValue = (value: JSONType, objectKeys: string[], type?: JSONType) => {

   if(Array.isArray(value)){
    return value;
   }
   else if(value && typeof value === "object"){
      let obj: ObjectType | PrimitiveType[] | ArrayType[] = value;
      const lastKey = objectKeys[objectKeys.length - 1];
      let tempValue: any;
      for(let i = 1; i < objectKeys.length; i++){
        const key = objectKeys[i];
        if(!isNaN(parseInt(key)) && Array.isArray(obj)){
          tempValue = obj[parseInt(key)];
        }
        else{
          tempValue = (obj as ObjectType)[key]
        }
        
        if(tempValue && typeof tempValue === "object"){
          if(Array.isArray(tempValue)){
            if(key !== lastKey){
              obj = tempValue;
            }
          }
          else{
            obj = tempValue;
          }
        }
      }
  
      let arrayItems;
      
      if(!isNaN(parseInt(lastKey)) && Array.isArray(obj)){
        arrayItems = obj[parseInt(lastKey)];
      }
      else if(!Array.isArray(obj)){
        arrayItems = obj[lastKey]
      }
    
      if(Array.isArray(arrayItems) && type && checkValueType(arrayItems[0] as ArrayType, type)){
        return arrayItems;
      }
      else{
        return [];
      }
    }
    else{
      return [];
    }
  }

const ArrayProvider = ({type, objectKeys, children}: ArrayProviderProps) => {
    const {value} = useContext(JSONContext)!;

    const initialItems = value !== undefined? getInitialValue(value, objectKeys, type) : [];
console.log("i", initialItems, value)
    return(
        <ArrayContext.Provider value={{arrayItems: initialItems}}>
            {children}
        </ArrayContext.Provider>
    )
}

export default ArrayProvider;