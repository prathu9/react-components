import { JSONSchema7 } from "json-schema";



type ObjectComponentProps = {
   data: JSONSchema7,
   objectKeys?: string[],
   objectKey?: string
}

const ObjectComponent = ({data}:  ObjectComponentProps) => {
    return(
        <h1>Object</h1>
    )
}

export default ObjectComponent;