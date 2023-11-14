import { Box, Button, Tag, TagLabel, TagRightIcon, Text } from "@chakra-ui/react";
import { useState } from "react";
import Mapper from "../../mapper";
import { EditIcon } from "@chakra-ui/icons";

const ObjectWrapper = ({ data, objectKey, objectKeys }: any) => {
  const [edit, setEdit] = useState(false);

  return (
    <>
      {edit ? (
        <Box display="flex">
          <Box w="100%" position="relative">
            <Mapper
              data={data}
              objectKey={objectKey}
              objectKeys={[...objectKeys, objectKey]}
              setEdit={setEdit}
            />
          </Box>
        </Box>
      ) : (
        <Box display="flex" alignItems="center">
          {objectKey ? (
            <>
              <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
                <TagLabel>{objectKey}</TagLabel>
              </Tag>
              <Text mx="10px">:</Text>
            </>
          ) : null}
          <Box>
            <Tag px="10px" py="5px" colorScheme="blue" variant="outline">
                <TagLabel>Object</TagLabel>
                <TagRightIcon as={EditIcon} cursor="pointer" onClick={() => setEdit(true)} />
            </Tag>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ObjectWrapper;
