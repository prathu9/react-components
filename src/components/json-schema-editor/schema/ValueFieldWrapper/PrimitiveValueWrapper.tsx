import InputWrapper from "../ValueFieldWrapper/InputWrapper";
import {useState} from "react";
import {Tag, TagRightIcon, TagLabel, Box, Text} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

type PrimitiveValueWrapperProps = {
    type: "string" | "number",
    updateValue: (newValue: string | number) => void
}

const PrimitiveValueWrapper = ({type, updateValue}: PrimitiveValueWrapperProps) => {
    const [primitiveValue , setPrimitiveValue] = useState<string | number>();
    const [edit, setEdit] = useState(true);

    const updatePrimitiveValue = (newValue: string | number) => {
        setPrimitiveValue(newValue);
        updateValue(newValue);
        setEdit(false);
    }

    const enableEditValue = () => {
        setEdit(true);
    }

    return(
        <>
            {
               edit? 
               <InputWrapper type={type} updateValue={updatePrimitiveValue} />:
                <Box display="flex" alignItems="center">
                    <Text>Value</Text>
                    <Text mx="10px">:</Text>
                    <Tag size="lg" variant="outline" colorScheme="blue">
                    <TagLabel fontSize="15px">{primitiveValue}</TagLabel>
                    <TagRightIcon as={EditIcon} cursor="pointer" onClick={enableEditValue}/>
                </Tag>
                </Box>
            }
        </>
    )
}

export default PrimitiveValueWrapper;