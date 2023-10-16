import { FC } from "react";

import Select, {
  SelectActionGroup,
  SelectControl,
  SelectedList,
  SelectInput,
  SelectLabel,
  SelectList,
} from "./Select";
import { MultiSelectProps } from "./type";

export const MultiSelect: FC<MultiSelectProps> = ({
  label,
  labelProps,
  controlProps,
  listProps,
  selectedListProps,
  actionGroupProps,
  ...props
}) => {
  return (
    <Select {...props}>
      {label && <SelectLabel {...labelProps}>{label}</SelectLabel>}
      <SelectControl {...controlProps}>
        <SelectedList {...selectedListProps}>
          <SelectInput />
        </SelectedList>
        <SelectActionGroup {...actionGroupProps} />
      </SelectControl>
      <SelectList {...listProps} />
    </Select>
  );
};
