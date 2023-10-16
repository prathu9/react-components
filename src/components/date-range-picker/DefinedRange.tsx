import { Box, Button, useColorModeValue } from "@chakra-ui/react";
import cx from "classnames";
import { useId, useState } from "react";

import { defaultInputRanges, defaultStaticRanges } from "./defaultRanges";
import { InputRangeField } from "./InputRangeField";
import styles from "./styles";
import { RangeShape } from "./types";

export interface DefinedRangeType {
  inputRanges?: any[];
  staticRanges?: any[];
  ranges?: RangeShape[];
  focusedRange: number[];
  onPreviewChange: (d?: any) => void;
  onChange?: (d: any) => void;
  footerContent?: any;
  headerContent?: any;
  rangeColors?: string[];
  className: string;
  renderStaticRangeLabel?: (d: any) => void;
}

export const DefinedRange = (props: DefinedRangeType) => {
  const ranges = props.ranges ?? [];
  const rangeColors = props.rangeColors ?? ["#3d91ff", "#3ecf8e", "#fed14c"];
  const focusedRange = props.focusedRange ?? [0, 0];
  const inputRanges = props.inputRanges ?? defaultInputRanges;
  const staticRanges = props.staticRanges ?? defaultStaticRanges;
  const [rangeOffset, setRangeOffset] = useState(0);
  const [focusedInput, setFocusedInput] = useState(-1);
  const borderDefinedRange = useColorModeValue(
    "1px solid #eff2f7",
    "1px solid #47476b",
  );
  const uniqueId = useId();

  const handleRangeChange = (range: any) => {
    const { onChange } = props;

    const selectedRange = ranges[focusedRange[0]];
    if (!onChange || !selectedRange) return;
    onChange({
      [selectedRange.key || `range${focusedRange[0] + 1}`]: {
        ...selectedRange,
        ...range,
      },
    });
  };

  const getRangeOptionValue = (option: any) => {
    if (typeof option.getCurrentValue !== "function") {
      return "";
    }

    const selectedRange = ranges[focusedRange[0]] || {};
    return option.getCurrentValue(selectedRange) || "";
  };

  const getSelectedRange = (ranges: any[], staticRange: any) => {
    const focusedRangeIndex = ranges.findIndex((range) => {
      if (!range.startDate || !range.endDate || range.disabled) return false;
      return staticRange.isSelected(range);
    });
    const selectedRange = ranges[focusedRangeIndex];
    return { selectedRange, focusedRangeIndex };
  };

  const {
    headerContent,
    footerContent,
    onPreviewChange,
    className,
    renderStaticRangeLabel,
  } = props;

  return (
    <Box
      fontSize="12px"
      w="226px"
      borderRight={borderDefinedRange}
      className={cx(styles.definedRangesWrapper, className)}
    >
      {headerContent}
      <Box>
        {staticRanges.map((staticRange: any, i: any) => {
          const { selectedRange, focusedRangeIndex } = getSelectedRange(
            ranges,
            staticRange,
          );
          let labelContent;

          if (staticRange.hasCustomRendering) {
            labelContent = renderStaticRangeLabel
              ? renderStaticRangeLabel(staticRange)
              : "";
          } else {
            labelContent = staticRange.label;
          }
          const keyValue = uniqueId + i;

          return (
            <Button
              type="button"
              w="100%"
              bgColor="transparent"
              borderBottom={borderDefinedRange}
              outline="none"
              p="0"
              display="block"
              className={cx(styles.staticRange, {
                [styles.staticRangeSelected]: Boolean(selectedRange),
              })}
              style={{
                color: selectedRange
                  ? selectedRange.color || rangeColors[focusedRangeIndex]
                  : null,
              }}
              key={keyValue}
              onClick={() => handleRangeChange(staticRange.range(props))}
              onFocus={() => onPreviewChange?.(staticRange.range(props))}
              onMouseOver={() => onPreviewChange?.(staticRange.range(props))}
              onMouseLeave={() => {
                onPreviewChange?.(null);
              }}
            >
              <Box
                as="span"
                tabIndex={-1}
                display="block"
                w="100%"
                p="10px 20px"
                textAlign="left"
                _hover={{
                  bgColor: "grey.600",
                }}
                _focus={{
                  bgColor: "#eff2f7",
                }}
              >
                {labelContent}
              </Box>
            </Button>
          );
        })}
      </Box>
      <Box p="10px 0">
        {inputRanges.map((rangeOption, i) => {
          const keyValue = uniqueId + i;
          return (
            <InputRangeField
              key={keyValue}
              styles={styles}
              label={rangeOption.label}
              onFocus={() => {
                setFocusedInput(i);
                setRangeOffset(0);
              }}
              onBlur={() => setRangeOffset(0)}
              onChange={(value) =>
                handleRangeChange(rangeOption.range(value, props))
              }
              value={getRangeOptionValue(rangeOption)}
            />
          );
        })}
      </Box>
      {footerContent}
    </Box>
  );
};
