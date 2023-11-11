import { Box, Radio, RadioGroup, Button } from "@chakra-ui/react";
import {useEffect, useState} from "react";

type BooleanValueWrapperProp = {
    initialValue: boolean,
    updateValue: (newValue: boolean) => void
}


const BooleanValueWrapper = ({initialValue, updateValue}: BooleanValueWrapperProp) => {
    const [value, setValue] = useState<string>(initialValue === true? "true":"false");

    useEffect(() => {
        console.log("boolean", initialValue)
        setValue(initialValue === true? "true":"false");
    },[initialValue])

    const handleChange = (newValue: string) => {
        setValue(newValue);
    }

    const handleUpdate = () => {
        const newValue = value === "true"? true : false;

        updateValue(newValue);
    }

    return(
        <Box display="flex" alignItems="center">
            <RadioGroup value={value} onChange={handleChange}>
                <Radio value="true" size="lg" mr="10px" colorScheme="blue" border="1px solid cyan">
                    true
                </Radio>
                <Radio value="false" size="lg" colorScheme="blue" border="1px solid cyan">
                    false
                </Radio>
            </RadioGroup>
            <Button ml="20px" onClick={handleUpdate}>Add</Button>
        </Box>
    )
}

export default BooleanValueWrapper;