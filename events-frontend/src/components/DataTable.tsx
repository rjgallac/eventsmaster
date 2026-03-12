import React from 'react';

interface Cv {
  id: number;
  name: string;
  curriculum_vitae_content: string;
}

interface DataTableProps {
  data: Cv[] | any[];
  columns: Array<{ key: keyof Cv | keyof any; header: string }>;
  onDelete?: (id: number) => void;
  onActionClick?: (item: any) => void;
  actionLabel?: string;
  emptyMessage: string;
  formatValue?: (value: any, row: any) => React.ReactNode;
  isSubmitting?: (id: number) => boolean;
}

export function DataTable({
  data,
  columns,
  onDelete,
  onActionClick,
  actionLabel = 'Delete',
  emptyMessage,
  formatValue,
  isSubmitting,
}: DataTableProps) {
  if (data.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div className="mt-5">
      {data.length === 0 ? (
        <p className="text-gray-600">{emptyMessage}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden bg-white">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`border px-4 py-3 text-left font-semibold ${
                      col.key === 'id' || col.header === 'Actions'
                        ? 'text-center'
                        : ''
                    }`}
                  >
                    {col.header}
                  </th>
                ))}
                <th className="border px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`border px-4 py-3 ${
                        col.key === 'id' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {formatValue
                        ? formatValue(item[col.key], item)
                        : item[col.key]}
                    </td>
                  ))}
                  <td className="border px-4 py-3 text-center">
                    {isSubmitting && isSubmitting(item.id) ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="animate-spin h-5 w-5 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-sm text-gray-600">
                          Processing...
                        </span>
                      </div>
                    ) : (
                      <>
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2"
                          >
                            Delete
                          </button>
                        )}
                        {onActionClick && (
                          <button
                            onClick={() => onActionClick(item)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {actionLabel}
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
