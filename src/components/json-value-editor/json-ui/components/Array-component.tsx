import { JSONSchema7, JSONSchema7TypeName } from "json-schema";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Input,
  Button,
} from "@chakra-ui/react";
import ArrayItems from "./ArrayItems";
import { ChangeEvent, useState } from "react";

type ArrayComponentDataType = JSONSchema7TypeName | JSONSchema7TypeName[];

type ArrayComponentProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
};

const ArrayComponent = ({
  data,
  objectKeys = [],
  objectKey = "",
}: ArrayComponentProps) => {
  if (data.items === undefined) {
    return <chakra.h1>items does not exist</chakra.h1>;
  }

  const updateArrayValues = (newValue: any) => {
    console.log(newValue);
  };

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            Array
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          {(data.items as JSONSchema7).type === "string" ? (
            <ArrayItems itemType="string" updateValue={updateArrayValues} />
          ) : null}
           {(data.items as JSONSchema7).type === "number" ? (
            <ArrayItems itemType="number" updateValue={updateArrayValues} />
          ) : null}
          {(data.items as JSONSchema7).type === "boolean" ? (
            <ArrayItems itemType="boolean" updateValue={updateArrayValues} />
          ) : null}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ArrayComponent;
