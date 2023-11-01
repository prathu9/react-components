import {Box, Input, Text} from "@chakra-ui/react"

const InputWrapper = () => {
    return(
        <Box display="flex" alignItems="center">
            <Text>Value</Text>
            <Text mx="10px">:</Text>
            <Input w="50%" />
        </Box>
    )
}

export default InputWrapper;