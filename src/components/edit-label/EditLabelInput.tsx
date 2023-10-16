import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  useOutsideClick,
} from "@chakra-ui/react";
import { autoUpdate, flip, offset, useFloating } from "@floating-ui/react-dom";
import { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiColorFill } from "react-icons/bi";

import EditLabelColorPicker from "./EditLabelColorPicker";
import { OptionType } from "./type";

interface EditLabelInputType {
  handleColorChange: (color: string, index: number) => void;
  handleOnChange: (e: any, index: number) => void;
  handleRemoveLabel: (colorCode: string, labelUseCount: number) => void;
  index: number;
  option: OptionType;
  colorPickerValues: string[];
}

const EditLabelInput = ({
  index,
  option,
  handleRemoveLabel,
  handleOnChange,
  handleColorChange,
  colorPickerValues,
}: EditLabelInputType) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const labelInputRef: React.RefObject<HTMLDivElement> = useRef(null);
  const { x, y, reference, floating, strategy } = useFloating({
    placement: "bottom-start",
    middleware: [offset(5), flip()],
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: true,
      }),
  });

  const handleSelectColor = (color: string) => {
    handleColorChange(color, index);
    toggleColorPicker();
  };

  const toggleColorPicker = () => {
    setShowColorPicker((currState) => !currState);
  };

  useOutsideClick({
    ref: labelInputRef,
    handler: () => setShowColorPicker(false),
  });

  return (
    <>
      <Box
        w="100%"
        h="100%"
        ref={labelInputRef}
        sx={{
          "&:hover button": {
            display: "inline-flex",
          },
        }}
      >
        <Box w="100%" h="100%" pos="relative">
          <InputGroup w="100%" h="100%">
            <InputLeftElement
              w="24px"
              h="24px"
              ml="4px"
              top="50%"
              transform="translateY(-50%)"
              lineHeight="24px"
              color="#fff"
              bgColor={option.colorCode}
              borderRadius="0.375rem"
              cursor="pointer"
              ref={reference}
              onClick={() => toggleColorPicker()}
            >
              <BiColorFill />
            </InputLeftElement>
            <Input
              value={option.label}
              w="100%"
              h="100%"
              onChange={(e) => handleOnChange(e, index)}
              placeholder={index === 0 ? "Default Label" : "Add Label"}
            />
          </InputGroup>
          <Button
            display="none"
            pos="absolute"
            minW="10px"
            w="14px"
            h="14px"
            top="50%"
            right="-15px"
            p="0px"
            justifyContent="center"
            alignItems="center"
            transform="translateY(-50%)"
            bgColor="transparent"
            borderRadius="5px"
            onClick={() =>
              handleRemoveLabel(option.colorCode, option.labelUseCount)
            }
          >
            <AiOutlineClose size={10} />
          </Button>
        </Box>
        {showColorPicker && (
          <EditLabelColorPicker
            x={x}
            y={y}
            handleSelectColor={handleSelectColor}
            strategy={strategy}
            floating={floating}
            colorPickerValues={colorPickerValues}
          />
        )}
      </Box>
    </>
  );
};

export default EditLabelInput;
