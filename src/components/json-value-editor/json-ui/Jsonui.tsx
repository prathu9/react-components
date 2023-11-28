import { useContext } from "react";
import Mapper from "./mapper";
import {JSONContext, JSONContextType} from "./JsonProvider";

const JsonUI = () => {
    const {jsonSchema} = useContext(JSONContext) as JSONContextType;

    if(jsonSchema.type === "object" || jsonSchema.type === "array"){
        return(
            <Mapper data={jsonSchema} objectKeys={["root"]} />
        )
    }

    return(
        <Mapper data={jsonSchema} />
    )
}

export default JsonUI;