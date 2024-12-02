"use client";

import React from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the props for the DataTable component
interface DataTableProps<TData> {
    columns: ColumnDef<TData, unknown>[];
    data: TData[];
    loading: boolean;
    onEdit: (data: TData) => void;
    onDelete: (id: number) => void;
    pageSize?: number;
}

export function DataTable<TData>({
    columns,
    data,
    loading,
    pageSize = 10,
}: DataTableProps<TData>) {
    // Initialize the table instance with core row model and pagination
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize,
            },
        },
    });

    return (
        <div className="space-y-4">
            <div className="rounded-md border shadow-sm overflow-hidden bg-white">
                <Table>
                    {/* Table Header */}
                    <TableHeader className="shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-gray-100 hover:bg-gray-200 transition-colors">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="font-semibold text-gray-700 py-4 px-6 text-left"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody>
                        {loading ? (
                            // Display loading state
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="animate-spin mr-3 h-6 w-6 text-primary" />
                                        <span className="text-gray-600 text-lg">Loading data...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            // Display empty state when no data is available
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <Search className="mb-2 h-8 w-8 text-gray-400" />
                                        <span className="text-gray-500 text-lg">No results found.</span>
                                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Display table rows when data is available
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-4 px-6">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {data.length > 0 && (
                <div className="flex items-center justify-between px-2">
                    {/* Display current page information */}
                    <div className="flex-1 text-sm text-gray-700">
                        Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            data.length
                        )}{" "}
                        of {data.length} results
                    </div>
                    {/* Navigation buttons */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
