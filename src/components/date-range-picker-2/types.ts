export interface DateRangeType {
  startDate: number | Date | null;
  endDate: number | Date | null;
}

export interface RangeShape extends DateRangeType {
  color?: string;
  key?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  showDateDisplay?: boolean;
}

export type AriaLabelShape = {
  dateInput: { [key: string]: { startDate: string; endDate: string } };
  monthPicker: string;
  yearPicker: string;
  prevButton: string;
  nextButton: string;
};

export type PreviewType = {
  startDate: number | Date | null;
  endDate: number | Date | null;
  color: string | undefined;
} | null;

export interface DayCellType {
  day: number | Date;
  dayDisplayFormat: string;
  date?: number | Date;
  ranges: RangeShape[];
  onPreviewChange: (day?: any) => void;
  previewColor?: string;
  preview?: PreviewType;
  disabled: boolean;
  isPassive: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isStartOfWeek: boolean;
  isEndOfWeek: boolean;
  isStartOfMonth: boolean;
  isEndOfMonth: boolean;
  color?: string;
  displayMode?: "dateRange" | "date";
  dragRange: any;
  drag: any;
  styles: {
    dayPassive: string;
    dayDisabled: string;
    dayToday: string;
    dayWeekend: string;
    dayStartOfWeek: string;
    dayEndOfWeek: string;
    dayStartOfMonth: string;
    dayEndOfMonth: string;
    dayHovered: string;
    dayActive: string;
    day: string;
    dayStartPreview: string;
    dayInPreview: string;
    dayEndPreview: string;
    selected: string;
    startEdge: string;
    endEdge: string;
    inRange: string;
    dayNumber: string;
  };
  onMouseDown: (day: Date | number) => void;
  onMouseUp: (day: Date | number) => void;
  onMouseEnter: (day: Date | number) => void;
  dayContentRenderer?: (d: number | Date | null) => boolean;
}

export interface CalendarPropsType {
  showMonthArrow?: boolean;
  showMonthAndYearPickers?: boolean;
  disabledDates?: number[] | Date[];
  disabledDay?: (d: any) => boolean;
  minDate?: Date;
  maxDate?: Date;
  date?: object;
  onChange?: (d: any, isSingleValue?: any) => void;
  onPreviewChange?: (value?: any) => void;
  onRangeFocusChange?: (a: number[]) => void;
  classNames?: object;
  preview?: PreviewType;
  locale?: any;
  shownDate?: object;
  onShownDateChange?: (visibleMonth: Date) => void;
  ranges?: RangeShape[];
  dateDisplayFormat?: string;
  monthDisplayFormat?: string;
  weekdayDisplayFormat?: string;
  weekStartsOn?: number;
  dayDisplayFormat?: string;
  focusedRange?: number[];
  initialFocusedRange?: number[];
  months?: number;
  className?: string;
  showDateDisplay?: boolean;
  showPreview?: boolean;
  displayMode?: "dateRange" | "date";
  color?: string;
  updateRange?: (d: any) => void;
  scroll?: {
    enabled: boolean;
    monthHeight?: number;
    longMonthHeight?: number;
    monthWidth?: number;
    calendarWidth?: number;
    calendarHeight?: number;
  };
  direction?: "vertical" | "horizontal";
  startDatePlaceholder?: string;
  endDatePlaceholder?: string;
  navigatorRenderer?: () => void;
  rangeColors?: string[];
  editableDateInputs?: boolean;
  dragSelectionEnabled?: boolean;
  fixedHeight?: boolean;
  calendarFocus?: string;
  preventSnapRefocus?: boolean;
  ariaLabels?: AriaLabelShape;
  dayContentRenderer?: (day: any) => JSX.Element;
}

export type DragType = {
  status: boolean;
  range: { startDate: number | Date | null; endDate: number | Date | null };
  disablePreview: boolean;
};

export type ScrollAreaType = {
  enabled: boolean;
  monthWidth?: number;
  monthHeight?: number;
  longMonthHeight?: number;
  calendarWidth?: number;
  calendarHeight?: number;
};

export interface MonthPropsType {
  dayDisplayFormat: string;
  style?: any;
  styles: any;
  month: number | Date;
  drag: {
    status: any;
    range: any;
    disablePreview: any;
  };
  dateOptions?: { locale: any; weekStartsOn?: any };
  disabledDates: any[];
  disabledDay: (d: any) => boolean;
  preview?: {
    startDate: number | Date | null;
    endDate: number | Date | null;
    color: string | undefined;
  } | null;
  showPreview?: boolean;
  onPreviewChange: (val: any) => void;
  displayMode?: "dateRange" | "date";
  minDate: number | Date;
  maxDate: number | Date;
  ranges: RangeShape[];
  focusedRange?: number[];
  onDragSelectionStart: (d: any) => void;
  onDragSelectionEnd: (d: any) => void;
  onDragSelectionMove: (d: any) => void;
  onMouseLeave: () => void;
  monthDisplayFormat: string;
  weekdayDisplayFormat?: string;
  showWeekDays: boolean;
  showMonthName: boolean;
  fixedHeight?: boolean;
}
