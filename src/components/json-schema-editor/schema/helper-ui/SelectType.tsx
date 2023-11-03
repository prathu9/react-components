import { Select, SelectProps } from "@chakra-ui/react";
import { MouseEvent } from "react";

const SelectType = (props: SelectProps) => {
  return (
    <Select
      onClick={(e: MouseEvent<HTMLSelectElement>) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      {...props}
    >
      <option value="string">String</option>
      <option value="number">Number</option>
      <option value="object">Object</option>
      <option value="array">Array</option>
      <option value="boolean">Boolean</option>
      <option value="null">Null</option>
      <option value="group">Group</option>
    </Select>
  );
};

export default SelectType;
