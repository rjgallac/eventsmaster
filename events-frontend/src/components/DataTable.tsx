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
}

export function DataTable({
  data,
  columns,
  onDelete,
  onActionClick,
  actionLabel = 'Delete',
  emptyMessage,
  formatValue,
}: DataTableProps) {
  if (data.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
      }}
    >
      <thead>
        <tr style={{ backgroundColor: '#f5f5f5' }}>
          {columns.map((col) => (
            <th
              key={String(col.key)}
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign:
                  col.key === 'id' || col.header === 'Actions'
                    ? 'center'
                    : 'left',
              }}
            >
              {col.header}
            </th>
          ))}
          <th
            style={{
              border: '1px solid #ddd',
              padding: '8px',
              textAlign: 'center',
            }}
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td
                key={String(col.key)}
                style={{
                  border: '1px solid #ddd',
                  padding: '8px',
                  textAlign: col.key === 'id' ? 'center' : 'left',
                }}
              >
                {formatValue ? formatValue(item[col.key], item) : item[col.key]}
              </td>
            ))}
            <td
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                textAlign: 'center',
              }}
            >
              {onDelete && (
                <button
                  onClick={() => onDelete(item.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              )}
              {onActionClick && (
                <button
                  onClick={() => onActionClick(item)}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '5px',
                  }}
                >
                  {actionLabel}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
