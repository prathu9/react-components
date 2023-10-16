import { Button, Grid, GridItem } from "@chakra-ui/react";
import { type Strategy } from "@floating-ui/react-dom";
import { useId } from "react";

interface EditLabelColorPicker {
  strategy: Strategy;
  floating: (node: HTMLElement | null) => void;
  handleSelectColor: (color: string) => void;
  x: number | null;
  y: number | null;
  colorPickerValues: string[];
}

const EditLabelColorPicker = ({
  strategy,
  floating,
  handleSelectColor,
  x,
  y,
  colorPickerValues,
}: EditLabelColorPicker) => {
  const id = useId();

  return (
    <Grid
      position={strategy}
      top={`${y ?? "40px"}`}
      left={`${x ?? 0}`}
      bgColor="white"
      templateRows="repeat(auto, 1fr)"
      templateColumns="repeat(4, 1fr)"
      borderWidth="1px"
      borderRadius="md"
      mt="4px"
      p="4"
      gap={2}
      ref={floating}
      zIndex={100}
    >
      {colorPickerValues.map((color, colorIndex) => {
        const keyValue = `row-${colorIndex}}`;
        return (
          <GridItem key={keyValue}>
            <Button
              id={`colorpicker-button-${id}-${colorIndex}`}
              minW="24px"
              maxW="24px"
              display="inline-block"
              h="24px"
              borderRadius=".2rem"
              bgColor={color}
              p="0"
              // onKeyDown={(event) =>
              //   handleKeyboardNav(event, rowIndex, columnIndex)
              // }
              onClick={() => handleSelectColor(color)}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default EditLabelColorPicker;
