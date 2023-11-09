import { JSONSchema7 } from "json-schema";

type PrimitiveComponentProps = {
    data: JSONSchema7,
    objectKeys?: string[],
    objectKey?: string
 }

const PrimitiveComponent = ({data, objectKeys=[], objectKey=""}: PrimitiveComponentProps) => {
    return(
        <h1>primitive</h1>
    )
}

export default PrimitiveComponent;