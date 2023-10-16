import { Box, Button, Grid } from "@chakra-ui/react";
import { useId, useState } from "react";

import EditLabelInput from "./EditLabelInput";
import { OptionType } from "./type";

interface LabelOptionsPropsType {
  options: OptionType[];
  setOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
  editMode: boolean;
  handleEditMode: () => void;
  handleSetCurrentOption: (option: OptionType) => void;
}

const EditIcon = () => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      width="20"
      height="20"
      aria-hidden="true"
      className="icon_component monday-style-button--left-icon icon_component--no-focus-style"
    >
      <path
        d="M13.8542 3.59561C13.8541 3.59568 13.8542 3.59555 13.8542 3.59561L4.80915 12.6503L3.81363 16.189L7.35682 15.1957L16.4018 6.14C16.4746 6.06722 16.5161 5.96795 16.5161 5.86503C16.5161 5.76221 16.4753 5.6636 16.4026 5.59083C16.4025 5.59076 16.4026 5.59091 16.4026 5.59083L14.4038 3.59568C14.3309 3.52292 14.232 3.48197 14.1289 3.48197C14.026 3.48197 13.927 3.52297 13.8542 3.59561ZM12.8051 2.54754C13.1562 2.19695 13.6324 2 14.1289 2C14.6254 2 15.1016 2.19693 15.4527 2.54747C15.4527 2.5475 15.4527 2.54745 15.4527 2.54747L17.4515 4.54263C17.8026 4.89333 18 5.36914 18 5.86503C18 6.36091 17.8028 6.8365 17.4518 7.18719L8.26993 16.3799C8.17984 16.4701 8.06798 16.5356 7.94516 16.57L2.94244 17.9724C2.68418 18.0448 2.4069 17.9723 2.21725 17.7829C2.0276 17.5934 1.95512 17.3165 2.02768 17.0586L3.43296 12.0633C3.46728 11.9413 3.53237 11.8301 3.62199 11.7404L12.8051 2.54754Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
};

const colorPickerInitialValues = [
  "#DAAFE9",
  "#C7DBF5",
  "#AAD5FB",
  "#ADE5DA",
  "#B0EDC3",
  "#FDF0A4",
  "#F8D6A2",
  "#C47ADA",
  "#90BAEE",
  "#75BAFA",
  "#72D5BF",
  "#73DE8C",
  "#FBE66E",
  "#F5B969",
  "#AE44B7",
  "#5E7ABD",
  "#5E7ABC",
  "#4DACA9",
  "#63B75A",
  "#EDBD4A",
  "#EC9740",
  "#501B87",
  "#021B6B",
  "#0C2794",
  "#337277",
  "#2F6A52",
  "#AE802F",
  "#AD6127",
];

const LabelOptions = ({
  options,
  setOptions,
  editMode,
  handleEditMode,
  handleSetCurrentOption,
}: LabelOptionsPropsType) => {
  const uniqueId = useId();
  const [colorPickerValues, setColorPickerValues] = useState([
    ...colorPickerInitialValues,
  ]);

  const handleOnChange = (e: any, index: any) => {
    const clonedOptions = options.slice();
    clonedOptions[index].label = e.target.value;
    setOptions(clonedOptions);
  };

  const getRandomColorPickerValue = () => {
    const randomlyPickedColor =
      colorPickerValues[
        Math.ceil(Math.random() * (colorPickerValues.length - 1 - 0) + 0)
      ];

    const filteredColorValues = colorPickerValues.filter(
      (colorValue) => colorValue !== randomlyPickedColor,
    );

    setColorPickerValues(filteredColorValues);

    return randomlyPickedColor;
  };

  const handleAddNewLabel = () => {
    if (colorPickerValues.length !== 0) {
      const newLabelObj = {
        colorCode: getRandomColorPickerValue(),
        label: "Add Label",
        labelUseCount: 0,
      };

      const updatedOptions = [...options, newLabelObj];
      setOptions(updatedOptions);
    }
  };

  const handleColorChange = (color: string, index: number) => {
    const filteredColorValues = colorPickerInitialValues.filter(
      (colorValue) =>
        (colorValue !== color && colorPickerValues.includes(colorValue)) ||
        colorValue === options[index].colorCode,
    );

    setColorPickerValues(filteredColorValues);

    const clonedOptions = options.slice();
    clonedOptions[index].colorCode = color;
    setOptions(clonedOptions);
  };

  const handleRemoveLabel = (colorCode: string, labelUseCount: number) => {
    const filteredColorValues = colorPickerInitialValues.filter(
      (colorValue) => {
        return (
          colorPickerValues.includes(colorValue) || colorValue === colorCode
        );
      },
    );

    setColorPickerValues(filteredColorValues);

    if (labelUseCount === 0) {
      const filteredOptions = options.filter(
        (option) => option.colorCode !== colorCode,
      );
      setOptions(filteredOptions);
    } else {
      console.log("can't delete");
    }
  };

  return (
    <Box>
      <Box maxW="680px">
        {!editMode ? (
          <Grid
            templateRows="repeat(6, auto)"
            gridAutoFlow="column"
            gap="2"
            px="20px"
          >
            {options.map((option: any, index: number) => {
              const uniqueKey = uniqueId + 1 + index;
              return (
                <Box
                  w="152px"
                  h="32px"
                  textAlign="center"
                  lineHeight="32px"
                  key={uniqueKey}
                  color="#fff"
                  bgColor={option.colorCode}
                  onClick={() => handleSetCurrentOption(option)}
                  cursor="pointer"
                >
                  {option.label}
                </Box>
              );
            })}
          </Grid>
        ) : (
          <Grid
            width="100%"
            templateRows="repeat(6, auto)"
            pb="20px"
            gridAutoFlow="column"
            gridColumnGap="5"
            gridRowGap="2"
            overflowX="auto"
            overflowY="hidden"
            px="20px"
            css={{
              "&::-webkit-scrollbar": {
                width: "4px",
                height: "12px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#cecece",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              },
            }}
          >
            {options.map((option, index) => {
              const uniqueKey = uniqueId + 2 + index;
              return (
                <Box key={uniqueKey} w="152px" h="32px">
                  <EditLabelInput
                    handleColorChange={handleColorChange}
                    handleOnChange={handleOnChange}
                    handleRemoveLabel={handleRemoveLabel}
                    index={index}
                    option={option}
                    colorPickerValues={colorPickerValues}
                  />
                </Box>
              );
            })}
            {colorPickerValues.length !== 0 ? (
              <Button w="152px" h="32px" onClick={handleAddNewLabel}>
                New Label
              </Button>
            ) : null}
          </Grid>
        )}
      </Box>
      <Box pt="10px" px="15px">
        <Box w="100%" h="100%" borderTop="1px solid #c0c0c0">
          {!editMode ? (
            <Button
              w="100%"
              h="32px"
              bgColor="transparent"
              onClick={handleEditMode}
              leftIcon={<EditIcon />}
            >
              Edit Label
            </Button>
          ) : (
            <Button
              w="100%"
              h="32px"
              bgColor="transparent"
              onClick={handleEditMode}
            >
              Apply
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LabelOptions;
