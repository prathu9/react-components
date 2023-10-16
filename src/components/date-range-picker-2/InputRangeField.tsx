import { Box, Input } from "@chakra-ui/react";
import { ChangeEvent, memo, useState } from "react";

const MIN = 0;
const MAX = 99999;

interface InputRangeFieldPropsType {
  value: string;
  onChange: (value?: string | number) => void;
  label: string;
  styles: Record<string, string>;
  onBlur: () => void;
  onFocus: () => void;
}

export const InputRangeField = memo(
  (props: InputRangeFieldPropsType) => {
    const [inputValue, setInputValue] = useState<string | number>(props.value);
    // const value = props.value ?? "";
    const placeholder = props.value ?? "-";

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { onChange } = props;

      let value = parseInt(e.target.value, 10);
      value = Number.isNaN(value) ? 0 : Math.max(Math.min(MAX, value), MIN);
      setInputValue(value);
      onChange(value);
    };

    const { label, styles, onBlur, onFocus } = props;

    return (
      <Box alignItems="center" p="5px 20px">
        <Input
          w="30px"
          h="30px"
          p="0"
          mr="10px"
          borderRadius="4px"
          textAlign="center"
          borderColor="#dee7eb"
          placeholder={placeholder}
          value={inputValue}
          min={MIN}
          max={MAX}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          _hover={{
            bordeColor: "#b4bfc4",
            outline: 0,
            color: "#333",
          }}
          _focus={{
            bordeColor: "#b4bfc4",
            outline: 0,
            color: "#333",
          }}
        />
        <Box as="span" className={styles.inputRangeLabel}>
          {label}
        </Box>
      </Box>
    );
  },
  (prevProps: InputRangeFieldPropsType, nextProps: InputRangeFieldPropsType) =>
    prevProps.value !== nextProps.value || prevProps.label !== nextProps.label,
);

InputRangeField.displayName = "InputRangeField";
