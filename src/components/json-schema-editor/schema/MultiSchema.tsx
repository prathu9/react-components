import { JSONSchema7 } from "json-schema";

type MultiSchemaProps = {
    objectKey: string,
    subSchema: JSONSchema7[]
}

const MultiSchema = ({objectKey, subSchema}: MultiSchemaProps) => {
    console.log("multischema", objectKey, subSchema);
    return(
        <div>
            {"MultiSchema"}
        </div>
    )
}

export default MultiSchema;