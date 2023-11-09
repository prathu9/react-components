import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box
} from "@chakra-ui/react";
import { JSONSchema7 } from "json-schema";

type ObjectComponentProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
};

const ObjectComponent = ({
  data,
  objectKeys = [],
  objectKey = "",
}: ObjectComponentProps) => {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
            <Box flex="1" textAlign="left">
            object
            </Box>
            <AccordionIcon />
        </AccordionButton>
        <AccordionPanel></AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ObjectComponent;
