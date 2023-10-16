import "./DateRange.css";

import classnames from "classnames";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import minMax from "dayjs/plugin/minMax";
import { useEffect, useState } from "react";

import { Calendar } from "./Calendar";
import coreStyles from "./styles";
import { CalendarPropsType, DateRangeType, RangeShape } from "./types";
import { findNextRangeIndex, generateStyles } from "./utils";

export interface DateRangePropsType extends CalendarPropsType {
  onChange: (a: any, isSinglevalue?: any) => void;
  onRangeFocusChange?: (a: any) => void;
  className?: string;
  ranges: RangeShape[];
  moveRangeOnFirstSelection?: boolean;
  retainEndDateOnFirstSelection?: boolean;
  definedRangePreview?: DateRangeType | null;
}

export const DateRange = ({
  classNames = {},
  ...props
}: DateRangePropsType) => {
  const ranges = props.ranges ?? [];
  const moveRangeOnFirstSelection = props.moveRangeOnFirstSelection ?? false;
  const retainEndDateOnFirstSelection =
    props.retainEndDateOnFirstSelection ?? false;
  const rangeColors = props.rangeColors ?? ["#3d91ff", "#3ecf8e", "#fed14c"];
  const disabledDates = props.disabledDates ?? [];
  const maxDate = props.maxDate ?? dayjs(new Date()).add(20, "years").toDate();
  const [focusedRangeValue, setFocusedRangeValue] = useState(
    props.initialFocusedRange || [findNextRangeIndex(ranges), 0],
  );
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const { definedRangePreview } = props;

    if (definedRangePreview !== undefined) {
      updatePreview(
        definedRangePreview
          ? calcNewSelection(
              definedRangePreview as DateRangeType,
              typeof definedRangePreview === "string",
            )
          : null,
      );
    }
  }, [props.definedRangePreview]);

  const styles = generateStyles([coreStyles, classNames]);

  const calcNewSelection = (
    dateValue: DateRangeType | Date,
    isSingleValue = true,
  ) => {
    const focusedRange = props.focusedRange || focusedRangeValue;
    const { onChange } = props;
    const focusedRangeIndex = focusedRange[0];
    const selectedRange = ranges[focusedRangeIndex];
    if (!selectedRange || !onChange) return {};
    let { startDate, endDate } = selectedRange;
    const now = new Date();
    dayjs.extend(minMax);
    dayjs.extend(isBetween);
    let nextFocusRange;
    if (!isSingleValue) {
      startDate = (dateValue as DateRangeType).startDate;
      endDate = (dateValue as DateRangeType).endDate;
    } else if (focusedRange[1] === 0) {
      // startDate selection
      const dayOffset = dayjs(endDate || now).diff(startDate!, "days");
      const calculateEndDate = () => {
        if (moveRangeOnFirstSelection) {
          return dayjs(dateValue as Date)
            .add(dayOffset, "day")
            .toDate();
        }
        if (retainEndDateOnFirstSelection) {
          if (!endDate || dayjs(dateValue as Date).isBefore(dayjs(endDate))) {
            return endDate;
          }
          return dateValue;
        }
        return dateValue || now;
      };
      startDate = dateValue as Date;
      endDate = calculateEndDate() as Date;
      if (maxDate) endDate = dayjs.min(dayjs(endDate), dayjs(maxDate)).toDate();
      nextFocusRange = [focusedRange[0], 1];
    } else {
      endDate = dateValue as Date;
    }

    // reverse dates if startDate before endDate
    let isStartDateSelected = focusedRange[1] === 0;
    if (dayjs(endDate!).isBefore(dayjs(startDate!))) {
      isStartDateSelected = !isStartDateSelected;
      [startDate, endDate] = [endDate, startDate];
    }

    const inValidDatesWithinRange = (disabledDates as Date[]).filter(
      (disabledDate: number | Date) =>
        dayjs(disabledDate).isBetween(startDate!, endDate!),
    );

    if (inValidDatesWithinRange.length > 0) {
      if (isStartDateSelected) {
        startDate = dayjs(
          dayjs
            .max(inValidDatesWithinRange.map((dateInst) => dayjs(dateInst)))
            .toDate(),
        )
          .add(1, "day")
          .toDate();
      } else {
        endDate = dayjs(
          dayjs
            .min(inValidDatesWithinRange.map((dateInst) => dayjs(dateInst)))
            .toDate(),
        )
          .add(-1, "day")
          .toDate();
      }
    }

    if (!nextFocusRange) {
      const nextFocusRangeIndex = findNextRangeIndex(ranges, focusedRange[0]);
      nextFocusRange = [nextFocusRangeIndex, 0];
    }
    return {
      wasValid: !(inValidDatesWithinRange.length > 0),
      range: { startDate, endDate },
      nextFocusRange,
    };
  };

  const setSelection = (value: any, isSingleValue: any) => {
    const { onChange, onRangeFocusChange } = props;
    const focusedRange: any = props.focusedRange || focusedRangeValue;
    const focusedRangeIndex = focusedRange[0];
    const selectedRange = ranges[focusedRangeIndex];
    if (!selectedRange) return;
    const newSelection = calcNewSelection(value, isSingleValue);
    onChange({
      [selectedRange.key || `range${focusedRangeIndex + 1}`]: {
        ...selectedRange,
        ...newSelection.range,
      },
    });
    setFocusedRangeValue(newSelection.nextFocusRange!);
    setPreview(null);
    onRangeFocusChange?.(newSelection.nextFocusRange!);
  };

  const handleRangeFocusChange = (focusedRange: any) => {
    setFocusedRangeValue(focusedRange);
    props.onRangeFocusChange?.(focusedRange);
  };

  const updatePreview = (val?: any) => {
    if (!val) {
      setPreview(null);
      return;
    }
    const focusedRange = props.focusedRange || focusedRangeValue;

    const color: any =
      ranges[focusedRange[0]]?.color || rangeColors![focusedRange[0]];
    setPreview({ ...val.range, color });
  };

  return (
    <Calendar
      {...props}
      focusedRange={focusedRangeValue}
      onRangeFocusChange={handleRangeFocusChange}
      preview={preview}
      onPreviewChange={(dayValue: any) => {
        if (dayValue) {
          updatePreview(calcNewSelection(dayValue));
        }
      }}
      displayMode="dateRange"
      className={classnames(styles.dateRangeWrapper, props.className)}
      onChange={setSelection}
      updateRange={(val) => setSelection(val, false)}
    />
  );
};
