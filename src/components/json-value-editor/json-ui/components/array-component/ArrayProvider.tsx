import { createContext, ReactNode, useContext } from "react";
import {JSONContext} from "../../JsonProvider";
import { ArrayType, DataType, ObjectType, PrimitiveType } from "../../type";
import { checkValueType } from "../../utils";

type ArrayContextType = {
    arrayItems: DataType[]
}

export const ArrayContext = createContext<ArrayContextType>({
    arrayItems: []
});

type ArrayProviderProps = {
    type: DataType,
    objectKeys: string[],
    children: ReactNode;
}

const getInitialValue = (objectKeys: string[], type?: DataType) => {
    const {value} = useContext(JSONContext)!;

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

    const initialItems = getInitialValue(objectKeys, type);

    return(
        <ArrayContext.Provider value={{arrayItems: initialItems}}>
            {children}
        </ArrayContext.Provider>
    )
}

export default ArrayProvider;