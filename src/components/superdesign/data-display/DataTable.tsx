'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const tableVariants = cva('w-full caption-bottom text-sm', {
  variants: {
    variant: {
      default: '',
      bordered: '[&_th]:border [&_td]:border',
      striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/50',
    },
    size: {
      sm: '[&_th]:px-2 [&_th]:py-1.5 [&_td]:px-2 [&_td]:py-1.5',
      md: '[&_th]:px-4 [&_th]:py-3 [&_td]:px-4 [&_td]:py-3',
      lg: '[&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export interface Column<T> {
  key: keyof T | string;
  header: React.ReactNode;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T>
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  emptyMessage?: React.ReactNode;
  loading?: boolean;
}

function DataTable<T extends Record<string, unknown>>({
  className,
  variant,
  size,
  columns,
  data,
  keyExtractor = (_, index) => index,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  emptyMessage = 'No data available',
  loading,
  ...props
}: DataTableProps<T>) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className="relative w-full overflow-auto">
      <table className={cn(tableVariants({ variant, size }), className)} {...props}>
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  'h-12 font-medium text-muted-foreground',
                  alignClass[column.align || 'left'],
                  column.sortable && 'cursor-pointer select-none hover:text-foreground'
                )}
                style={{ width: column.width }}
                onClick={() => column.sortable && onSort?.(String(column.key))}
              >
                <div className={cn('flex items-center gap-2', column.align === 'right' && 'justify-end', column.align === 'center' && 'justify-center')}>
                  {column.header}
                  {column.sortable && sortColumn === column.key && (
                    sortDirection === 'asc' ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={keyExtractor(row, rowIndex)}
                className={cn(
                  'border-b transition-colors hover:bg-muted/50',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(alignClass[column.align || 'left'])}
                  >
                    {column.cell
                      ? column.cell(row, rowIndex)
                      : String(row[column.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export { DataTable, tableVariants };
