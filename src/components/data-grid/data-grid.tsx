import {
  chakra,
  Checkbox,
  CSSObject,
  forwardRef,
  SystemStyleObject,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  ThemingProps,
  Tr,
  useMultiStyleConfig,
  useTheme,
} from "@chakra-ui/react";
import { __DEV__, cx, dataAttr } from "@chakra-ui/utils";
import { Link } from "@saas-ui/react";
import {
  Cell,
  ColumnDef,
  ColumnFiltersState,
  ColumnSort,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Header,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingFn,
  SortingState,
  Table as TableInstance,
  TableOptions,
  TableState,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

import { ChevronDownIcon, ChevronUpIcon } from "../icons";
import { NoResults } from "./no-results";

export type {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingFn,
  SortingState,
  TableInstance,
};

interface DataGridContextValue<Data extends object> {
  instance: TableInstance<Data>;
  state: TableState;
}

const DataGridContext = React.createContext<DataGridContextValue<any> | null>(
  null,
);

export interface DataGridProviderProps<Data extends object> {
  instance: TableInstance<Data>;
  children: React.ReactNode;
}

export const DataGridProvider = <Data extends object>(
  props: DataGridProviderProps<Data>,
) => {
  const { instance, children } = props;

  const context: DataGridContextValue<Data> = {
    state: instance.getState(),
    instance,
  };

  return (
    <DataGridContext.Provider value={context}>
      {children}
    </DataGridContext.Provider>
  );
};

export const useDataGridContext = <Data extends object>() => {
  return React.useContext(DataGridContext) as DataGridContextValue<Data>;
};

type UseColumns = <Data extends object>(
  factory: () => Array<ColumnDef<Data>>,
  deps: React.DependencyList,
) => Array<ColumnDef<Data>>;
export const useColumns: UseColumns = (factory, deps) =>
  React.useMemo(() => factory(), [...deps]);

export interface DataGridProps<Data extends object>
  extends Omit<TableOptions<Data>, "getCoreRowModel">,
    ThemingProps<"Table"> {
  /**
   * The React Table instance reference
   */
  instanceRef?: React.Ref<TableInstance<Data>>;
  /**
   * Enable sorting on all columns
   */
  isSortable?: boolean;
  /**
   * Enable row selection
   */
  isSelectable?: boolean;
  /**
   * Enable row hover styles
   */
  isHoverable?: boolean;
  /**
   * Triggers whenever the row selection changes.
   * @params rows The selected row id'
   */
  onSelectedRowsChange?: (rows: Array<string>) => void;
  /**
   * Triggers when sort changed.
   * Use incombination with `manualSortBy` to enable remote sorting.
   */
  onSortChange?: (columns: ColumnSort[]) => void;
  /**
   * Callback fired when a row is clicked.
   */
  onRowClick?: (row: Row<Data>, e: React.MouseEvent, meta?: any) => void;
  /**
   * Callback fired when clear filters is clicked.
   */
  onResetFilters?: () => void;
  /**
   * Use this for controlled pagination.
   */
  pageCount?: number;
  /**
   * No results component
   */
  noResults?: React.FC<any>;
  /**
   * The table class name attribute
   */
  className?: string;
  /**
   * Grid styles
   */
  sx?: CSSObject;
  /**
   * DataGrid children
   */
  children?: React.ReactNode;
}

export const DataGrid = React.forwardRef(
  <Data extends object>(
    props: DataGridProps<Data>,
    ref: React.ForwardedRef<HTMLTableElement>,
  ) => {
    const {
      instanceRef,
      columns,
      data,
      initialState,
      getSubRows,
      defaultColumn,
      getRowId,
      isSortable,
      isSelectable,
      isHoverable,
      onSelectedRowsChange,
      onSortChange,
      onRowClick,
      onResetFilters,
      noResults: NoResultsComponent = NoResults,
      pageCount,
      colorScheme,
      size,
      variant,
      className,
      sx,
      children,
      ...rest
    } = props;

    const theme = useTheme();
    const styleConfig = theme.components?.DataGrid;

    const styles = useMultiStyleConfig("DataGrid", props);

    const instance = useReactTable<Data>({
      columns: React.useMemo(() => {
        return getSelectionColumn<Data>(isSelectable).concat(
          columns?.map((column: any) => {
            if (!column.accessorKey) {
              column.accessorKey = column.id;
            }
            if (!column.cell) {
              column.cell = DefaultDataGridCell;
            }
            return column;
          }),
        );
      }, []),
      data,
      initialState: React.useMemo(() => initialState, []),
      defaultColumn,
      getSubRows,
      getRowId,
      manualPagination: pageCount !== undefined,
      pageCount,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      ...rest,
    });

    // This exposes the useTable api through the tableRef
    React.useImperativeHandle(instanceRef, () => instance, [instanceRef]);

    const state = instance.getState();
    const { rows } = instance.getRowModel();

    React.useEffect(() => {
      onSelectedRowsChange?.(Object.keys(state.rowSelection));
    }, [onSelectedRowsChange, state.rowSelection, instance]);

    React.useEffect(() => {
      onSortChange?.(state.sorting);
    }, [onSortChange, state.sorting]);

    const noResults = (state.columnFilters.length || state.globalFilter) &&
      !rows.length && <NoResultsComponent onReset={onResetFilters} />;

    const innerStyles = {
      ...styles.inner,
      ...(noResults ? { display: "flex", alignItems: "center" } : {}),
    };

    const table = (
      <Table
        ref={ref}
        className={cx("saas-data-grid", className)}
        styleConfig={styleConfig}
        colorScheme={colorScheme}
        size={size}
        variant={variant}
        sx={sx}
      >
        <Thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <DataGridHeader
                  key={header.id}
                  header={header}
                  isSortable={isSortable}
                />
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {rows.map((row) => {
            const onClick = (e: React.MouseEvent) => onRowClick?.(row, e);

            return (
              <Tr
                key={row.id}
                onClick={onClick}
                data-selected={dataAttr(row.getIsSelected())}
                data-hover={dataAttr(isHoverable)}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = (cell.column.columnDef.meta || {}) as any;
                  return (
                    <Td
                      key={cell.id}
                      isNumeric={meta.isNumeric}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );

    return (
      <DataGridProvider<Data> instance={instance}>
        <chakra.div
          className={cx("saas-data-grid", className)}
          __css={styles.container}
        >
          <chakra.div className="saas-data-grid__inner" __css={innerStyles}>
            {noResults || table}
          </chakra.div>
          {children}
        </chakra.div>
      </DataGridProvider>
    );
  },
) as (<Data extends object>(
  props: DataGridProps<Data> & {
    ref?: React.ForwardedRef<HTMLTableElement>;
  },
) => React.ReactElement) & { displayName?: string };

if (__DEV__) {
  DataGrid.displayName = "DataGrid";
}

export interface DataGridSortProps<Data extends object, TValue> {
  header: Header<Data, TValue>;
}
export const DataGridSort = <Data extends object, TValue>(
  props: DataGridSortProps<Data, TValue>,
) => {
  const { header, ...rest } = props;

  const sorterStyles = {
    ms: 2,
  };

  if (header.id === "selection") {
    return null;
  }

  const sorted = header.column.getIsSorted();

  return (
    <chakra.span __css={sorterStyles} {...rest}>
      {sorted ? (
        sorted === "desc" ? (
          <ChevronDownIcon aria-label="sorted descending" />
        ) : (
          <ChevronUpIcon aria-label="sorted ascending" />
        )
      ) : (
        ""
      )}
    </chakra.span>
  );
};

if (__DEV__) {
  DataGridSort.displayName = "DataGridSort";
}

export interface DataGridHeaderProps<Data extends object, TValue> {
  header: Header<Data, TValue>;
  isSortable?: boolean;
}
export const DataGridHeader = <Data extends object, TValue>(
  props: DataGridHeaderProps<Data, TValue>,
) => {
  const { header, isSortable, ...rest } = props;

  let headerProps = {};

  if (isSortable && header.column.getCanSort()) {
    headerProps = {
      className: "saas-data-grid__sortable",
      userSelect: "none",
      cursor: "pointer",
      onClick: header.column.getToggleSortingHandler(),
    };
  }

  const meta = (header.column.columnDef.meta || {}) as any;
  const { size } = header.column.columnDef;
  return (
    <Th
      colSpan={header.colSpan}
      textTransform="none"
      width={size && `${size}px`}
      isNumeric={meta.isNumeric}
      {...headerProps}
      {...rest}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      {isSortable && <DataGridSort header={header} />}
    </Th>
  );
};

if (__DEV__) {
  DataGridHeader.displayName = "DataGridHeader";
}

const getResult = <Data extends object>(
  fn: (row: Data) => string,
  params: Data,
): string => {
  if (typeof fn === "function") {
    return fn(params);
  }
  return fn;
};

export type DataGridCell<Data extends object> = ColumnDef<Data>["cell"];

export const DefaultDataGridCell = <Data extends object, TValue>(
  props: Cell<Data, TValue>,
) => {
  const { column, row, getValue } = props;

  const meta = (column.columnDef.meta || {}) as any;

  if (meta.href) {
    const href = getResult(meta.href, row.original);
    return <Link href={href}>{getValue<React.ReactNode>()}</Link>;
  }
  return getValue() || null;
};

if (__DEV__) {
  DefaultDataGridCell.displayName = "DefaultDataTableCell";
}

const DataGridCheckbox = forwardRef((props, ref) => {
  const onClick = React.useCallback(
    (e: React.MouseEvent) => e.stopPropagation(),
    [],
  );

  return (
    <chakra.div onClick={onClick}>
      <Checkbox ref={ref} {...props} />
    </chakra.div>
  );
});

const getSelectionColumn = <Data extends object>(enabled?: boolean) => {
  return enabled
    ? [
        {
          id: "selection",
          size: 1,
          header: ({ table }) => (
            <DataGridCheckbox
              isChecked={table.getIsAllRowsSelected()}
              isIndeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
              aria-label={
                table.getIsAllRowsSelected()
                  ? "Deselect all rows"
                  : "Select all rows"
              }
            />
          ),
          cell: ({ row }) => (
            <DataGridCheckbox
              isChecked={row.getIsSelected()}
              isIndeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
              aria-label={row.getIsSelected() ? "Deselect row" : "Select row"}
            />
          ),
        } as ColumnDef<Data>,
      ]
    : [];
};
