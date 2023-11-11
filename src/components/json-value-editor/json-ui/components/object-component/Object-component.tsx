import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Tag,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import { JSONSchema7, JSONSchema7Object } from "json-schema";
import { v4 as uuidv4 } from "uuid";
import Mapper from "../../mapper";

type ObjectComponentProps = {
  data: JSONSchema7Object;
  objectKeys?: string[];
  objectKey?: string;
};

const ObjectComponent = ({
  data,
  objectKeys = [],
  objectKey = "",
}: ObjectComponentProps) => {
  const properties = Object.keys(data.properties as {});
  // console.log(properties, data["properties"]["cars"])
  return (
    <Accordion allowToggle>
      <AccordionItem px="0">
        {({ isExpanded }) => (
          <>
            <AccordionButton px="0">
              <Box display="flex" flex="1" textAlign="left" alignItems="center">
                {objectKey ? (
                  <>
                    <Tag
                      px="10px"
                      py="5px"
                      colorScheme="blue"
                      variant="outline"
                    >
                      <TagLabel fontSize="15px">{objectKey}</TagLabel>
                    </Tag>
                    <Text mx="10px">:</Text>
                  </>
                ) : null}
                <Text fontSize="15px">
                  {isExpanded?"Object":"{...}"}
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="0">
              <chakra.h1>properties:</chakra.h1>
              <Box>
                {properties.map((property) => (
                  <Box key={uuidv4()} my="10px">
                    <Mapper
                      data={
                        (data["properties"] as JSONSchema7Object)[
                          property
                        ] as JSONSchema7
                      }
                      objectKey={property}
                      objectKeys={[...objectKeys, property]}
                    />
                  </Box>
                ))}
              </Box>
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default ObjectComponent;
