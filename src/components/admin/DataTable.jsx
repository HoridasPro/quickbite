"use client";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "@/hooks/useTranslation";

export default function DataTable({ columns, data, isLoading, emptyMessage, layout = "fixed" }) {
  const { t } = useTranslation();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableLayoutClass = layout === "auto" ? "table-auto" : "table-fixed";

  return (
    <div className="w-full overflow-x-auto min-h-[400px] bg-white border border-gray-100 rounded-xl shadow-sm">
      <table className={`w-full text-left border-collapse ${tableLayoutClass} min-w-[800px]`}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-50/50 border-b border-gray-100">
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta || {};
                const widthClass = meta.widthClass || "";
                
                return (
                  <th key={header.id} className={`py-4 px-5 font-semibold text-gray-600 text-sm ${widthClass}`}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
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
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta || {};
                  const isExpandable = meta.expandable;
                  const widthClass = meta.widthClass || "";
                  const alignment = meta.align || "align-middle"; // Safely defaults to middle if not provided

                  return (
                    <td key={cell.id} className={`py-4 px-5 ${alignment} ${widthClass}`}>
                      {isExpandable ? (
                        <div className="line-clamp-1 hover:line-clamp-none transition-all duration-300 break-words cursor-default">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ) : (
                        <div className="relative">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      )}
                    </td>
                  );
                })}
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