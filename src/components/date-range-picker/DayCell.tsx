import "./DayCell.css";

import { Box, Button, useColorModeValue } from "@chakra-ui/react";
import classnames from "classnames";
import dayjs from "dayjs";
import { useId, useState } from "react";

import { DayCellType, RangeShape } from "./types";

export const DayCell = (props: DayCellType) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const uniqueId = useId();
  const handleKeyEvent = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const { day, onMouseDown, onMouseUp } = props;
    if (["Space", "Enter"].includes(event.code)) {
      if (event.type === "keydown") onMouseDown(day);
      else onMouseUp(day);
    }
  };
  const handleMouseEvent = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.FocusEvent<HTMLButtonElement>,
  ) => {
    const {
      day,
      disabled,
      onPreviewChange,
      onMouseEnter,
      onMouseDown,
      onMouseUp,
    } = props;
    if (disabled && onPreviewChange) {
      onPreviewChange();
      return;
    }

    switch (event.type) {
      case "mouseenter":
        onMouseEnter(day);
        onPreviewChange(day);
        setHover(true);
        break;
      case "blur":
      case "mouseleave":
        setHover(false);
        break;
      case "mousedown":
        setActive(true);
        onMouseDown(day);
        break;
      case "mouseup":
        event.stopPropagation();
        setActive(false);
        onMouseUp(day);
        break;
      case "focus":
        onPreviewChange(day);
        break;
      default:
    }
  };

  const getClassNames = () => {
    const {
      isPassive,
      isToday,
      isWeekend,
      isStartOfWeek,
      isEndOfWeek,
      isStartOfMonth,
      isEndOfMonth,
      disabled,
      styles,
    } = props;

    return classnames(styles.day, {
      [styles.dayPassive]: isPassive,
      [styles.dayDisabled]: disabled,
      [styles.dayToday]: isToday,
      [styles.dayWeekend]: isWeekend,
      [styles.dayStartOfWeek]: isStartOfWeek,
      [styles.dayEndOfWeek]: isEndOfWeek,
      [styles.dayStartOfMonth]: isStartOfMonth,
      [styles.dayEndOfMonth]: isEndOfMonth,
      [styles.dayHovered]: hover,
      [styles.dayActive]: active,
    });
  };

  const renderPreviewPlaceholder = () => {
    const { preview, day, styles } = props;
    if (!preview) return null;
    const startDate = preview.startDate
      ? dayjs(preview.startDate).endOf("day").toDate()
      : null;
    const endDate = preview.endDate
      ? dayjs(preview.endDate).startOf("day").toDate()
      : null;
    const isInRange =
      (!startDate || dayjs(day).isAfter(startDate, "day")) &&
      (!endDate || dayjs(day).isBefore(endDate, "day"));
    const isStartEdge = !isInRange && dayjs(day).isSame(startDate, "day");
    const isEndEdge = !isInRange && dayjs(day).isSame(endDate, "day");

    return (
      <Box
        as="span"
        className={classnames({
          [styles.dayStartPreview]: isStartEdge,
          [styles.dayInPreview]: isInRange,
          [styles.dayEndPreview]: isEndEdge,
        })}
        style={{ color: preview.color }}
      />
    );
  };

  const renderSelectionPlaceholders = () => {
    const { styles, ranges, day } = props;
    if (props.displayMode === "date") {
      const isSelected = dayjs(props.day).isSame(props.date, "day");
      return isSelected ? (
        <Box
          as="span"
          className={styles.selected}
          style={{ color: props.color }}
        />
      ) : null;
    }

    const inRanges = ranges.reduce((result: any[], range: RangeShape) => {
      let { startDate } = range;
      let { endDate } = range;
      if (startDate && endDate && dayjs(endDate).isBefore(startDate, "day")) {
        [startDate, endDate] = [endDate, startDate];
      }
      startDate = startDate ? dayjs(startDate).endOf("day").toDate() : null;
      endDate = endDate ? dayjs(endDate).startOf("day").toDate() : null;
      const isInRange =
        (!startDate || dayjs(day).isAfter(startDate, "day")) &&
        (!endDate || dayjs(day).isBefore(endDate, "day"));
      const isStartEdge = !isInRange && dayjs(day).isSame(startDate, "day");
      const isEndEdge = !isInRange && dayjs(day).isSame(endDate, "day");
      if (isInRange || isStartEdge || isEndEdge) {
        return [
          ...result,
          {
            isStartEdge,
            isEndEdge,
            isInRange,
            ...range,
          },
        ];
      }
      return result;
    }, []);

    return inRanges.map((range, i) => {
      const keyValue = i + uniqueId;
      return (
        <Box
          as="span"
          key={keyValue}
          className={classnames({
            [styles.startEdge]: range.isStartEdge,
            [styles.endEdge]: range.isEndEdge,
            [styles.inRange]: range.isInRange,
          })}
          style={{ color: range.color || props.color }}
        />
      );
    });
  };

  const { dayContentRenderer } = props;
  const passiveDayColor = useColorModeValue("#d5dce0", "#627784");
  const dayColor = useColorModeValue("#000", "#fff");

  return (
    <Button
      type="button"
      onMouseEnter={handleMouseEvent}
      onMouseLeave={handleMouseEvent}
      onFocus={handleMouseEvent}
      onMouseDown={handleMouseEvent}
      onMouseUp={handleMouseEvent}
      onBlur={handleMouseEvent}
      onPauseCapture={handleMouseEvent}
      onKeyDown={handleKeyEvent}
      onKeyUp={handleKeyEvent}
      className={getClassNames()}
      {...(props.disabled || props.isPassive ? { tabIndex: -1 } : {})}
      display="flex"
      bgColor="transparent"
      fontSize="16px"
      lineHeight="3.000em"
      padding="0"
      userSelect="none"
      _focus={{
        bgColor: "transparent",
      }}
      _hover={{
        bgColor: "transparent",
      }}
    >
      {renderSelectionPlaceholders()}
      {renderPreviewPlaceholder()}
      <Box as="span" className={props.styles.dayNumber}>
        {dayContentRenderer?.(props.day) || (
          <Box
            as="span"
            fontFamily="'Open Sans', -apple-system, sans-serif"
            color={props.isPassive ? passiveDayColor : dayColor}
          >
            {dayjs(props.day).format(props.dayDisplayFormat)}
          </Box>
        )}
      </Box>
    </Button>
  );
};
