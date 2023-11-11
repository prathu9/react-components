import {Box, Tag, TagLabel, TagRightIcon} from "@chakra-ui/react"
import { EditIcon } from "@chakra-ui/icons"

type PrimitiveValueProps = {
    value: any,
    handleEdit: () => void
}

const PrimitiveValue = ({value, handleEdit}: PrimitiveValueProps) => {
    return (
        <Box>
            <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
                <TagLabel fontSize="15px">{value}</TagLabel>
                <TagRightIcon as={EditIcon} cursor="pointer" onClick={handleEdit} />
            </Tag>
        </Box>
    )
}

export default PrimitiveValue