import { Box, Tag, TagLabel, TagRightIcon, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import Mapper from "../../mapper";
import { EditIcon } from "@chakra-ui/icons";

const ArrayWrapper = ({ data, objectKey, objectKeys }: any) => {
  const [edit, setEdit] = useState(false);
  return (
    <>
      {edit ? (
        <Box display="flex">
            <Box w="90%">
                <Mapper data={data} objectKey={objectKey} objectKeys={objectKeys} setEdit={setEdit} />
            </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="center">
          {objectKey ? (
            <>
              <Tag colorScheme="blue" variant="outline">
                <TagLabel>{objectKey}</TagLabel>
              </Tag>
              <Text mx="10px">:</Text>
            </>
          ) : null}
          <Box>
            <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
                <TagLabel>Array</TagLabel>
                <TagRightIcon as={EditIcon} cursor="pointer" onClick={() => setEdit(true)} />
            </Tag>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ArrayWrapper;
