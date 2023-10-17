import { ChangeEvent, MouseEvent } from "react"
import {Select} from "@chakra-ui/react"


type SelectTypeProps = {
    value: string,
    handleTypeChange: (e: ChangeEvent<HTMLSelectElement>) => void
    width?: string
}

const SelectType = ({value,handleTypeChange, width}: SelectTypeProps) => {
    return(
        <Select
          value={value}
          w={width}
          onChange={handleTypeChange}
          onClick={(e: MouseEvent<HTMLSelectElement>) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          placeholder="select type"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
          <option value="boolean">Boolean</option>
          <option value="null">Null</option>
        </Select>
    )
}

export default SelectType