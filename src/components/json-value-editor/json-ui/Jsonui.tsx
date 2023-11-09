import { useContext } from "react";
import Mapper from "./mapper";
import {JSONContext, JSONContextType} from "./JsonProvider";

const JsonUI = () => {
    const {jsonSchema} = useContext(JSONContext) as JSONContextType;

    if(jsonSchema.type === "object"){
        return(
            <Mapper schema={jsonSchema} objectKeys={["root"]} />
        )
    }

    return(
        <Mapper schema={jsonSchema} />
    )
}

export default JsonUI;