import dayjs from "dayjs";

const defineds = {
  startOfWeek: dayjs(new Date()).startOf("week").toDate(),
  endOfWeek: dayjs(new Date()).endOf("week").toDate(),
  startOfLastWeek: dayjs(dayjs(new Date()).add(-7, "days"))
    .startOf("week")
    .toDate(),
  endOfLastWeek: dayjs(dayjs(new Date()).add(-7, "days"))
    .endOf("week")
    .toDate(),
  startOfToday: dayjs(new Date()).startOf("day").toDate(),
  endOfToday: dayjs(new Date()).endOf("day").toDate(),
  startOfYesterday: dayjs(dayjs(new Date()).add(-1, "days"))
    .startOf("day")
    .toDate(),
  endOfYesterday: dayjs(dayjs(new Date()).add(-1, "day")).endOf("day").toDate(),
  startOfMonth: dayjs(new Date()).startOf("month").toDate(),
  endOfMonth: dayjs(new Date()).endOf("month").toDate(),
  startOfLastMonth: dayjs(dayjs(new Date()).add(-1, "month"))
    .startOf("month")
    .toDate(),
  endOfLastMonth: dayjs(dayjs(new Date()).add(-1, "month"))
    .endOf("month")
    .toDate(),
};

type RangeType = {
  startDate: Date;
  endDate: Date;
};

interface staticRangeHandlerPropsType {
  range:
    | (() => {
        startDate: Date;
        endDate: Date;
      })
    | null;
  isSelected: (range: RangeType) => boolean;
}

const staticRangeHandler: staticRangeHandlerPropsType = {
  range: null,
  isSelected(range: RangeType) {
    const definedRange = this.range!();
    return (
      dayjs(range && range.startDate).isSame(definedRange.startDate, "day") &&
      dayjs(range && range.endDate).isSame(definedRange.endDate, "day")
    );
  },
};

interface staticRangePropsType {
  label: string;
  range:
    | (() => {
        startDate: Date;
        endDate: Date;
      })
    | null;
}

export function createStaticRanges(staticRanges: staticRangePropsType[]) {
  return staticRanges.map((staticRange) => ({
    ...staticRangeHandler,
    ...staticRange,
  }));
}

export const defaultStaticRanges = createStaticRanges([
  {
    label: "Today",
    range: () => ({
      startDate: defineds.startOfToday,
      endDate: defineds.endOfToday,
    }),
  },
  {
    label: "Yesterday",
    range: () => ({
      startDate: defineds.startOfYesterday,
      endDate: defineds.endOfYesterday,
    }),
  },

  {
    label: "This Week",
    range: () => ({
      startDate: defineds.startOfWeek,
      endDate: defineds.endOfWeek,
    }),
  },
  {
    label: "Last Week",
    range: () => ({
      startDate: defineds.startOfLastWeek,
      endDate: defineds.endOfLastWeek,
    }),
  },
  {
    label: "This Month",
    range: () => ({
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
    }),
  },
  {
    label: "Last Month",
    range: () => ({
      startDate: defineds.startOfLastMonth,
      endDate: defineds.endOfLastMonth,
    }),
  },
]);

export const defaultInputRanges = [
  {
    label: "days up to today",
    range(value: any) {
      return {
        startDate: dayjs(defineds.startOfToday).add(
          (Math.max(Number(value), 1) - 1) * -1,
          "days",
        ),
        endDate: defineds.endOfToday,
      };
    },
    getCurrentValue(range: any) {
      if (!dayjs(range.endDate).isSame(defineds.endOfToday, "day")) return "-";
      if (!range.startDate) return "∞";
      return dayjs(defineds.endOfToday).diff(range.startDate, "day") + 1;
    },
  },
  {
    label: "days starting today",
    range(value: any) {
      const today = new Date();
      return {
        startDate: today,
        endDate: dayjs(today).add(Math.max(Number(value), 1) - 1, "day"),
      };
    },
    getCurrentValue(range: any) {
      if (!dayjs(range.startDate).isSame(defineds.startOfToday, "day"))
        return "-";
      if (!range.endDate) return "∞";
      return dayjs(range.endDate).diff(defineds.startOfToday, "day") + 1;
    },
  },
];
