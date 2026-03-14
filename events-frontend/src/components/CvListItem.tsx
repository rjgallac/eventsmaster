import React from 'react';
import { Cv } from '../types/Cv';

interface CvListItemProps {
  cv: Cv;
  onView: (cv: Cv) => void;
  onDelete: (id: number) => Promise<void>;
  onSuggest?: (id: number) => Promise<void>;
  onViewSuggestions?: (cv: Cv) => Promise<void>;
}

export function CvListItem({
  cv,
  onView,
  onDelete,
  onSuggest,
  onViewSuggestions,
}: CvListItemProps) {
  return (
    <div className="border-b last:border-b-0 py-3 px-4 hover:bg-gray-50">
      <div className="grid grid-cols-[100px,1fr] gap-2 items-center text-sm">
        <span>
          <strong>ID:</strong> {cv.id}
        </span>
        <div className="flex items-center justify-between gap-2">
          <span>
            <strong>Name:</strong> {cv.name}
          </span>
          <button
            onClick={() => onView(cv)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            View
          </button>
          <button
            onClick={() => onDelete(cv.id)}
            className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button
            onClick={() => onSuggest?.(cv.id)}
            className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Get Suggestions
          </button>
          <button
            onClick={() => onViewSuggestions?.(cv)}
            className="bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            View Suggestions
          </button>
        </div>
      </div>
    </div>
  );
}
