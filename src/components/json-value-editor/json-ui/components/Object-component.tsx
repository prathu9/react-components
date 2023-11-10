import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra
} from "@chakra-ui/react";
import { JSONSchema7, JSONSchema7Object } from "json-schema";
import { v4 as uuidv4 } from "uuid";

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
  console.log(properties)
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
            <Box flex="1" textAlign="left">
              object
            </Box>
            <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
            <chakra.h1>properties:</chakra.h1>
            <Box>
              {
                properties.map(property => (
                  <h1 key={uuidv4()}>{property}</h1>
                ))
              }
            </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ObjectComponent;
