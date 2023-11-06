import InputWrapper from "../ValueFieldWrapper/InputWrapper";

type PrimitiveValueWrapperProps = {
    type: "string" | "number",
    updateValue: (newValue: string) => void
}

const PrimitiveValueWrapper = ({type, updateValue}: PrimitiveValueWrapperProps) => {
    return(
        <InputWrapper type={type} updateValue={updateValue} />
    )
}

export default PrimitiveValueWrapper;