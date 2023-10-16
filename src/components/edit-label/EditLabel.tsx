import {
  Box,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useLayoutEffect, useState } from "react";

import LabelOptions from "./LabelOptions";
import { OptionType } from "./type";

interface EditLabelPropsType {
  options: OptionType[];
  setOptions: React.Dispatch<React.SetStateAction<OptionType[]>>;
}

export const EditLabel = ({ options, setOptions }: EditLabelPropsType) => {
  const [currentOption, setCurrentOption] = useState<OptionType>();

  const [editMode, setEditMode] = useState(false);

  useLayoutEffect(() => {
    const clonedOptions = [
      { colorCode: "#797e93", label: "", isDeletable: false, labelUseCount: 1 },
      ...options.slice(),
    ];
    setOptions(clonedOptions);
    setCurrentOption(clonedOptions[0]);
  }, []);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSetCurrentOption = (option: OptionType) => {
    if ((currentOption as OptionType).colorCode !== options[0].colorCode) {
      --(currentOption as OptionType).labelUseCount;
      option.labelUseCount++;
    }
    setCurrentOption(option);
  };

  return (
    <Box>
      <Popover onClose={() => setEditMode(false)}>
        <PopoverTrigger>
          <Input
            bgColor={
              currentOption
                ? (currentOption as OptionType).colorCode
                : "#797e93"
            }
            value={currentOption ? (currentOption as OptionType).label : ""}
            cursor="pointer"
            readOnly
          />
        </PopoverTrigger>
        <PopoverContent
          width="fit-content"
          pt="16px"
          pb="8px"
          boxShadow="0 8px 16px 0 rgb(0 0 0 / 32%)"
        >
          <PopoverArrow />
          <PopoverBody p="0">
            <LabelOptions
              options={options}
              setOptions={setOptions}
              editMode={editMode}
              handleEditMode={handleEditMode}
              handleSetCurrentOption={handleSetCurrentOption}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
