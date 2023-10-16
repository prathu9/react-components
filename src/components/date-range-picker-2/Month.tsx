import { Box, Flex } from "@chakra-ui/react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useId } from "react";

import { DayCell } from "./DayCell";
import { MonthPropsType } from "./types";
import { getDaysArray, getMonthDisplayRange } from "./utils";

function renderWeekdays(
  styles: any,
  dateOptions: { locale: any; weekStartsOn?: any },
  weekdayDisplayFormat: any,
) {
  const now = new Date();
  const uniqueId = useId();

  return (
    <Flex p="0">
      {getDaysArray(
        dayjs(now).startOf("week").toDate(),
        dayjs(now).endOf("week").toDate(),
      ).map((day, i) => {
        const keyValue = i + uniqueId;
        return (
          <Flex
            as="span"
            justifyContent="center"
            fontWeight="400"
            color="#849095"
            basis="calc(100% / 7)"
            key={keyValue}
          >
            {dayjs(day).format(weekdayDisplayFormat)}
          </Flex>
        );
      })}
    </Flex>
  );
}

export const Month = (props: MonthPropsType) => {
  const now = new Date();
  dayjs.extend(isBetween);
  const {
    displayMode,
    focusedRange,
    drag,
    styles,
    disabledDates,
    disabledDay,
  } = props;
  const minDate = props.minDate && dayjs(props.minDate).startOf("day").toDate();
  const maxDate = props.maxDate && dayjs(props.maxDate).endOf("day").toDate();
  const monthDisplay = getMonthDisplayRange(
    props.month,
    props.dateOptions!,
    props.fixedHeight,
  );
  let { ranges } = props;
  if (displayMode === "dateRange" && drag.status) {
    const { startDate, endDate } = drag.range;
    ranges = ranges.map((range, i) => {
      if (i !== focusedRange![0]) return range;
      return {
        ...range,
        startDate,
        endDate,
      };
    });
  }

  const showPreview = props.showPreview && !drag.disablePreview;
  const uniqueId = useId();

  return (
    <Box className={styles.month} style={props.style}>
      {props.showMonthName ? (
        <Box className={styles.monthName}>
          {dayjs(props.month).format(props.monthDisplayFormat)}
        </Box>
      ) : null}
      {props.showWeekDays &&
        renderWeekdays(styles, props.dateOptions!, props.weekdayDisplayFormat)}
      <Box className={styles.days} onMouseLeave={props.onMouseLeave}>
        {getDaysArray(monthDisplay.start, monthDisplay.end).map(
          (day, index) => {
            const isStartOfMonth = dayjs(day).isSame(
              monthDisplay.startDateOfMonth,
              "day",
            );
            const isEndOfMonth = dayjs(day).isSame(
              monthDisplay.endDateOfMonth,
              "day",
            );
            const isOutsideMinMax = Boolean(
              (minDate && dayjs(day).isBefore(minDate, "day")) ||
                (maxDate && dayjs(day).isAfter(maxDate, "day")),
            );
            const isDisabledSpecifically = disabledDates.some(
              (disabledDate: any) => dayjs(disabledDate).isSame(day, "day"),
            );
            const isDisabledDay = disabledDay(day);
            const keyValue = uniqueId + index;
            return (
              <DayCell
                {...props}
                dayDisplayFormat={props.dayDisplayFormat}
                ranges={ranges}
                day={day}
                preview={showPreview ? props.preview : null}
                isWeekend={dayjs(day).day() === 6 || dayjs(day).day() === 0}
                isToday={dayjs(day).isSame(now, "day")}
                isStartOfWeek={dayjs(day).isSame(
                  dayjs(day).startOf("week").toDate(),
                  "day",
                )}
                isEndOfWeek={dayjs(day).isSame(
                  dayjs(day).endOf("week").toDate(),
                  "day",
                )}
                isStartOfMonth={isStartOfMonth}
                isEndOfMonth={isEndOfMonth}
                key={keyValue}
                disabled={
                  isOutsideMinMax || isDisabledSpecifically || isDisabledDay
                }
                isPassive={
                  !dayjs(day).isBetween(
                    monthDisplay.startDateOfMonth,
                    monthDisplay.endDateOfMonth,
                    null,
                    "[]",
                  )
                }
                styles={styles}
                onMouseDown={props.onDragSelectionStart}
                onMouseUp={props.onDragSelectionEnd}
                onMouseEnter={props.onDragSelectionMove}
                dragRange={drag.range}
                drag={drag.status}
              />
            );
          },
        )}
      </Box>
    </Box>
  );
};
