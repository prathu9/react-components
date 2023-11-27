import { useContext } from "react";
import Mapper from "./mapper";
import {JSONContext, JSONContextType} from "./JsonProvider";
import useStore from "./store/store";

const JsonUI = () => {
    const jsonSchema = useStore(state => state.jsonSchema);

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