import React, { useState } from "react";
import {
  ColumnDef,
  // ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// import { trpc } from "~/utils/trpc";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/server/clientController/auth/auth";
export type Roles = {
  id: number;
  name: string;
  type: string;

  is_deleted: boolean;
  created_at: Date;
};

const initialFilters: any = {
  first: 0,
  rows: 10,
};

export default function AssementDataTable() {
  // use toast
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterID, setFilterID] = useState({});

  const [filters, setFilters] = useState<any>(initialFilters);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedItem, setSelectedItem] = React.useState({});
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("");
  const [isModal, setIsModal] = React.useState(false);
  const [isModalDelete, setIsModalDelete] = React.useState(false);

  // APi
  //   const { data, refetch, isLoading } = useQuery(
  //     { ...filters, filters: { ...filterID } },

  //   );
  const { isLoading, isFetching, error, data } = useQuery({
    queryKey: [`fetch-role`],
    queryFn: () => GET("/role"),
  });
  const rolesData = React.useMemo(() => {
    return Array.isArray(data?.data?.response?.roles) ? data?.data?.response?.roles : [];
  }, [data]);

  // delete product
  const deleteCoupon = (data: any, type: string) => {
    setSelectedItem(data);
    setTitle("Coupon");
    setType(type);
    setIsModalDelete(true);
  };

  // handle modal
  const handleEnbled = (data: any, type: string) => {
    if (!data?.is_approved) {
      setSelectedItem(data);
      setTitle("Coupon");
      setType(type);
      setIsModal(true);
    } else {
      //   toast({
      //     variant: "disable",
      //     title: `Customer is Already Approved!`,
      //   });
    }
  };
  // columns
  const columns: ColumnDef<Roles>[] = [
    {
      accessorKey: "name",
      header: "Name",

      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="capitalize">
                  {row?.original?.name?.replace("_", "/")}
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-base font-normal">
                    {row?.original?.name === "seller"
                      ? "seller/buyer"
                      : row?.original?.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 overflow-hidden text-ellipsis whitespace-nowrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="capitalize">
                  {row?.original?.type?.replace("_", "/")}
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-base font-normal">
                    {row?.original?.type === "seller"
                      ? "seller/buyer"
                      : row?.original?.type}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
    {
      accessorKey: "Levels",
      header: "Levels",
      columns: [
        {
          header: "Sub Header 1",
          accessorKey: "subHeader1",
        },
        {
          header: "Sub Header 2",
          accessorKey: "subHeader2",
        },
        {
          header: "Sub Header 2",
          accessorKey: "subHeader2",
        },
        {
          header: "Sub Header 2",
          accessorKey: "subHeader2",
        },
        {
          header: "Sub Header 2",
          accessorKey: "subHeader2",
        },
      ],
      cell: ({ row }) => (
        <div className="text-ellipsis whitespace-nowrap capitalize">
          {/* {displayDate(row?.original?.created_at)} */}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: rolesData as Roles[],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  function handlePagination(page: number) {
    if (page < 0) return;
    setFilters((prevFilters: any) => ({ ...prevFilters, first: page }));
  }

  // FILTER OPTIONS
  const roleOptions1 = [
    {
      Icon: "fal fa-chevron-down",
      text: "Search",
      filtername: "searchQuery",
      type: "text",
    },

    {
      Icon: "fal fa-chevron-down",
      text: "Enabled",
      filtername: "is_enabled",
      type: "select",

      filter: [
        {
          name: "Yes",
          value: true,
        },
        {
          name: "No",
          value: false,
        },
      ],
    },
    {
      Icon: "fal fa-chevron-down",
      text: "Type",
      filtername: "is_percentage",
      type: "select",

      filter: [
        {
          name: "Fixed",
          value: false,
        },
        {
          name: "Percentage",
          value: true,
        },
      ],
    },
    {
      Icon: "fal fa-chevron-down",
      text: "Limit",
      filtername: "is_limited",
      type: "select",

      filter: [
        {
          name: "Limit",
          value: true,
        },
        {
          name: "Unlimited",
          value: false,
        },
      ],
    },
    {
      Icon: "fal fa-chevron-down",
      text: "Start Date",
      filtername: "startDate",
      type: "date",
    },
    {
      Icon: "fal fa-chevron-down",
      text: "End Date",
      filtername: "endDate",
      type: "date",
    },
    {
      Icon: "fal fa-chevron-down",
      text: "Clear Filter",
      filtername: "Clear",
    },
  ];
  console.log({ header: table?.getHeaderGroups() });
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end gap-2"></div>
      <div className="rounded-md border border-border">
        <ScrollArea className="w-full">
          <ScrollBar orientation="horizontal"></ScrollBar>

          <Table className="w-full overflow-x-scroll">
            <TableHeader className="bg-secondary/80">
              {table?.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    console.log({ rowData: header.column?.parent });
                    return (
                      <TableHead
                        key={header.id}
                        className={`${header.column?.parent !== undefined ? "!col-span-2 !row-span-2" : ""} `}
                        rowSpan={!header.subHeaders?.length ? 4 : 1}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table?.getRowModel()?.rows?.length ? (
                table?.getRowModel()?.rows?.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex w-[100px] flex-1 items-center justify-start text-sm font-medium">
          Page {filters.first + 1} of{" "}
          {Math.ceil((data?.data?.data?.count ?? 0) / filters.rows)}
        </div>

        <div className="flex items-center justify-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${filters.rows}`}
              onValueChange={(value) => {
                setFilters((prevFilters: any) => ({
                  ...prevFilters,
                  rows: Number(value),
                  first: 0,
                }));
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={filters.rows} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePagination(0)}
              disabled={filters.first === 0}
            >
              <span className="sr-only">Go to first page</span>
              <DoubleArrowLeftIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePagination(filters?.first - 1)}
              disabled={filters?.first === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePagination(filters.first + 1)}
              disabled={
                (filters.first + 1) * filters.rows > (data?.data?.count ?? 0) ||
                Math.ceil((data?.data?.count ?? 0) / filters.rows) ==
                  filters.first + 1
              }
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() =>
                handlePagination(
                  Math.ceil((data?.data?.count ?? 0) / filters.rows) - 1,
                )
              }
              disabled={
                (filters.first + 1) * filters.rows > (data?.data?.count ?? 0) ||
                Math.ceil((data?.data?.count ?? 0) / filters.rows) ==
                  filters.first + 1
              }
            >
              <span className="sr-only">Go to last page</span>
              <DoubleArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
