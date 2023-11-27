import { JSONSchema7 } from "json-schema";
import {create} from "zustand";
import {produce} from "immer";

type PrimitiveType = string | number | boolean | null;

interface ObjectType {
  [key: string]: PrimitiveType | ObjectType | PrimitiveType[];
}

type JSONType = ObjectType | PrimitiveType;

type EditStatusType = {
  id: string,
  isEditable: boolean
}

type StoreType = {
    jsonSchema: JSONSchema7,
    jsonValue: JSONType,
    edit: EditStatusType[],
    setEdit: (id: string, editState: boolean) => void,
    loadJson: (jsonSchema: JSONSchema7) => void,
    setJsonValue: (jsonValue: JSONType) => void,
    updatePrimitiveValues: (newValue: any, objectKeys: string[]) => void,
    updateArrayValues: (newValue: any, objectKeys: string[]) => void
}

const getInitialValue = (jsonSchema: JSONSchema7) => {
    if(jsonSchema.type==="string"){
      return "";
    }
    else if(jsonSchema.type === "number"){
      return 0;
    }
    else if(jsonSchema.type === "boolean"){
      return false;
    }
    else if(jsonSchema.type === "null"){
      return null;
    }
    else if(jsonSchema.type === "array"){
      return [];
    }
    else{
      const newObj = {} as any;
      if(jsonSchema.hasOwnProperty("properties")){
        const propKeys = Object.keys(jsonSchema.properties!);
        for(let i = 0; i < propKeys.length; i++){
          newObj[propKeys[i] as string] = getInitialValue(jsonSchema.properties![propKeys[i]] as JSONSchema7)
        }
      }
     
      return newObj;
    }
  }
  

const useStore = create<StoreType>((set) => ({
    jsonSchema: {},
    jsonValue: {},
    edit: [],
    setEdit: (id, editState) => set(produce((state) => {
      const index = state.edit.findIndex((item: EditStatusType) => item.id === id)
      if(index > -1){
        state.edit[0].editState = editState;
      }
      else{
        state.edit.push({
          id,
          editState
        })
      }
    })),
    loadJson: (jsonSchema: JSONSchema7) => set((state) => ({
        ...state,
        jsonSchema,
        jsonValue: getInitialValue(jsonSchema)
    })),
    setJsonValue: (jsonValue: JSONType) => set((state) => ({
        ...state,
        jsonValue
    })),
    updatePrimitiveValues: (newValue, objectKeys) => set(produce((state) => {
        let jsonValue = state.jsonValue;
        if(typeof jsonValue !== "object"){
          jsonValue = newValue;
          return jsonValue;
        }
        else if(Array.isArray(jsonValue)){
          console.log("root", jsonValue[0])
        }
        else if(typeof jsonValue === "object"){
          let currObj = jsonValue!;
  
          for(let i = 1; i < objectKeys.length; i++){
              const key = objectKeys[i];
              const value = currObj[key];
              if(value && typeof value === "object" && !Array.isArray(value)){
                currObj = value;
              }
          }
  
          const lastKey = objectKeys[objectKeys.length - 1];
          currObj[lastKey] = newValue;
        }
        else{
          console.log(JSON.stringify(jsonValue))
        }
      }))
    ,
    updateArrayValues: (newValue, objectKeys) => set(produce((state) => {
        const lastKey = objectKeys[objectKeys.length - 1];
        if(Array.isArray(state)){
          // console.log("d",JSON.stringify(state))
          if(Array.isArray(state[0]) && !isNaN(parseInt(lastKey))){
              state[parseInt(lastKey)] = newValue;
          }
          else{
            state = newValue;
          }
        }
        else if(typeof state === "object"){
          let currObj = state!;
  
          for(let i = 1; i < objectKeys.length; i++){
              const key = objectKeys[i];
              const value = currObj[key];
              if(value && typeof value === "object" && !Array.isArray(value)){
                currObj = value;
              }
          }
          currObj[lastKey] = newValue;
        }
      }))
}))

export default useStore;