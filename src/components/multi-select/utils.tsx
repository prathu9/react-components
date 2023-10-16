import computeScrollIntoView from "compute-scroll-into-view";
import { useCallback, useRef, useState } from "react";

import { useStyles } from "./Select";
import {
  GetDebounce,
  GetOption,
  Option,
  ScrollToIndex,
  SelectActions,
  SelectFilter,
  SelectState,
  SelectStateUpdater,
  StateReducer,
} from "./type";

export const idFromOption = (option: Option, prefix = ""): string =>
  `${prefix}${option?.value}`;

export const labelFromValue = (value: string): string =>
  `${value.charAt(0).toUpperCase()}${value.substring(1)}`;

export const defaultGetDebounce: GetDebounce = (options) =>
  options.length > 10000 ? 1000 : options.length > 1000 ? 200 : 0;

export const defaultGetOption: GetOption = (option) =>
  typeof option === "string"
    ? { value: option, label: labelFromValue(option) }
    : option;

export const defaultStateReducer: StateReducer = (_, newState) => newState;

export const defaultFilterFn: SelectFilter = (
  options,
  searchValue,
  getOption,
) => {
  return options
    .filter((option) =>
      getOption(option)
        .value.toString()
        .toLowerCase()
        .includes(searchValue.toString().toLowerCase()),
    )
    .sort((a) => {
      return getOption(a)
        .value.toString()
        .toLowerCase()
        .indexOf(searchValue.toString().toLowerCase());
    });
};

export const scrollIntoView = (node: any, optionsNode: any) => {
  if (!node || !optionsNode) {
    return;
  }
  const actions = computeScrollIntoView(node, {
    boundary: optionsNode,
    block: "nearest",
    scrollMode: "if-needed",
  });
  actions.forEach(({ el, top, left }) => {
    el.scrollTop = top;
    el.scrollLeft = left;
  });
};

export const defaultScrollToIndex: ScrollToIndex = (
  _,
  inputRef,
  optionsRef,
  enabledRef,
) => {
  if (enabledRef.current) {
    scrollIntoView(inputRef.current, optionsRef.current);
  }
};

export const useHoistedState = (
  initialState: SelectState,
  reducer: StateReducer,
): [SelectState, SelectStateUpdater] => {
  const reducerRef = useRef();
  (reducerRef.current as any) = reducer;
  const [state, _setState] = useState(initialState);
  const setState = useCallback(
    (updater: (old: SelectState) => SelectState, action: SelectActions) => {
      if (!action) {
        throw new Error("An action type is required to update the state");
      }
      return _setState((old: SelectState) =>
        (reducerRef.current as unknown as StateReducer)(
          old,
          updater(old),
          action,
        ),
      );
    },
    [_setState],
  );
  return [state, setState];
};

export const updateReducerState = (
  state: any,
  newValue: any,
  key?: string,
): any => {
  if (!key) {
    if (typeof newValue === "function") {
      return newValue(state);
    }
    return newValue;
  }
  if (typeof newValue === "function") {
    const next = {
      ...state,
      [key]: newValue(state[key]),
    };
    return next;
  }
  return {
    ...state,
    [key]: newValue,
  };
};

export function useSelectLabel(props: any = {}) {
  const styles = useStyles();

  return {
    ...props,
    __css: styles.label,
  };
}
