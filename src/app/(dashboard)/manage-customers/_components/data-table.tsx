"use client";

import React from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    flexRender,
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

// Define the props for the DataTable component
interface DataTableProps<TData> {
    columns: ColumnDef<TData, unknown>[];
    data: TData[];
    loading: boolean;
    onEdit: (data: TData) => void;
    onDelete: (id: number) => void;
}

export function DataTable<TData>({
    columns,
    data,
    loading,
}: DataTableProps<TData>) {
    // Initialize the table instance with core row model
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border shadow-sm overflow-hidden bg-white">
            <Table>
                {/* Table Header */}
                <TableHeader>
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
    );
}
