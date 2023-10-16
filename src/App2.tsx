import { Container, Stack, Button, ButtonGroup } from '@chakra-ui/react';
// import { DateRangePicker } from './components/date-range-picker';
import React from "react";
// import { addDays } from 'date-fns';
import { ColumnDef,
  ColumnFiltersState,
  DataGrid,
  DataGridProps,
  SortingState,
  TableInstance,
  DataGridPagination } from './components/data-grid';


interface ExampleData {
    name: string;
    phone: string;
    email: string;
    company: string;
    country: string;
    employees: number;
    status: string;
  }

  const columns: ColumnDef<ExampleData>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "employees",
      header: "Employees",
      meta: { isNumeric: true },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];
  
  const data = [
    {
      id: 1,
      name: "TaShya Charles",
      phone: "(651) 467-2240",
      email: "urna.nec.luctus@icloud.couk",
      company: "Luctus Et Industries",
      country: "China",
      employees: 139,
      status: "new",
    },
    {
      id: 2,
      name: "Donovan Mosley",
      phone: "(154) 698-4775",
      email: "lacinia.mattis.integer@icloud.couk",
      company: "Nunc Ullamcorper Industries",
      country: "Sweden",
      employees: 234,
      status: "new",
    },
    {
      id: 3,
      name: "Quynn Moore",
      phone: "1-362-643-1030",
      email: "ipsum.primis@aol.couk",
      company: "Venenatis Lacus LLC",
      country: "Italy",
      employees: 32,
      status: "new",
    },
    {
      id: 4,
      name: "Hashim Huff",
      phone: "(202) 481-9204",
      email: "pede.ultrices.a@icloud.couk",
      company: "Maecenas Ornare Incorporated",
      country: "China",
      employees: 1322,
      status: "active",
    },
    {
      id: 5,
      name: "Fuller Mcleod",
      phone: "1-186-271-2202",
      email: "auctor.velit@hotmail.com",
      company: "Hendrerit Consectetuer Associates",
      country: "Peru",
      employees: 4,
      status: "active",
    },
  ];

  

const App = () => {

  // const [state, setState] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 7),
  //     key: 'selection'
  //   }
  // ]);

  // const [sState, setsState] = useState({
  //   selection: {
  //     startDate: new Date(),
  //     endDate: null,
  //     key: 'selection'
  //   },
  //   compare: {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 3),
  //     key: 'compare'
  //   }
  // });

  const ref = React.useRef<TableInstance<ExampleData>>(null);
  const [page, setPage] = React.useState(0);
  const [sort, setSort] = React.useState<SortingState>([]);
  const [status, setStatus] = React.useState("new");

  const paginatedData = React.useMemo(() => {
    return data.slice(page, page + 1);
  }, [page]);

  React.useEffect(() => {
    ref.current?.setColumnFilters(() => {
      return [
        {
          id: "status",
          value: status,
        },
      ];
    });
  }, [status]);

  const filters = React.useMemo<ColumnFiltersState>(() => {
    return [
      {
        id: "status",
        value: "new",
      },
    ];
  }, []);

  const initialState = {
    columnVisibility: { phone: false, employees: false },
    rowSelection: { 1: true },
    pagination: { pageSize: 1 },
    columnFilters: filters,
  };

  const withLinks = (columns.concat() as any).map((column: any) => {
    if (column.accessorKey === "username") {
      return {
        ...column,
        meta: {
          href: (row: any) => {
            return `/customers/${row.id}`;
          },
          ...column.meta,
        },
      };
    }
    return column;
  });

  const sortedData = React.useMemo(() => {
    const key = sort[0]?.id;
    const desc = sort[0]?.desc;

    return data.concat().sort((a: any, b: any) => {
      if (key && a[key] > b[key]) {
        return desc ? -1 : 1;
      }

      if (key && a[key] < b[key]) {
        return desc ? 1 : -1;
      }

      return 0;
    });
  }, [sort]);

  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      return row.status === status;
    });
  }, [status]);
  
  return(
    <Container mt="20px" maxWidth="100%">
      <Stack gap="10">
      <Stack direction="row" mb="8">
        {/* <Button onClick={() => ref.current?.toggleAllRowsSelected()}>
          Toggle select all
        </Button> */}
        <ButtonGroup isAttached mb="8">
        <Button isActive={status === "new"} onClick={() => setStatus("new")}>
          New
        </Button>
        <Button
          isActive={status === "active"}
          onClick={() => setStatus("active")}
        >
          Active
        </Button>
        <Button
          isActive={status === "deleted"}
          onClick={() => setStatus("deleted")}
        >
          Deleted
        </Button>
      </ButtonGroup>
      </Stack>
      <DataGrid<ExampleData>
        // data={data}
        // data={paginatedData}
        // data={sortedData}
        data={filteredData}
        columns={withLinks}
        initialState={initialState}
        isSortable
        isSelectable
        pageCount={data.length}
        onSelectedRowsChange = {(rows: string[]) => console.log(rows)}
        children={<DataGridPagination onChange={({ pageIndex }) => setPage(pageIndex)} />}
      />
      
      {/* <DateRangePicker
        onChange={item => setState([item.selection])}
        // showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
      /> */}

      {/* <DateRangePicker
        onChange={item => {setsState({ ...sState, ...item })}}
        months={1}
        minDate={addDays(new Date(), -300)}
        maxDate={addDays(new Date(), 900)}
        direction="vertical"
        scroll={{ enabled: true }}
        ranges={
          [{
            key: sState.selection.key, 
            startDate: sState.compare.startDate, 
            endDate: sState.compare.endDate
          }]}
      />; */}
      </Stack>
    </Container>
  )
}

export default App;