"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "@/hooks/useTranslation";

export default function DataTable({ columns, data, isLoading, emptyMessage }) {
  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full overflow-x-auto sm:overflow-visible min-h-[400px] bg-white border border-gray-100 rounded-xl shadow-sm">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="py-4 px-5 font-semibold text-gray-600 text-sm">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-16 text-gray-400">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                {t("loading")}
              </td>
            </tr>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition duration-200">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-4 px-5 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-16 text-gray-500 font-medium">
                {emptyMessage || t("noDataFound")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}