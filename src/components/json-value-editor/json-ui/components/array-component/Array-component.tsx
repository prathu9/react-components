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
  Tag,
  TagLabel,
  Text,
  Button,
} from "@chakra-ui/react";
import ArrayItems from "./ArrayItems";
import { ChangeEvent, useState, Dispatch } from "react";
import Mapper from "../../mapper";
import ArrayObjectWrapper from "./ArrayObjectWrapper";

type ArrayComponentDataType = JSONSchema7TypeName | JSONSchema7TypeName[];

type ArrayComponentProps = {
  data: JSONSchema7;
  objectKeys?: string[];
  objectKey?: string;
  setEdit?: Dispatch<React.SetStateAction<boolean>>;
};

const ArrayComponent = ({
  data,
  objectKeys = [],
  objectKey = "",
  setEdit,
}: ArrayComponentProps) => {
  if (data.items === undefined) {
    return <chakra.h1>items does not exist</chakra.h1>;
  }

  const updateArrayValues = (newValue: any) => {
    // console.log(newValue);
  };

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
                <Text fontSize="15px">{isExpanded ? "Array" : "[...]"}</Text>
              </Box>
              {setEdit ? (
                <Button
                  mx="15px"
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => setEdit(false)}
                >
                  Ok
                </Button>
              ) : null}
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="0">
              {(data.items as JSONSchema7).type === "string" ? (
                <ArrayItems itemType="string" updateValue={updateArrayValues} />
              ) : null}
              {(data.items as JSONSchema7).type === "number" ? (
                <ArrayItems itemType="number" updateValue={updateArrayValues} />
              ) : null}
              {(data.items as JSONSchema7).type === "boolean" ? (
                <ArrayItems
                  itemType="boolean"
                  updateValue={updateArrayValues}
                />
              ) : null}
              {(data.items as JSONSchema7).type === "null" ? (
                <ArrayItems itemType="null" updateValue={updateArrayValues} />
              ) : null}
              {(data.items as JSONSchema7).type === "object" ? (
                // <Mapper data={data.items as JSONSchema7} objectKeys={[...objectKeys, "items"]} />
                <ArrayObjectWrapper
                  data={data.items as JSONSchema7}
                  updateValue={updateArrayValues}
                />
              ) : null}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default ArrayComponent;
