import { usePopper } from "@chakra-ui/react";
import { createContext, mergeRefs } from "@chakra-ui/react-utils";
import { EventKeys } from "@chakra-ui/utils";
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useStyles } from "./Select";
import {
  AnyFunc,
  ChangeActions,
  Option,
  SelectActions,
  SelectionVisibilityMode,
  SelectOnChange,
  SelectState,
  UseMultiSelectProps,
  UseMultiSelectReturn,
  UseSelectProps,
  UseSelectReturn,
} from "./type";
import {
  defaultFilterFn,
  defaultGetDebounce,
  defaultGetOption,
  defaultScrollToIndex,
  defaultStateReducer,
  idFromOption,
  labelFromValue,
  updateReducerState,
  useHoistedState,
} from "./utils";

const initialState: SelectState = {
  searchValue: "",
  resolvedSearchValue: "",
  isOpen: false,
  highlightedIndex: 0,
};

const defaultMultiValue: any[] = [];
const defaultOptions: Option[] = [];

const [SelectProvider, useSelectContext] = createContext<UseSelectReturn>({
  strict: false,
  name: "SelectContext",
});

const [SelectInputProvider, useSelectInputContext] = createContext<
  Pick<UseSelectReturn, "getInputProps">
>({
  strict: false,
  name: "SelectInputContext",
});

const [SelectedProvider, useSelectedContext] = createContext<
  Pick<UseSelectReturn, "removeValue">
>({
  strict: false,
  name: "SelectedContext",
});

const [SelectedListProvider, useSelectedListContext] = createContext<
  Pick<UseSelectReturn, "value" | "multi" | "selectionVisibleIn">
>({
  strict: false,
  name: "SelectedListContext",
});

const [SelectActionProvider, useSelectActionContext] = createContext<
  Pick<UseSelectReturn, "isOpen" | "setOpen" | "clearable" | "clearAll">
>({
  strict: false,
  name: "SelectActionContext",
});

export function useSelect({
  create = false,
  single = false,
  selectionVisibleIn = SelectionVisibilityMode.Input,
  getDebounce = defaultGetDebounce,
  getOption = defaultGetOption,
  stateReducer = defaultStateReducer,
  filterFn = defaultFilterFn,
  scrollToIndex = defaultScrollToIndex,
  shiftAmount = 5,
  duplicates,
  options,
  value,
  onChange,
  placement = "bottom-start",
}: UseSelectProps): UseSelectReturn {
  const [
    { searchValue, resolvedSearchValue, isOpen, highlightedIndex },
    setState,
  ] = useHoistedState(initialState, stateReducer);

  const multi = !single;

  // Refs

  const optionsRef = useRef();
  const optionsItemsRef = useRef<Option[]>([]);
  const valueRef = useRef<string | Array<string>>("");
  const inputRef = useRef();
  const controlRef = useRef();
  const onBlurRef = useRef({});
  const onChangeRef = useRef();
  const filterFnRef = useRef();
  const scrollToIndexRef = useRef();
  const highlightedIndexRef = useRef<number>(highlightedIndex);
  const highlightedValueRef = useRef<HTMLElement | undefined>();
  const enableScrollRef = useRef(false);

  const popper = usePopper({
    placement,
  });

  highlightedIndexRef.current = highlightedIndex;
  (filterFnRef.current as any) = filterFn;
  (scrollToIndexRef.current as any) = scrollToIndex;
  (onChangeRef.current as any) = onChange;

  // Multi should always at least have an empty array as the value
  if (multi && typeof value === "undefined") {
    value = defaultMultiValue;
  }

  // If no options are provided, then use an empty array
  if (!options) {
    options = defaultOptions;
  }

  const originalOptions = options;

  // If multi and duplicates aren't allowed, filter out the
  // selected options from the options list
  options = useMemo(() => {
    // if selectionVisibleIn list || both set a selected value and don't filter
    if (selectionVisibleIn !== SelectionVisibilityMode.Input) {
      return options?.map((d) => ({
        ...getOption(d),
        selected: (Array.isArray(value) ? value : [value || ""])?.some(
          (v: any) => getOption(v).value === getOption(d).value,
        ),
      }));
    }

    // otherwise
    if (multi && !duplicates) {
      return options?.filter(
        (d) =>
          !value?.some((v: any) => getOption(v).value === getOption(d).value),
      );
    }
    return options;
  }, [options, value, duplicates, multi, getOption, selectionVisibleIn]);

  // Compute the currently selected option(s)
  const selectedOption = useMemo(() => {
    console.log("inside selct option", multi, value)
    if (!multi) {
      return (
        originalOptions.find(
          (d) => getOption(d).value === getOption(value).value,
        ) || getOption(value)
      );
    }
    return value.map(
      (val: any) =>
        originalOptions.find(
          (d) => getOption(d).value === getOption(val).value,
        ) || getOption(val),
    );
  }, [multi, value, originalOptions, getOption]);
console.log("s",value,selectedOption)
  // If there is a search value, filter the options for that value
  // This needs to be reworked to handle async loading
  options = useMemo(() => {
    if (resolvedSearchValue) {
      return (filterFnRef.current as any)?.(
        options,
        resolvedSearchValue,
        getOption,
      );
    }
    return options;
  }, [options, resolvedSearchValue, getOption]);

  // If in create mode and we have a search value, fabricate
  // an option for that searchValue and prepend it to options
  options = useMemo(() => {
    if (create && searchValue) {
      return [{ created: true, ...getOption(searchValue) }, ...options!];
    }
    return options;
  }, [create, searchValue, options, getOption]);

  valueRef.current = value;
  optionsItemsRef.current = options as Option[];
  console.log("state",valueRef, value, create, multi)
  // Actions

  const setOpen = useCallback((newIsOpen: boolean) => {
    setState(
      (old) => updateReducerState(old, newIsOpen, "isOpen"),
      SelectActions.SetOpen,
    );
  }, []);

  const Close = useCallback(() => {
    setOpen(false);
  }, []);

  const Open = useCallback(() => {
    setOpen(true);
  }, []);

  const setResolvedSearch = useDebounce((value) => {
    setState(
      (old) => updateReducerState(old, value, "resolvedSearchValue"),
      SelectActions.SetSearch,
    );
  }, getDebounce(options!));

  const setSearch = useCallback((value: string) => {
    setState(
      (old) => updateReducerState(old, value, "searchValue"),
      SelectActions.SetSearch,
    );
    setResolvedSearch(value);
  }, []);

  const highlightIndex = useCallback(
    (value: number | ((prev: number) => number)) => {
      const _options = optionsItemsRef.current;
      setState((old) => {
        return {
          ...old,
          highlightedIndex: Math.min(
            Math.max(
              0,
              typeof value === "function" ? value(old.highlightedIndex) : value,
            ),
            _options.length - 1,
          ),
        };
      }, SelectActions.HighlightIndex);
    },
    [],
  );

  const selectIndex = useCallback(
    (index: number) => {
      const option = optionsItemsRef.current![index];
      if (option) {
        const selectedOption = getOption(option) as any;
        
        if (!multi) {
          console.log("selectIndex", multi,create, option, selectedOption);
          (onChangeRef.current as any)?.(selectedOption.value, {
            action: selectedOption.created
              ? ChangeActions.SingleCreate
              : ChangeActions.SingleSelect,
            value: selectedOption,
          });
        } else {
          const _value = valueRef.current as Array<string>;
          console.log("_value", _value);
          if (
            duplicates ||
            !_value.some(
              (v: any) => getOption(v).value === selectedOption.value,
            )
          ) {
            (onChangeRef.current as any)?.([..._value, selectedOption.value], {
              action: selectedOption.created
                ? ChangeActions.MultiCreate
                : ChangeActions.MultiSelect,
              value: selectedOption,
            });
          }
        }
      }

      if (create || multi) {
        setSearch("");
      }
      if (!multi) {
        Close();
      }
    },
    [multi, create, duplicates, getOption],
  );

  const clearAll = useCallback(() => {
    (onChangeRef.current as any)?.(multi ? [] : "", {
      action: multi ? ChangeActions.MultiClear : ChangeActions.SingleClear,
      value: "",
    });
  }, [multi]);

  const removeValue = useCallback(
    (v: number | string) => {
      const isIndex = typeof v === "number";
      const _multi = Array.isArray(valueRef.current);
      const _value = (
        _multi ? valueRef.current : [valueRef.current]
      ) as Array<string>;
      const _next = _value.filter((_v: string, i: number) =>
        isIndex ? i !== v : v !== _v,
      );
      if (_multi) {
        (onChangeRef.current as any)(_next, {
          action: ChangeActions.MultiRemove,
          value: getOption(isIndex ? _value[v] : v),
        });
      } else {
        (onChangeRef.current as any)(_next[0] || "", {
          action: ChangeActions.SingleRemove,
          value: getOption(isIndex ? _value[v] : v),
        });
      }
    },
    [getOption],
  );

  // Handlers

  const handleSearchValueChange = useCallback((e: any) => {
    setSearch(e.target.value);
    Open();
  }, []);

  const handleSearchClick = useCallback(() => {
    if (!create || multi) {
      setSearch("");
    }
    Open();
  }, [create, multi]);

  // Prop Getters

  const ArrowUp =
    (defaultShift?: any, defaultMeta?: any) =>
    ({ shift, meta }: any, e: any) => {
      e.preventDefault();
      const amount =
        defaultMeta || meta
          ? 1000000000000
          : defaultShift || shift
          ? shiftAmount - 1
          : 1;
      Open();
      enableScrollRef.current = true;
      highlightIndex((old: number) => old - amount);
    };

  const ArrowDown =
    (defaultShift?: any, defaultMeta?: any) =>
    ({ shift, meta }: any, e: any) => {
      e.preventDefault();
      const amount =
        defaultMeta || meta
          ? 1000000000000
          : defaultShift || shift
          ? shiftAmount - 1
          : 1;
      Open();
      enableScrollRef.current = true;
      highlightIndex((old: number) => old + amount);
    };

  const Enter = useCallback(
    (_: any, e: any) => {
      if (isOpen) {
        const _options = optionsItemsRef.current;
        if (searchValue || _options![highlightedIndexRef!.current as number]) {
          e.preventDefault();
        }
        if (_options![highlightedIndexRef!.current as number]) {
          selectIndex(highlightedIndexRef!.current as number);
        }
      }
    },
    [isOpen, searchValue],
  );

  const Backspace = useCallback(() => {
    const _value = valueRef.current;
    const lastValue = multi ? _value[_value.length - 1] : _value;
    if ((multi && !searchValue) || (!multi && lastValue)) {
      removeValue(lastValue as string);
      setSearch("");
    }
  }, [searchValue, multi]);

  const getKeyProps = useKeys({
    ArrowUp: ArrowUp(),
    ArrowDown: ArrowDown(),
    PageUp: ArrowUp(true),
    PageDown: ArrowDown(true),
    Home: ArrowUp(false, true),
    End: ArrowDown(false, true),
    Escape: Close,
    Tab: Close,
    Enter,
    Backspace,
  } as any);

  const getInputProps = useCallback(
    (
      {
        refKey = "ref",
        ref,
        onChange,
        onFocus,
        onClick,
        onBlur,
        ...rest
      } = {} as any,
    ) => {
      console.log("selected",isOpen, searchValue, selectedOption.label)
      return getKeyProps({
        [refKey]: (el: HTMLElement) => {
          (inputRef.current as any) = el;
          if (ref) {
            ref.current = el;
          }
        },
        value:
          (isOpen
            ? searchValue || selectedOption.label
            : selectedOption
            ? selectedOption?.label
            : "") || "",
        onChange: (e: any) => {
          handleSearchValueChange(e);
          if (onChange) {
            onChange(e);
          }
        },
        onFocus: (e: any) => {
          handleSearchClick();
          if (onFocus) {
            onFocus(e);
          }
        },
        onClick: (e: any) => {
          handleSearchClick();
          if (onClick) {
            onClick(e);
          }
        },
        onBlur: (e: any) => {
          if (onBlur) {
            e.persist();
            (onBlurRef.current as any).cb = onBlur;
            (onBlurRef.current as any).event = e;
          }
        },
        ...rest,
      });
    },
    [
      isOpen,
      searchValue,
      selectedOption,
      handleSearchClick,
      handleSearchValueChange,
    ],
  );

  const getOptionProps = useCallback(
    (
      {
        index,
        key = index,
        onClick,
        onMouseEnter,
        option,
        ...rest
      } = {} as any,
    ) => {
      if (typeof index !== "number" || index < 0) {
        throw new Error(
          `useSelect: The getOptionProps prop getter requires an index property, eg. 'getOptionProps({index: 1})'`,
        );
      }

      return {
        key,
        option,
        ...rest,
        onClick: (e: any) => {
          if (option.selected !== undefined && option.selected) {
            removeValue(option.value);
          } else {
            selectIndex(index);
          }
          if (onClick) {
            onClick(e);
          }
        },
        onMouseEnter: (e: any) => {
          enableScrollRef.current = false;
          highlightIndex(index);
          if (onMouseEnter) {
            onMouseEnter(e);
          }
        },
      };
    },
    [],
  );

  // Effects

  // When the user clicks outside of the options box or input
  // while open, we need to close the dropdown
  useClickOutsideRef(isOpen, Close, optionsRef!, controlRef!);

  // When searching, activate the first option
  useEffect(() => {
    if (searchValue) {
      highlightIndex(0);
    }
  }, [searchValue, highlightIndex]);

  // When we open and close the options, set the highlightedIndex to 0
  useEffect(() => {
    highlightIndex(0);

    if (!isOpen && (onBlurRef.current as any)?.event) {
      (onBlurRef.current as any)?.cb((onBlurRef.current as any).event);
      (onBlurRef.current as any).event = null;
    }
  }, [isOpen]);

  // When the highlightedIndex changes, scroll to that item
  useEffect(() => {
    (scrollToIndexRef.current as any)?.(
      highlightedIndex,
      highlightedValueRef,
      optionsRef,
      enableScrollRef,
    );
  }, [highlightedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        (inputRef.current as any)?.focus();
      });
    }
  }, [isOpen]);

  return {
    multi,
    clearable: multi && !!(Array.isArray(value) ? value.length > 0 : !!value),
    clearAll,
    optionsRef,
    controlRef,
    popper,
    // State
    value,
    searchValue,
    isOpen,
    highlightedIndexRef,
    highlightedValueRef,
    enableScrollRef,
    selectedOption,
    visibleOptions: options!,
    selectionVisibleIn,
    // Actions
    selectIndex,
    removeValue,
    setOpen,
    setSearch,
    highlightIndex,
    // Prop Getters
    getInputProps,
    getOptionProps,
    getOption,
  };
}

export const useDebounce = (fn: AnyFunc, time = 0) => {
  const ref = useRef(null);
  const fnRef = useRef();

  fnRef.current = fn as any;

  useEffect(() => {
    return () => {
      clearTimeout(ref.current as unknown as number);
    };
  }, [time]);

  return useCallback(
    async (...args: any[]) => {
      if (ref.current) {
        clearTimeout(ref.current as unknown as number);
      }
      return new Promise((resolve, reject) => {
        ref.current = setTimeout(() => {
          ref.current = null;
          try {
            resolve((fnRef.current as unknown as AnyFunc)(...args));
          } catch (err) {
            reject(err);
          }
        }, time) as any;
      });
    },
    [time],
  );
};

export const useKeys = (userKeys: {
  [K in EventKeys]: (opts: { shift: any; meta: any }, e?: any) => K | any;
}) => {
  return ({ onKeyDown, ...rest } = {} as any) => {
    return {
      ...rest,
      onKeyDown: (e: KeyboardEvent) => {
        const { code, key, shiftKey: shift, metaKey: meta } = e;
        const handler =
          userKeys[key as keyof typeof userKeys] ||
          userKeys[code as keyof typeof userKeys];
        if (handler) {
          handler(
            {
              shift,
              meta,
            },
            e,
          );
        }
        if (onKeyDown) {
          onKeyDown(e);
        }
      },
    };
  };
};

function useClickOutsideRef(
  enable: boolean,
  fn: AnyFunc,
  dropdownRef: MutableRefObject<any>,
  controlRef: MutableRefObject<any>,
): void {
  const localDropdownRef = useRef();
  const localControlRef = useRef();
  const fnRef = useRef();

  (fnRef.current as any) = fn;
  const elDropdownRef =
    dropdownRef ||
    (localDropdownRef as unknown as MutableRefObject<HTMLElement>);
  const elControlRef =
    controlRef || (localControlRef as unknown as MutableRefObject<HTMLElement>);

  const handle = useCallback((e: TouchEvent | MouseEvent) => {
    const isTouch = e.type === "touchstart";
    if (e.type === "click" && isTouch) {
      return;
    }

    const elControl = elControlRef.current as HTMLElement;
    const elDropdown = elDropdownRef.current as HTMLElement;
    if (
      !(
        elControl?.contains((e as any).target) ||
        elDropdown?.contains((e as any).target)
      )
    ) {
      (fnRef.current as any)(e);
    }
  }, []);

  useEffect(() => {
    if (enable) {
      document.addEventListener("touchstart", handle, true);
      document.addEventListener("click", handle, true);
    }

    return () => {
      document.removeEventListener("touchstart", handle, true);
      document.removeEventListener("click", handle, true);
    };
  }, [enable, handle]);
}

export function useSelectActionGroup(props: any = {}) {
  const { clearAll, clearable } = useSelectActionContext();
  const styles = useStyles();

  const clearOnClick = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearAll();
  }, []);

  return {
    ...props,
    clearOnClick,
    clearable,
    __css: styles.actionGroup,
  };
}

export function useSelectInput(props: any = {}) {
  const { getInputProps } = useSelectInputContext();
  const styles = useStyles();

  return {
    ...props,
    ...getInputProps(),
    __css: styles.input,
  };
}
export function useSelectLabel(props: any = {}) {
  const styles = useStyles();

  return {
    ...props,
    __css: styles.label,
  };
}

export function useSelectButton(props: any = {}) {
  const { isOpen, setOpen } = useSelectActionContext();
  const onClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (setOpen as any)((o: any) => !o);
    },
    [setOpen],
  );
  const styles = useStyles();

  return {
    ...props,
    __css: {
      ...styles.button,
      ...(isOpen && (styles.button as any))?._active,
    },
    isOpen,
    onClick,
  };
}

export function useClearButton(props: any = {}) {
  const styles = useStyles();

  return {
    ...props,
    __css: {
      ...styles.button,
    },
  };
}

export function useSelectedItem(props: any = {}) {
  const { removeValue } = useSelectedContext();
  const styles = useStyles();
  const onClick = useCallback(() => removeValue(props.value), [props.value]);

  return useMemo(
    () => ({
      key: props.key || props.value,
      onClick,
      __css: styles.selectedItem,
    }),
    [props.value, props.key, onClick, styles.selectedItem],
  );
}

export function useSelectItem({ selected, ...props }: any = {}) {
  const { getOptionProps, highlightedIndexRef, highlightedValueRef } =
    useSelectContext();
  const styles = useStyles();
  const highlighted = highlightedIndexRef.current === props.index;

  return useMemo(() => {
    const option = {
      value: props.value,
      label: props.label || labelFromValue(props.value),
      selected,
    };
    return {
      ...getOptionProps!({
        option,
        key: props.key || idFromOption(option),
        index: props.index,
      }),
      highlightedRef: highlighted ? highlightedValueRef : undefined,
      __css: {
        ...styles.item,
        ...(selected && (styles.item as any))?._selected,
        ...(highlighted && (styles.item as any))?._active,
      },
    };
  }, [
    highlighted,
    selected,
    props.key,
    props.label,
    props.value,
    props.index,
    styles.item,
  ]);
}

export function useSelectList() {
  const { isOpen, getOption, optionsRef, popper, visibleOptions } =
    useSelectContext();
  const styles = useStyles();

  return useMemo(
    () => ({
      ref: mergeRefs(optionsRef, popper.popperRef),
      isOpen,
      visibleOptions,
      getOption,
      __css: styles.list,
    }),
    [isOpen, visibleOptions, styles.list],
  );
}

export function useSelectedList(props: any = {}) {
  const {
    value: selectedItems,
    multi,
    selectionVisibleIn,
  } = useSelectedListContext();
  const styles = useStyles();

  return {
    ...props,
    multi,
    selectedItems,
    selectionVisibleIn,
    __css: styles.selectedList,
    textList: {
      __css: styles.textList,
    },
  };
}

export function useSelectControl(props: any = {}) {
  const { isOpen, popper, controlRef } = useSelectContext();
  const styles = useStyles();

  return {
    ...props,
    ...useMemo(
      () => ({
        ref: mergeRefs(props.ref, controlRef, popper.referenceRef),
      }),
      [props.ref, controlRef, popper.referenceRef],
    ),
    isOpen,
    __css: styles.control,
  };
}

export function useMultiSelect(
  props: UseMultiSelectProps = {} as UseMultiSelectProps,
): UseMultiSelectReturn {
  const getOption = props.getOption || defaultGetOption;
  const [value, setValue] = useState(props.value);
  const [options, setOptions] = useState<Option[]>(() =>
    props.options.map(getOption),
  );
  const onChange = useCallback<SelectOnChange>(
    (next, change) => {
      switch (change?.action) {
        case ChangeActions.SingleCreate:
          setValue(next as string);
          setOptions((o) => {
            const opt = getOption(next as any);
            return o.some((_o) => getOption(_o).value === opt.value)
              ? o
              : [{ ...opt, created: true }, ...o];
          });
          break;
        case ChangeActions.SingleClear:
        case ChangeActions.SingleRemove:
          setValue(next as string);
          break;
        case ChangeActions.SingleSelect:
          setValue(next as string);
          break;
        case ChangeActions.MultiCreate:
          // const nextValue = next as string[];
          const created = (next as string[])[(next as string[]).length - 1];
          setValue((next as string[]));
          setOptions((o) => {
            const opt = getOption(created as any);
            return o.some((_o) => getOption(_o).value === opt.value)
              ? o
              : [{ ...opt, created: true }, ...o];
          });
          break;
        case ChangeActions.MultiClear:
        case ChangeActions.MultiRemove:
          setValue(next as string[]);
          break;
        case ChangeActions.MultiSelect:
        default:
          setValue(next as string[]);
      }
    },
    [setValue, setOptions, getOption],
  );

  return {
    value,
    options,
    onChange,
  };
}

export {
  SelectActionProvider,
  SelectedListProvider,
  SelectedProvider,
  SelectInputProvider,
  SelectProvider,
  useSelectActionContext,
  useSelectContext,
  useSelectedContext,
  useSelectedListContext,
  useSelectInputContext,
};
