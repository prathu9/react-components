import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Input
} from "@chakra-ui/react";
import { useId, useRef, useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { useFloating, flip, offset, autoUpdate } from "@floating-ui/react-dom";

const colorPickerValues = [
  ["#DAAFE9", "#C7DBF5", "#AAD5FB", "#ADE5DA", "#B0EDC3", "#FDF0A4", "#F8D6A2"],
  ["#C47ADA", "#90BAEE", "#75BAFA", "#72D5BF", "#73DE8C", "#FBE66E", "#F5B969"],
  ["#AE44B7", "#5E7ABD", "#5E7ABC", "#4DACA9", "#63B75A", "#EDBD4A", "#EC9740"],
  ["#501B87", "#021B6B", "#0C2794", "#337277", "#2F6A52", "#AE802F", "#AD6127"],
];

export type ColorPickerProps = {
  selectedColor: string;
  setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
};

export const ColorPicker = ({
  selectedColor,
  setSelectedColor,
}: ColorPickerProps) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const colorPickerDropdownRef: React.RefObject<HTMLDivElement> = useRef(null);
  const id = useId();
  const {x, y, reference, floating, strategy} = useFloating({
    placement: "bottom-start",
    middleware: [offset(5), flip()],
    whileElementsMounted: (reference, floating, update) =>
                            autoUpdate(reference, floating, update, {
                              animationFrame: true,
                            }),
  });

  const toggleColorPicker = () => {
    setShowColorPicker((currState) => !currState);
  };

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    toggleColorPicker();
  };

  const hideColorPickerDropdownOnEscape = (event: React.KeyboardEvent) => {
    if (event.code === "Escape") {
      toggleColorPicker();
    }
  };

  const handleKeyboardNav = (
    event: React.KeyboardEvent,
    currentRowIndex: number,
    currentColumnIndex: number,
  ) => {
    let nextRowIndex;
    let prevRowIndex;
    let nextColumnIndex;
    let prevColumnIndex;
    switch (event.code) {
      case "ArrowUp":
        prevRowIndex = currentRowIndex - 1;
        if (prevRowIndex > -1) {
          document
            .getElementById(
              `colorpicker-button-${id}-${prevRowIndex}-${currentColumnIndex}`,
            )
            ?.focus();
        }
        break;
      case "ArrowDown":
        nextRowIndex = currentRowIndex + 1;
        if (nextRowIndex < colorPickerValues.length) {
          document
            .getElementById(
              `colorpicker-button-${id}-${nextRowIndex}-${currentColumnIndex}`,
            )
            ?.focus();
        }
        break;
      case "ArrowLeft":
        prevColumnIndex = currentColumnIndex - 1;
        if (prevColumnIndex > -1) {
          document
            .getElementById(
              `colorpicker-button-${id}-${currentRowIndex}-${prevColumnIndex}`,
            )
            ?.focus();
        }
        break;
      case "ArrowRight":
        nextColumnIndex = currentColumnIndex + 1;
        if (nextColumnIndex < colorPickerValues[0].length) {
          document
            .getElementById(
              `colorpicker-button-${id}-${currentRowIndex}-${nextColumnIndex}`,
            )
            ?.focus();
        }
        break;
      default:
    }
  };

  return (
    <Container
      maxW="280px"
      display="flex"
      position="relative"
      onKeyDownCapture={hideColorPickerDropdownOnEscape}
      ref={colorPickerDropdownRef}
    >
      <Button
        minW="unset"
        p="4px"
        borderWidth="1px"
        boxShadow="0 0 0 2px #fff"
        _focus={{
          boxShadow: "0 0 0 2px #18A0FB",
          borderColor: "#18A0FB",
          outline: 0,
        }}
        sx={{
          "& svg": {
            width: "0.5em",
            marginLeft: "2px",
          },
        }}
        onClick={toggleColorPicker}
        ref={reference}
      >
        <Box w="24px" h="24px" borderRadius=".2rem" bgColor={selectedColor} />
        <AiFillCaretDown />
      </Button>
      <Input
        ml="0.2rem"
        pl="3px"
        pr="3px"
        _focus={{
          boxShadow: "0 0 0 2px #18A0FB",
          borderColor: "#18A0FB",
          outline: 0,
        }}
        value={selectedColor}
        onClick={() => setShowColorPicker(false)}
        onChange={(event) => setSelectedColor(event.target.value)}
      />
      {showColorPicker && (
        <Grid
          position={strategy}
          top={`${y ?? "40px"}`}
          left={`${x ?? 0}`}
          bgColor="white"
          templateRows="repeat(4, 1fr)"
          borderWidth="1px"
          borderRadius="md"
          mt="4px"
          p="4"
          gap={2}
          ref={floating}
        >
          {colorPickerValues.map((colorArray, rowIndex) => {
            const keyValue = `row-${rowIndex}}`;
            return (
              <Grid key={keyValue} templateColumns="repeat(7, 1fr)" gap={2}>
                {colorArray.map((color, columnIndex) => {
                  return (
                    <GridItem key={color}>
                      <Button
                        id={`colorpicker-button-${id}-${rowIndex}-${columnIndex}`}
                        minW="24px"
                        maxW="24px"
                        display="inline-block"
                        h="24px"
                        borderRadius=".2rem"
                        bgColor={color}
                        p="0"
                        onKeyDown={(event) =>
                          handleKeyboardNav(event, rowIndex, columnIndex)
                        }
                        onClick={() => handleSelectColor(color)}
                      />
                    </GridItem>
                  );
                })}
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};