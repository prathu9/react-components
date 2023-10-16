import "./Calendar.css";

import { Box, Button, Flex, Select } from "@chakra-ui/react";
import classnames from "classnames";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import minMax from "dayjs/plugin/minMax";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import ReactList from "react-list";
import { shallowEqual } from "shallow-equal-object";

import { DateInput } from "./DateInput";
import { Month } from "./Month";
import coreStyles from "./styles";
import {
  AriaLabelShape,
  CalendarPropsType,
  DragType,
  RangeShape,
  ScrollAreaType,
} from "./types";
import {
  calcFocusDate,
  generateStyles,
  getDaysArray,
  getMonthDisplayRange,
} from "./utils";

const getMonthNames = () => {
  dayjs.extend(localeData);
  return dayjs.months();
};

export const Calendar = (props: CalendarPropsType) => {
  const locale = props.locale ?? "en";
  const showMonthArrow = props.showMonthArrow ?? true;
  const showMonthAndYearPickers = props.showMonthAndYearPickers ?? true;
  const disabledDates = props.disabledDates ?? [];
  const disabledDay = props.disabledDay ?? ((d) => false);
  const uniqueId = useId();
  const focusedRange = props.focusedRange ?? [0, 0];
  const dateDisplayFormat = props.dateDisplayFormat ?? "MMM D, YYYY";
  const monthDisplayFormat = props.monthDisplayFormat ?? "MMM YYYY";
  const weekdayDisplayFormat = props.weekdayDisplayFormat ?? "ddd";
  const dayDisplayFormat = props.dayDisplayFormat ?? "D";
  const showDateDisplay = props.showDateDisplay ?? true;
  const showPreview = props.showPreview ?? true;
  const displayMode = props.displayMode ?? "date";
  const months = props.months ?? 1;
  const color = props.color ?? "#3d91ff";
  const scroll = props.scroll ?? {
    enabled: false,
  };
  const direction = props.direction ?? "vertical";
  const minDate = props.minDate ?? dayjs(new Date()).add(-100, "year").toDate();
  const maxDate = props.maxDate ?? dayjs(new Date()).add(20, "year").toDate();

  const rangeColors = props.rangeColors ?? ["#3d91ff", "#3ecf8e", "#fed14c"];
  const startDatePlaceholder = props.startDatePlaceholder ?? "Early";
  const endDatePlaceholder = props.endDatePlaceholder ?? "Continuous";
  const editableDateInputs = props.editableDateInputs ?? false;
  const dragSelectionEnabled = props.dragSelectionEnabled ?? true;
  const calendarFocus = props.calendarFocus ?? "forwards";
  const preventSnapRefocus = props.preventSnapRefocus ?? false;
  const ariaLabels: AriaLabelShape | undefined = props.ariaLabels ?? undefined;
  const [monthNames, setMonthNames] = useState(getMonthNames());
  const [focusedDate, setFocusedDate] = useState<number | Date | null>(
    calcFocusDate(null, props),
  );
  const [list, setList] = useState<ReactList | null>();
  const [preview, setPreview] = useState<CalendarPropsType["preview"] | null>();
  const [drag, setDrag] = useState<DragType>({
    status: false,
    range: { startDate: null, endDate: null },
    disablePreview: false,
  });
  const prevPropsRef = useRef<CalendarPropsType>();
  dayjs.extend(minMax);

  const [scrollArea, setScrollArea] = useState<ScrollAreaType | null>(null);
  const styles = generateStyles([coreStyles, props.classNames]);
  let isFirstRender = true;
  let dateOptions: { locale: any; weekStartsOn?: any } = { locale };
  const { navigatorRenderer, className, onPreviewChange } = props;

  useLayoutEffect(() => {
    setScrollArea(calcScrollArea);
  }, [setScrollArea]);

  useEffect(() => {
    // assign the ref's current value to the count Hook
    prevPropsRef.current = {
      ...props,
      calendarFocus,
      className,
      color,
      dateDisplayFormat,
      dayDisplayFormat,
      direction,
      locale,
      displayMode,
      dragSelectionEnabled,
      editableDateInputs,
      endDatePlaceholder,
      focusedRange,
      maxDate,
      minDate,
      monthDisplayFormat,
      months,
      onPreviewChange,
      preview,
      rangeColors,
      ranges: props.ranges,
      scroll,
      showDateDisplay,
      showMonthAndYearPickers,
      showMonthArrow,
      showPreview,
      startDatePlaceholder,
      weekdayDisplayFormat,
    };
  }, [props]);

  useEffect(() => {
    // setPreview(props.preview);
    if (scroll.enabled && list) {
      // prevent react-list's initial render focus problem
      setTimeout(() => focusToDate(focusedDate , scroll));
    }
  }, [list]);

  useEffect(() => {
    const propMapper = {
      dateRange: "ranges",
      date: "date",
    };
    const targetProp = propMapper[props.displayMode!];

    if (
      props[targetProp as keyof typeof props] !==
      prevPropsRef.current![targetProp as keyof typeof prevPropsRef.current]
    ) {
      updateShownDate(props);
    }

    if (
      prevPropsRef.current?.locale !== locale ||
      prevPropsRef.current?.weekStartsOn !== props.weekStartsOn
    ) {
      dateOptions = { locale };
      if (props.weekStartsOn !== undefined)
        dateOptions.weekStartsOn = props.weekStartsOn;
      setMonthNames(getMonthNames());
    }

    if (!shallowEqual(prevPropsRef.current?.scroll, props.scroll)) {
      setScrollArea(calcScrollArea(props));
    }
  }, [prevPropsRef.current]);

  const updateShownDate = (props: any) => {
    const newProps = props.scroll?.enabled
      ? {
          ...props,
          months: list?.getVisibleRange().length,
        }
      : props;

    const newFocus = calcFocusDate(focusedDate, newProps);

    focusToDate(newFocus, newProps);
  };

  const renderDateDisplay = () => {
    const defaultColor = rangeColors![focusedRange![0]] || color;

    return (
      <Box className={styles.dateDisplayWrapper}>
        {ranges?.map((range: RangeShape, i: number) => {
          if (
            range.showDateDisplay === false ||
            (range.disabled && !range.showDateDisplay)
          ) {
            return null;
          }
          const keyValue = i + uniqueId;
          return (
            <Flex
              grow="1"
              basis="1"
              justifyContent="space-between"
              key={keyValue}
              style={{ color: range.color || defaultColor }}
            >
              <DateInput
                isActive={
                  props.focusedRange![0] === i && props.focusedRange![1] === 0
                }
                boxShadow="0 1px 2px 0 rgba(35, 57, 66, 0.21)"
                readOnly={!editableDateInputs}
                disabled={range.disabled}
                value={range.startDate}
                placeholder={startDatePlaceholder}
                dateOptions={dateOptions}
                dateDisplayFormat={dateDisplayFormat}
                ariaLabel={
                  ariaLabels !== undefined
                    ? ariaLabels?.dateInput[
                        range.key as keyof typeof ariaLabels.dateInput
                      ].startDate
                    : ""
                }
                onChange={onDragSelectionEnd}
                onFocus={() => handleRangeFocusChange(i, 0)}
              />
              <DateInput
                isActive={
                  props.focusedRange![0] === i && props.focusedRange![1] === 1
                }
                readOnly={!editableDateInputs}
                disabled={range.disabled}
                value={range.endDate}
                placeholder={endDatePlaceholder}
                dateOptions={dateOptions}
                dateDisplayFormat={dateDisplayFormat}
                ariaLabel={
                  ariaLabels?.dateInput &&
                  ariaLabels.dateInput[
                    range.key as keyof typeof ariaLabels.dateInput
                  ].endDate
                }
                onChange={onDragSelectionEnd}
                onFocus={() => handleRangeFocusChange(i, 1)}
              />
            </Flex>
          );
        })}
      </Box>
    );
  };

  const calcScrollArea = (props?: any): ScrollAreaType => {
    if (!scroll.enabled) return { enabled: false };

    const longMonthHeight = scroll.longMonthHeight || scroll.monthHeight;

    if (direction === "vertical") {
      return {
        enabled: true,
        monthHeight: scroll.monthHeight || 245,
        longMonthHeight: longMonthHeight || 260,
        calendarHeight:
          (scroll.calendarHeight || longMonthHeight || 240) * months,
      };
    }
    return {
      enabled: true,
      monthWidth: scroll.monthWidth || 332,
      calendarWidth:
        (scroll.calendarWidth || scroll.monthWidth || 332) * months,
      monthHeight: longMonthHeight || 300,
      calendarHeight: longMonthHeight || 300,
    };
  };

  const handleScroll = () => {
    const { onShownDateChange } = props;

    const visibleMonths: number[] = list?.getVisibleRange() ?? [];
    
    // prevent scroll jump with wrong visible value
    if (visibleMonths[0] === undefined) return;
    const visibleMonth = dayjs(minDate)
      .add(visibleMonths[0] || 0, "month")
      .toDate();
      console.log("visiblemonths",visibleMonth);
    const isFocusedToDifferent = !dayjs(focusedDate).isSame(
      visibleMonth,
      "month",
    );
    if (isFocusedToDifferent && !isFirstRender) {
      setFocusedDate(visibleMonth);
      onShownDateChange?.(visibleMonth);
    }
    isFirstRender = false;
  };

  const renderMonthAndYear = (
    focusedDate: any,
    changeShownDate: any,
    props: any,
  ) => {
    const { ariaLabels } = props;
    const upperYearLimit = (
      maxDate || dayjs(new Date()).add(20, "year").toDate()
    ).getFullYear();
    const lowerYearLimit = (
      minDate || dayjs(new Date()).add(-100, "year").toDate()
    ).getFullYear();

    return (
      <Box
        onMouseUp={(e) => e.stopPropagation()}
        className={styles.monthAndYearWrapper}
      >
        {showMonthArrow ? (
          <Button
            type="button"
            w="24px"
            p="0"
            onClick={() => changeShownDate(-1, "monthOffset")}
            aria-label={
              ariaLabels !== undefined ? ariaLabels.prevButton : undefined
            }
          >
            <AiFillCaretLeft />
          </Button>
        ) : null}
        {showMonthAndYearPickers ? (
          <Flex
            fontWeight="600"
            justifyContent="center"
            alignItems="center"
            flex="1 1 auto"
            className={styles.monthAndYearPickers}
          >
            <Box as="span" ml="5px" mr="5px">
              <Select
                border="0"
                borderRadius="4px"
                outline="none"
                bgColor="transparent"
                cursor="pointer"
                textAlign="center"
                aria-label={
                  ariaLabels !== undefined ? ariaLabels.monthPicker : undefined
                }
                _hover={{
                  bgColor: "rgba(0, 0, 0, 0.07)",
                }}
                value={focusedDate.getMonth()}
                onChange={(e) => changeShownDate(e.target.value, "setMonth")}
              >
                {monthNames.map((monthName, i) => {
                  const keyValue = i + uniqueId;
                  return (
                    <option key={keyValue} value={i}>
                      {monthName}
                    </option>
                  );
                })}
              </Select>
            </Box>
            <Box as="span" className={styles.monthAndYearDivider} />
            <Box as="span" ml="5px" mr="5px">
              <Select
                border="0"
                borderRadius="4px"
                outline="none"
                bgColor="transparent"
                cursor="pointer"
                textAlign="center"
                aria-label={
                  ariaLabels !== undefined ? ariaLabels.yearPicker : undefined
                }
                _hover={{
                  bgColor: "rgba(0, 0, 0, 0.07)",
                }}
                value={focusedDate.getFullYear()}
                onChange={(e) => changeShownDate(e.target.value, "setYear")}
              >
                {new Array(upperYearLimit - lowerYearLimit + 1)
                  .fill(upperYearLimit)
                  .map((val, i) => {
                    const year = val - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
              </Select>
            </Box>
          </Flex>
        ) : (
          <Box as="span" className={styles.monthAndYearPickers}>
            {monthNames[focusedDate.getMonth()]} {focusedDate.getFullYear()}
          </Box>
        )}
        {showMonthArrow ? (
          <Button
            type="button"
            w="24px"
            p="0"
            onClick={() => changeShownDate(+1, "monthOffset")}
            aria-label={
              ariaLabels !== undefined ? ariaLabels.nextButton : undefined
            }
          >
            <AiFillCaretRight />
          </Button>
        ) : null}
      </Box>
    );
  };

  const renderWeekdays = () => {
    const now = new Date();
    return (
      <Flex p="0">
        {getDaysArray(
          dayjs(now).startOf("week").toDate(),
          dayjs(now).endOf("week").toDate(),
        ).map((day, i) => {
          const keyValue = i + uniqueId;
          return (
            <Flex
              justifyContent="center"
              fontWeight="400"
              color="#849095"
              basis="calc(100% / 7)"
              lineHeight="2.667em"
              key={keyValue}
            >
              {dayjs(day).format(weekdayDisplayFormat)}
            </Flex>
          );
        })}
      </Flex>
    );
  };

  const focusToDate = (date: any, scroll?: any, preventUnnecessary = true) => {
    if (!scroll.enabled) {
      if (preventUnnecessary && preventSnapRefocus) {
        const focusedDateDiff = dayjs(date).diff(focusedDate, "month");
        const isAllowedForward =
          calendarFocus === "forwards" && focusedDateDiff >= 0;
        const isAllowedBackward =
          calendarFocus === "backwards" && focusedDateDiff <= 0;
        if (
          (isAllowedForward || isAllowedBackward) &&
          Math.abs(focusedDateDiff) < months
        ) {
          return;
        }
      }
      setFocusedDate(date);
      return;
    }
    const targetMonthIndex = dayjs(date).diff(minDate, "month")+1;
    const visibleMonths = list?.getVisibleRange();
    
    if (preventUnnecessary && visibleMonths?.includes(targetMonthIndex)) return;
    isFirstRender = true;
    list?.scrollTo(targetMonthIndex);
    setFocusedDate(date);
  };

  const updatePreview = (val: any) => {
    if (!val) {
      setPreview(null);
      return;
    }
    const preview = {
      startDate: val,
      endDate: val,
      color: props.color,
    };
    setPreview(preview);
  };

  const changeShownDate = (value: number, mode = "set") => {
    const { onShownDateChange } = props;
    const modeMapper = {
      monthOffset: () => dayjs(focusedDate).add(value, "month").toDate(),
      setMonth: () => dayjs(focusedDate).set("month", value).toDate(),
      setYear: () => dayjs(focusedDate).set("year", value).toDate(),
      set: () => value,
    };

    const newDate = dayjs
      .min([
        dayjs.max([
          dayjs(modeMapper[mode as keyof typeof modeMapper]()),
          dayjs(minDate),
        ]),
        dayjs(maxDate),
      ])
      .toDate();

    focusToDate(newDate, scroll, false);
    onShownDateChange?.(newDate);
  };

  const handleRangeFocusChange = (rangesIndex: any, rangeItemIndex: any) => {
    props.onRangeFocusChange?.([rangesIndex, rangeItemIndex]);
  };

  const onDragSelectionStart = (date: any) => {
    const { onChange } = props;

    if (dragSelectionEnabled) {
      setDrag({
        ...drag,
        status: true,
        range: { startDate: date, endDate: date },
        disablePreview: true,
      });
    } else {
      onChange?.(date);
    }
  };

  const onDragSelectionEnd = (date: any) => {
    const { updateRange, onChange } = props;

    if (!dragSelectionEnabled) return;

    if (displayMode === "date" || !drag.status) {
      onChange?.(date);
      return;
    }
    const newRange = {
      startDate: drag.range.startDate,
      endDate: date,
    };

    const checkSameDay = () => {
      if (newRange.startDate !== null) {
        return dayjs(date).isSame(newRange.startDate, "day");
      }

      return false;
    };

    if (displayMode !== "dateRange" || checkSameDay()) {
      setDrag({
        ...drag,
        status: false,
        range: { startDate: null, endDate: null },
        disablePreview: false,
      });
      onChange?.(date);
    } else {
      setDrag({
        ...drag,
        status: false,
        range: { startDate: null, endDate: null },
        disablePreview: false,
      });
      updateRange?.(newRange);
    }
  };

  const onDragSelectionMove = (date: any) => {
    if (!drag.status || !props.dragSelectionEnabled) return;

    setDrag({
      ...drag,
      status: drag.status,
      range: { startDate: drag.range.startDate, endDate: date },
      disablePreview: true,
    });
  };

  const estimateMonthSize = (index: any, cache?: any) => {
    if (cache) {
      if (cache[index]) return cache[index];
    }
    if (direction === "horizontal") return scrollArea?.monthWidth;
    const monthStep = dayjs(minDate).add(index, "month").toDate();
    const { start, end } = getMonthDisplayRange(monthStep, dateOptions);
    const isLongMonth = dayjs(end).diff(start, "day") + 1 > 7 * 5;
    return isLongMonth ? scrollArea?.longMonthHeight : scrollArea?.monthHeight;
  };

  const monthAndYearRenderer = navigatorRenderer ?? renderMonthAndYear;

  const isVertical = direction === "vertical";

  const ranges = props.ranges?.map((range, i) => ({
    ...range,
    color: range.color || rangeColors![i] || color,
  }));
  // eslint-disable-next-line react/no-unstable-nested-components
  const ItemRenderer = (index: number, key: number | string) => {
    const monthStep = dayjs(minDate).add(index, "month").toDate();

    return (
      <Month
        {...props}
        dayDisplayFormat={dayDisplayFormat}
        weekdayDisplayFormat={weekdayDisplayFormat}
        monthDisplayFormat={monthDisplayFormat}
        showPreview={showPreview}
        onPreviewChange={onPreviewChange || updatePreview}
        preview={preview || props.preview}
        ranges={ranges ?? []}
        key={key}
        month={monthStep}
        drag={drag}
        minDate={minDate}
        maxDate={maxDate}
        dateOptions={dateOptions}
        disabledDates={disabledDates ?? []}
        disabledDay={disabledDay!}
        onDragSelectionStart={onDragSelectionStart}
        onDragSelectionEnd={onDragSelectionEnd}
        onDragSelectionMove={onDragSelectionMove}
        onMouseLeave={() => onPreviewChange?.()}
        styles={styles}
        style={
          isVertical
            ? { height: estimateMonthSize(index) }
            : {
                height: scrollArea?.monthHeight,
                width: estimateMonthSize(index),
              }
        }
        showMonthName
        showWeekDays={!isVertical}
      />
    );
  };

  return (
    <Box
      className={classnames(styles, className)}
      onMouseUp={() =>
        setDrag({
          ...drag,
          status: false,
          range: { startDate: null, endDate: null },
          disablePreview: false,
        })
      }
      onMouseLeave={() => {
        setDrag({
          ...drag,
          status: false,
          range: { startDate: null, endDate: null },
          disablePreview: false,
        });
      }}
    >
      <>
        {showDateDisplay && renderDateDisplay()}
        {monthAndYearRenderer(focusedDate, changeShownDate, props)}
        {scroll?.enabled ? (
          <Box>
            {isVertical && renderWeekdays()}
            <Box
              className={classnames(
                styles.infiniteMonths,
                isVertical ? styles.monthsVertical : styles.monthsHorizontal,
              )}
              onMouseLeave={() => onPreviewChange?.()}
              style={{
                width:
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  scrollArea?.calendarWidth && scrollArea?.calendarWidth + 11,
                height:
                  // eslint-disable-next-line no-unsafe-optional-chaining
                  scrollArea?.calendarHeight && scrollArea?.calendarHeight + 34,
              }}
              onScroll={handleScroll}
            >
              <ReactList
                length={dayjs(dayjs(maxDate).endOf("month").toDate()).diff(
                  dayjs(minDate).startOf("month").add(-1).toDate(),
                  "month",
                )}
                threshold={500}
                type="variable"
                itemSizeEstimator={estimateMonthSize}
                axis={isVertical ? "y" : "x"}
                ref={(target) => setList(target)}
                itemRenderer={ItemRenderer}
              />
            </Box>
          </Box>
        ) : (
          <Box
            className={classnames(
              styles.months,
              isVertical ? styles.monthsVertical : styles.monthsHorizontal,
            )}
          >
            {new Array(props.months).fill(null).map((_, i) => {
              let monthStep = dayjs(focusedDate).add(i, "month").toDate();
              if (calendarFocus === "backwards") {
                monthStep = dayjs(focusedDate!)
                  .subtract(props.months! - 1 - i, "months")
                  .toDate();
              }
              const keyValue = i + uniqueId;

              return (
                <Month
                  {...props}
                  dayDisplayFormat={dayDisplayFormat}
                  weekdayDisplayFormat={weekdayDisplayFormat}
                  monthDisplayFormat={monthDisplayFormat}
                  showPreview={showPreview}
                  onPreviewChange={onPreviewChange || updatePreview}
                  preview={preview || props.preview}
                  ranges={ranges ?? []}
                  key={keyValue}
                  minDate={minDate}
                  maxDate={maxDate}
                  drag={drag}
                  dateOptions={dateOptions}
                  disabledDates={disabledDates!}
                  disabledDay={disabledDay!}
                  month={monthStep}
                  onDragSelectionStart={onDragSelectionStart}
                  onDragSelectionEnd={onDragSelectionEnd}
                  onDragSelectionMove={onDragSelectionMove}
                  onMouseLeave={() => onPreviewChange?.()}
                  styles={styles}
                  showWeekDays={!isVertical || i === 0}
                  showMonthName={!isVertical || i > 0}
                />
              );
            })}
          </Box>
        )}
      </>
    </Box>
  );
};
