import {
  Box,
  chakra,
  createStylesContext,
  HStack,
  HTMLChakraProps,
  IconButton,
  IconButtonProps,
  Input,
  omitThemingProps,
  StackProps,
  Tag,
  TagCloseButton,
  TagLabel,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import { FC, forwardRef, memo, useCallback, useMemo } from "react";

import {
  SelectActionGroupProps,
  SelectControlProps,
  SelectedItemProps,
  SelectedListProps,
  SelectionVisibilityMode,
  SelectLabelProps,
  SelectListProps,
  SelectOptionItemProps,
  SelectProps,
} from "./type";
import {
  SelectActionProvider,
  SelectedListProvider,
  SelectedProvider,
  SelectInputProvider,
  SelectProvider,
  useClearButton,
  useSelect,
  useSelectActionGroup,
  useSelectButton,
  useSelectControl,
  useSelectedItem,
  useSelectedList,
  useSelectInput,
  useSelectItem,
  useSelectList,
} from "./use-select";
import { idFromOption, labelFromValue, useSelectLabel } from "./utils";

export const ChakraSvg = chakra("svg");
export const [StylesProvider, useStyles] = createStylesContext("Select");

const Select = memo<SelectProps>((props) => {
  const { children } = props;

  const styles = useMultiStyleConfig("MultiSelect", props);
// console.log(useMultiStyleConfig, useMultiStyleConfig("MultiSelect", props), props)
  const ownProps = omitThemingProps(props as any);

  const ctx = useSelect(ownProps as any);
  const context = useMemo(() => ctx, [ctx]);
  const selectInputContext = useMemo(
    () => ({ getInputProps: ctx.getInputProps }),
    [ctx.getInputProps],
  );
  const selectedContext = useMemo(
    () => ({ removeValue: ctx.removeValue }),
    [ctx.removeValue],
  );
  const selectedListContext = useMemo(
    () => ({
      value: ctx.value,
      multi: ctx.multi,
      selectionVisibleIn: ctx.selectionVisibleIn,
    }),
    [ctx.value, ctx.multi, ctx.selectionVisibleIn],
  );
  const selectActionContext = useMemo(
    () => ({
      isOpen: ctx.isOpen,
      setOpen: ctx.setOpen,
      clearable: ctx.clearable,
      clearAll: ctx.clearAll,
    }),
    [ctx.isOpen, ctx.setOpen, ctx.clearable, ctx.clearAll],
  );

  return (
    <StylesProvider value={styles}>
      <SelectProvider value={context}>
        <SelectInputProvider value={selectInputContext}>
          <SelectedListProvider value={selectedListContext}>
            <SelectedProvider value={selectedContext}>
              <SelectActionProvider value={selectActionContext}>
                <chakra.div pos="relative">{children}</chakra.div>
              </SelectActionProvider>
            </SelectedProvider>
          </SelectedListProvider>
        </SelectInputProvider>
      </SelectProvider>
    </StylesProvider>
  );
});

export const SelectLabel = memo<SelectLabelProps>((props) => {
  const labelProps = useSelectLabel();

  return <chakra.label {...props} {...labelProps} />;
});

export const SelectControl = forwardRef<"div", SelectControlProps>(
  ({ children, ...props }, ref) => {
    const { ref: controlRef, __css } = useSelectControl({ ref });

    return (
      <Input ref={controlRef} as={HStack} {...__css} {...props}>
        {children}
      </Input>
    );
  },
);

export const SelectedList = memo<SelectedListProps>(
  ({ children, ...props }) => {
    const {
      __css,
      textList,
      selectedItems,
      multi,
      selectionVisibleIn,
      ...selectedListProps
    } = useSelectedList(props);

    return (
      <Box {...__css} {...selectedListProps}>
        {multi && // Both || Input
          selectionVisibleIn !== SelectionVisibilityMode.List &&
          selectedItems?.map((selectedItem: any) => (
            <SelectedItem
              key={`selected-item-${selectedItem}`}
              value={selectedItem}
            />
          ))}
        {multi && // List only
          selectionVisibleIn === SelectionVisibilityMode.List &&
          !!selectedItems?.length && (
            <Box {...textList?.__css}>{selectedItems?.join(", ")}</Box>
          )}
        {children}
      </Box>
    );
  },
);

export const SelectedItem = memo<SelectedItemProps>(({ value, ...props }) => {
  const { onClick, __css, ...itemProps } = useSelectedItem({
    value,
    ...props,
  });

  return (
    <Tag {...(__css as any)} {...itemProps}>
      <TagLabel>{value}</TagLabel>
      <TagCloseButton onClick={onClick} />
    </Tag>
  );
});

export const SelectInput = memo((props) => {
  const inputProps = useSelectInput(props);
  return <chakra.input {...inputProps} />;
});

export const SelectActionGroup = memo<SelectActionGroupProps>((props) => {
  const {
    __css,
    clearable,
    clearOnClick,
    clearButtonProps,
    toggleButtonProps,
    ...toggleActionProps
  } = useSelectActionGroup(props);

  return (
    <HStack {...__css} {...toggleActionProps}>
      {clearable && (
        <SelectClearButton onClick={clearOnClick} {...clearButtonProps} />
      )}
      <SelectToggleButton {...toggleButtonProps} />
    </HStack>
  );
});

const SelectToggleIcon: FC<HTMLChakraProps<"svg"> & { isActive?: boolean }> = ({
  isActive,
  width = 4,
  height = 4,
  __css,
  ...props
}) => (
  <ChakraSvg
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    width={width}
    height={height}
    __css={{
      ...__css,
      ...(isActive && ((__css as any)?._active as any)),
    }}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    />
  </ChakraSvg>
);

export const SelectToggleButton = memo<IconButtonProps>((props) => {
  const {
    __css,
    size = "sm",
    ariaLabel = "toggle menu",
    icon: Icon = SelectToggleIcon,
    isOpen,
    ...buttonProps
  } = useSelectButton(props);

  return (
    <IconButton
      tabIndex={0}
      size={size}
      aria-label={ariaLabel}
      aria-haspopup
      aria-expanded={isOpen}
      icon={
        <Icon
          isActive={isOpen}
          __css={{
            transitionDuration: "200ms",
            transitionProperty: "transform",
            _active: { transform: "rotate(180deg)" },
          }}
        />
      }
      {...__css}
      {...buttonProps}
    />
  );
});

const SelectClearIcon: FC<HTMLChakraProps<"svg"> & { isActive?: boolean }> = ({
  width = 4,
  height = 4,
  ...props
}) => (
  <ChakraSvg
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    width={width}
    height={height}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </ChakraSvg>
);

export const SelectClearButton = memo<IconButtonProps>((props) => {
  const {
    __css,
    size = "sm",
    ariaLabel = "clear all selected",
    icon: Icon = SelectClearIcon,
    ...buttonProps
  } = useClearButton(props);

  return (
    <IconButton
      tabIndex={0}
      size={size}
      aria-label={ariaLabel}
      icon={<Icon />}
      {...__css}
      {...buttonProps}
    />
  );
});

export const SelectList = memo<SelectListProps>((props) => {
  const {
    __css,
    visibleOptions,
    isOpen,
    getOption,
    ref: listRef,
    ...listProps
  } = useSelectList();

  const dropdownVisible = isOpen;
  const optionItemProps = useCallback((option: string, index: number) => {
    const optionItem = getOption(option) as any;
    return {
      key: optionItem.id || idFromOption(optionItem, "option-"),
      value: optionItem.value,
      label: optionItem.label || labelFromValue(optionItem.value),
      selected: optionItem.selected,
      created: optionItem.created,
      index,
    };
  }, []);

  return (
    <chakra.ul
      ref={listRef}
      __css={useMemo(
        () => ({
          listStyle: "none",
          position: "absolute",
          ...(!dropdownVisible && { display: "none" }),
          ...__css,
        }),
        [dropdownVisible, __css],
      )}
      aria-orientation="vertical"
      role="listbox"
      {...listProps}
      {...props}
    >
      {dropdownVisible && visibleOptions.length > 0 ? (
        visibleOptions.map((item: any, index: number) => {
          const { key: itemKey, ...restItemProps } = optionItemProps(
            item,
            index,
          );
          return <SelectOptionItem key={itemKey} {...restItemProps} />;
        })
      ) : (
        <EmptySelectResults />
      )}
    </chakra.ul>
  );
});

export const EmptySelectResults = memo<{ label?: string }>(
  ({ label = "No results found" }) => {
    const styles = useStyles();
    return (
      <chakra.li __css={styles.item}>
        <SelectOptionLabel label={label} />
      </chakra.li>
    );
  },
);

export const SelectOptionLabel = memo<
  StackProps & { label: string; created?: boolean }
>(({ label, created }) => (
  <HStack justifyContent="space-between" w="full" role="list">
    <Box>{label}</Box>
    {!!created && (
      <Tag flexShrink={0}>
        <TagLabel fontSize="xs" fontWeight="bold" role="listitem">
          New
        </TagLabel>
      </Tag>
    )}
  </HStack>
));

export const SelectOptionItem = memo<SelectOptionItemProps>(
  ({ value, label, index, selected, created, ...props }) => {
    const { highlightedRef, option, ...itemProps } = useSelectItem({
      value,
      label,
      index,
      selected,
    });

    return (
      <chakra.li
        ref={highlightedRef && highlightedRef}
        role="option"
        {...(selected && { "aria-selected": selected })}
        {...props}
        {...itemProps}
      >
        <SelectOptionLabel label={option?.label || value} created={!!created} />
      </chakra.li>
    );
  },
);

export default Select;
