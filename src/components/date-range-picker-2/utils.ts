import classnames from "classnames";
import dayjs from "dayjs";

export function calcFocusDate(currentFocusedDate: any, props: any) {
  const { shownDate, date, months, ranges, focusedRange, displayMode } = props;
  // find primary date according the props

  let targetInterval;
  if (displayMode === "dateRange") {
    const range = ranges[focusedRange[0]] || {};
    targetInterval = {
      start: range.startDate,
      end: range.endDate,
    };
  } else {
    targetInterval = {
      start: date,
      end: date,
    };
  }
  targetInterval.start = dayjs(targetInterval.start || new Date())
    .startOf("month")
    .toDate();
  targetInterval.end = dayjs(targetInterval.end || targetInterval.start)
    .endOf("month")
    .toDate();

  const targetDate =
    targetInterval.start || targetInterval.end || shownDate || new Date();
  // initial focus

  if (!currentFocusedDate) return shownDate || targetDate;

  // // just return targetDate for native scrolled calendars
  // if (props.scroll.enabled) return targetDate;
  if (dayjs(targetInterval.start).diff(targetInterval.end, "months") > months) {
    // don't change focused if new selection in view area
    return currentFocusedDate;
  }

  return targetDate;
}

export function findNextRangeIndex(ranges: any, currentRangeIndex = -1) {
  const nextIndex = ranges.findIndex(
    (range: any, i: number) =>
      i > currentRangeIndex && range.autoFocus !== false && !range.disabled,
  );
  if (nextIndex !== -1) return nextIndex;
  return ranges.findIndex(
    (range: any) => range.autoFocus !== false && !range.disabled,
  );
}

export function generateStyles(sources: any[]) {
  if (!sources.length) return {};
  const generatedStyles = sources
    .filter((source) => Boolean(source))
    .reduce((styles, styleSource) => {
      Object.keys(styleSource).forEach((key) => {
        styles[key] = classnames(styles[key], styleSource[key]);
      });
      return styles;
    }, {});
  return generatedStyles;
}

export function getMonthDisplayRange(
  date: number | Date,
  dateOptions: { locale: any },
  fixedHeight?: boolean,
) {
  const startDateOfMonth = dayjs(date).startOf("month").toDate();
  const endDateOfMonth = dayjs(date).endOf("month").toDate();
  const startDateOfCalendar = dayjs(startDateOfMonth).startOf("week").toDate();
  let endDateOfCalendar = dayjs(endDateOfMonth).endOf("week").toDate();
  if (
    fixedHeight &&
    dayjs(endDateOfCalendar).diff(startDateOfCalendar, "days") <= 34
  ) {
    endDateOfCalendar = dayjs(endDateOfCalendar).add(7, "days").toDate();
  }
  return {
    start: startDateOfCalendar,
    end: endDateOfCalendar,
    startDateOfMonth,
    endDateOfMonth,
  };
}

export function getDaysArray(start: Date, end: Date) {
  let arr;
  let dt;
  for (
    arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(new Date(dt));
  }
  return arr;
}
