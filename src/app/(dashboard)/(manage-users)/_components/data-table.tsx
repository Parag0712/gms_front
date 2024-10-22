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
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

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
    onEdit,
    onDelete,
}: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="font-semibold text-gray-600 py-3 px-4">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                <div className="flex items-center justify-center">
                                    <Loader2 className="animate-spin mr-2 h-5 w-5 text-primary" />
                                    <span className="text-gray-600">Loading...</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                <div className="flex items-center justify-center">
                                    <Search className="mr-2 h-5 w-5 text-gray-400" />
                                    <span className="text-gray-500">No results found.</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-3 px-4">
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
