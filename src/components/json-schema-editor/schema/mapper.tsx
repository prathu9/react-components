import { JSONSchema7 } from "json-schema";
import ArraySchema from "./Array-schema";
import ObjectSchema from "./Object-schema";
import OtherSchema from "./Other-schema";

type MapperProps = {
    data: JSONSchema7,
    objectKey: string,
    objectKeys?: string[]
}

const schemaComp = (data: JSONSchema7, objectKey:string, objectKeys?:string[]) => {
    if(data.type === "object"){
        const properties = data.properties;
        return <ObjectSchema properties={properties} objectKey={objectKey} objectKeys={objectKeys}/>;
    }
    
    if(data.type === "array"){
        return <ArraySchema items={data.items} objectKey={objectKey} objectKeys={objectKeys} />   
    }

    return (
        <>
            <OtherSchema type={data.type} objectKey={objectKey} objectKeys={objectKeys} />
        </>
    )
}

const Mapper = ({data, objectKey, objectKeys=[]}: MapperProps) => {

    const item = schemaComp(data, objectKey, objectKeys);

    return item;
}

export default Mapper;