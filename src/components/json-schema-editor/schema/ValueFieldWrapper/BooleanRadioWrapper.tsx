import { Radio, RadioGroup, Stack, Box, Text } from "@chakra-ui/react";
import { useState } from "react";

const BooleanRadioWrapper = ({ updateValue }: any) => {
  const [value, setValue] = useState<string>("false");

  const handleChange = (value: string) => {
    setValue(value);
    updateValue(value === "true"? true:false);
  };

  return (
    <Box display="flex" alignItems="center">
      <Text>Value</Text>
      <Text mx="10px">:</Text>
      <RadioGroup my="10px" value={value}  onChange={handleChange}>
        <Stack direction="row">
          <Radio colorScheme="blue" borderColor="#555" value="true">True</Radio>
          <Radio colorScheme="blue" borderColor="#555"  value="false">False</Radio>
        </Stack>
      </RadioGroup>
    </Box>
  );
};

export default BooleanRadioWrapper;
