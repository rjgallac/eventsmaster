import React from 'react';
import { Cv } from '../types/Cv';
import { CvListItem } from './CvListItem';

interface CvListProps {
  cvs: Cv[];
  onView: (cv: Cv) => void;
  onDelete: (id: number) => Promise<void>;
  onSuggest: (id: number) => Promise<void>;
  onViewSuggestions: (cv: Cv) => Promise<void>;
}

export function CvList({
  cvs,
  onView,
  onDelete,
  onSuggest,
  onViewSuggestions,
}: CvListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold p-6 border-b">CV List</h1>
      {cvs.length === 0 ? (
        <p className="p-6 text-gray-600">No CVs submitted yet.</p>
      ) : (
        <div>
          {cvs.map((cv) => (
            <CvListItem
              key={cv.id}
              cv={cv}
              onView={onView}
              onDelete={onDelete}
              onSuggest={onSuggest}
              onViewSuggestions={onViewSuggestions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
