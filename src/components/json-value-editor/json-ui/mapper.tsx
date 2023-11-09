import { JSONSchema7 } from "json-schema";
import ArrayComponent from "./components/Array-component";
import ObjectComponent from "./components/Object-component";
import PrimitiveComponent from "./components/PrimitiveComponent";

const jsonComp = (schema: JSONSchema7, objectKeys?: string[]) => {

    if(schema.type === "object"){
        return(
            <ObjectComponent />
        )
    }

    if(schema.type === "array"){
        return (
            <ArrayComponent />
        )
    }

    return (
        <PrimitiveComponent />
    )
}

type MapperProps = {
    schema: JSONSchema7;
    objectKeys?: string[];
    objectKey?: string;
    requiredProperties?: string[];
};


const Mapper = ({schema, objectKeys}: MapperProps) => {
    const item = jsonComp(schema, objectKeys);

    return item;
}

export default Mapper;