import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';

const AdminTable = ({ columns, rows, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="bg-[#1C0D2A] text-white">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-gray-500">
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={row._id ?? row.id ?? idx}
                  className={`border-t border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFC]'} hover:bg-[#b8370e]/5 transition-colors`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 text-sm font-medium text-[#1F1B2E]">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      {onView && (
                        <button
                          type="button"
                          onClick={() => onView(row)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-sky-50 hover:text-sky-600 cursor-pointer"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(row)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-[#b8370e]/10 hover:text-[#b8370e] cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          className="p-2 rounded-lg text-gray-500 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
