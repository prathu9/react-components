import { JSONSchema7 } from "json-schema";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  chakra,
  Checkbox,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import KeyInput from "./KeyInput";
import SelectType from "./SelectType";
import { ChangeEvent, useContext } from "react";
import { SchemaContext } from "./SchemaProvider";

type GroupSchemaProps = {
  objectKey: string;
  subSchema: JSONSchema7[];
  objectKeys?: string[];
};

const GroupSchema = ({
  objectKey,
  subSchema,
  objectKeys = [],
}: GroupSchemaProps) => {
  console.log("multischema", objectKey, subSchema);
  const { setSchema, uniqueKey, setUniqueKey } = useContext(SchemaContext)!;

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // setSchema((draftSchema) => {
    //   let currObj = draftSchema as any;
    //   const newType = e.target.value;
    //   for (let i = 1; i < objectKeys.length; i++) {
    //     currObj = currObj[objectKeys[i] as string];
    //   }

    //   currObj["type"] = newType;

    //   if (newType === "array") {
    //     delete currObj["properties"];
    //     currObj["items"] = {
    //       type: "string",
    //     };
    //   } else {
    //     delete currObj["properties"];
    //   }
    // });
  }

  return (
    <Accordion w="100%" allowToggle>
      <AccordionItem>
        <AccordionButton px="0" display="flex" justifyContent="space-between">
          <Box w="80%" display="flex" alignItems="center">
            {objectKeys.length !== 0 ? (
              <>
                <KeyInput
                  flex="1"
                  mr="5px"
                  value={objectKey}
                  objectKeys={objectKeys}
                />{" "}
                :
              </>
            ) : null}
            <SelectType
                flex="2"
                w="70%"
                mx="5px"
                value="group"
                onChange={handleTypeChange}
            />
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel></AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default GroupSchema;
