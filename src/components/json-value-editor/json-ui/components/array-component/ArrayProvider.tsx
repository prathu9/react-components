import { createContext, ReactNode, useContext } from "react";
import {JSONContext} from "../../JsonProvider";
import { DataType } from "../../type";
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
      let obj = value;
      for(let i = 1; i < objectKeys.length; i++){
        const key = objectKeys[i];
        const value = obj[key];
        if(value && typeof value === "object" && !Array.isArray(value)){
          obj = value;
        }
      }
      const lastKey = objectKeys[objectKeys.length - 1];
      const arrayItems = obj[lastKey];

      if(Array.isArray(arrayItems) && type && checkValueType(arrayItems[0], type)){
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