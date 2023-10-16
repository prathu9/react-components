import {
  BoxProps,
  HTMLChakraProps,
  IconButtonProps,
  StackProps,
  TagProps,
  UsePopperProps,
  UsePopperReturn,
} from "@chakra-ui/react";
import { MutableRefObject, ReactNode } from "react";

export enum ChangeActions {
  SingleCreate = "singleCreate",
  SingleRemove = "singleRemove",
  SingleSelect = "singleSelect",
  SingleClear = "singleClear",
  MultiCreate = "multiCreate",
  MultiRemove = "multiRemove",
  MultiSelect = "multiSelect",
  MultiClear = "multiClear",
}

export enum SelectionVisibilityMode {
  List = "list",
  Input = "input",
  Both = "both",
}

export interface UseMultiSelectProps {
  value?: string | string[];
  options: Option[];
  onChange?: SelectOnChange;
  getOption?: GetOption;
}

export interface UseMultiSelectReturn {
  value?: string | string[];
  options: Option[];
  onChange?: SelectOnChange;
}

export type SelectOnChange = (
  value: string | number | Array<string | number>,
  change?: {
    action: ChangeActions;
    value: any;
  },
) => void;

export interface Option {
  label: string;
  value: string | number;
}

export type GetOption = (option: string | { label: string; value: any }) => {
  label: string;
  value: any;
};

export type GetDebounce = (options: Option[]) => number;

export interface SelectState {
  searchValue: string;
  resolvedSearchValue: string;
  isOpen: boolean;
  highlightedIndex: number;
}
export type SelectStateUpdater = (
  updater: (old: SelectState) => SelectState,
  action: SelectActions,
) => void;

export enum SelectActions {
  SetOpen = "setOpen",
  SetSearch = "setSearch",
  HighlightIndex = "highlightIndex",
}

export type StateReducer = (
  old: SelectState,
  newState: SelectState,
  action: SelectActions,
) => SelectState;

export type ScrollToIndex = (
  index: number,
  ref: MutableRefObject<HTMLElement | undefined>,
  optionsRef: MutableRefObject<HTMLElement | undefined>,
  enabledRef: MutableRefObject<boolean>,
) => void;

export type SelectFilter = (
  options: Option[],
  searchValue: string | number,
  getOption: GetOption,
) => Option[];

export interface UseSelectProps extends UsePopperProps {
  onChange: SelectOnChange;
  single?: boolean;
  create?: boolean;
  selectionVisibleIn?: SelectionVisibilityMode;
  duplicates?: boolean;
  options?: Option[];
  value?: any;
  shiftAmount?: number;
  getOption?: GetOption;
  getDebounce?: GetDebounce;
  stateReducer?: StateReducer;
  scrollToIndex?: ScrollToIndex;
  filterFn?: SelectFilter;
}

export interface SelectProps
  extends Omit<
      HTMLChakraProps<"select">,
      "value" | "size" | "onChange" | "onSelect" | "children"
    >,
    UseSelectProps {
  label?: string;
  children?: ReactNode;
}

export type SelectLabelProps = HTMLChakraProps<"label">;
export type SelectListProps = HTMLChakraProps<"ul">;
export type SelectedListProps = BoxProps;

export interface SelectControlProps
  extends Omit<HTMLChakraProps<"select">, "size"> {
  defaultIsOpen?: boolean;
  isLazy?: true;
  closeOnSelect?: false;
  children?: ReactNode;
}

export interface SelectActionGroupProps extends StackProps {
  clearButtonProps?: IconButtonProps;
  toggleButtonProps?: IconButtonProps;
}

export interface MultiSelectProps extends Omit<SelectProps, "children"> {
  children?: ReactNode;
  labelProps?: SelectLabelProps;
  controlProps?: SelectControlProps;
  listProps?: SelectListProps;
  selectedListProps?: SelectedListProps;
  actionGroupProps?: SelectActionGroupProps;
}

export type SelectRemoveValue = (index: number) => void;

export type SelectSetOpen = (open: boolean) => void;

export type SelectSetSearch = (searchValue: string) => void;

export interface SelectItem {
  value: any;
  label?: string;
}

export interface SelectedItemProps extends TagProps, SelectItem {}

export type AnyFunc = (...args: any[]) => any;

export interface UseSelectReturn {
  value: any;
  multi: boolean;
  searchValue: string;
  isOpen: boolean;
  selectedOption: Option;
  visibleOptions: Option[];
  selectionVisibleIn: SelectionVisibilityMode;
  selectIndex: (index: number) => any;
  highlightIndex: (value: any) => any;
  highlightedValueRef: MutableRefObject<HTMLElement | undefined>;
  highlightedIndexRef: MutableRefObject<number>;
  enableScrollRef: MutableRefObject<boolean>;
  removeValue: SelectRemoveValue;
  setOpen: SelectSetOpen;
  setSearch: SelectSetSearch;
  popper: UsePopperReturn;
  getInputProps: AnyFunc;
  getOptionProps: AnyFunc;
  getOption: GetOption;
  optionsRef: MutableRefObject<any>;
  controlRef: MutableRefObject<any>;
  clearAll: () => void;
  clearable: boolean;
}

export interface SelectOptionItemProps extends HTMLChakraProps<"li"> {
  highlighted?: boolean;
  label?: string;
  index: number;
  selected?: boolean;
  created?: boolean;
}
