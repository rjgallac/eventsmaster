import React from 'react';
import { Cv } from '../types/Cv';

interface SuggestionModalProps {
  cv: Cv;
  onClose: () => void;
}

export function SuggestionModal({ cv, onClose }: SuggestionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-[90%] max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Suggestion Results</h2>
        <div className="mb-3">
          <strong>ID:</strong> {cv.id}
        </div>
        <div className="mb-3">
          <strong>Name:</strong> {cv.name}
        </div>
        <div className="mb-3">
          <strong>Suggestions:</strong>
          <pre className="bg-gray-100 p-3 rounded mt-1 whitespace-pre-wrap break-word">
            {cv.curriculum_vitae_content_suggestions ||
              'No suggestions available'}
          </pre>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}
