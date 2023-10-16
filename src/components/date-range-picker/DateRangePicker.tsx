import "./DateRangePicker.css";

import { Box } from "@chakra-ui/react";
import classnames from "classnames";
import { useState } from "react";

import { DateRange, DateRangePropsType } from "./DateRange";
import { DefinedRange } from "./DefinedRange";
import coreStyles from "./styles";
import { DateRangeType } from "./types";
import { findNextRangeIndex, generateStyles } from "./utils";

export interface DateRangePickerPropsType extends DateRangePropsType {
  className?: string;
}

export const DateRangePicker = (props: DateRangePickerPropsType) => {
  const [focusedRange, setFocusedRange] = useState([
    findNextRangeIndex(props.ranges),
    0,
  ]);

  const [definedRangePreview, setDefinedRangePreview] = useState<
    DateRangeType | undefined | null
  >();

  const styles = generateStyles([coreStyles, props.classNames]);

  return (
    <Box className={classnames(styles.dateRangePickerWrapper, props.className)}>
      <DefinedRange
        {...props}
        focusedRange={focusedRange}
        onPreviewChange={(value) => setDefinedRangePreview(value)}
        className=""
      />
      <DateRange
        {...props}
        onRangeFocusChange={(focusedRange) => setFocusedRange(focusedRange)}
        focusedRange={focusedRange}
        className={undefined}
        definedRangePreview={definedRangePreview}
      />
    </Box>
  );
};
