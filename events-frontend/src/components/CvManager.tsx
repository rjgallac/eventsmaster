import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from './DataTable';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MessageDisplay } from './MessageDisplay';

interface Cv {
  id: number;
  name: string;
  curriculum_vitae_content: string;
}

export function CvManager() {
  const [name, setName] = useState('');
  const [cvContent, setCvContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [selectedCv, setSelectedCv] = useState<Cv | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCvs();
  }, []);

  const fetchCvs = async () => {
    try {
      const response = await fetch('/api/cv');
      if (response.ok) {
        const data = await response.json();
        setCvs(data);
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !cvContent.trim()) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, curriculum_vitae_content: cvContent }),
      });

      if (response.ok) {
        setMessage('CV submitted successfully!');
        setName('');
        setCvContent('');
        fetchCvs();
      } else {
        setMessage('Failed to submit CV');
      }
    } catch (error) {
      setMessage('Error connecting to backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCv = async (id: number) => {
    try {
      const response = await fetch(`/api/cv/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('CV deleted successfully!');
        fetchCvs();
      } else {
        setMessage('Failed to delete CV');
      }
    } catch (error) {
      setMessage('Error deleting CV');
    }
  };

  const handleViewClick = (cv: Cv) => {
    setSelectedCv(cv);
    setShowModal(true);
  };

  const cvColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
  ];

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">Add CV</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label
            htmlFor="curriculum_vitae_content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Curriculum Vitae Content:
          </label>
          <textarea
            id="curriculum_vitae_content"
            name="curriculum_vitae_content"
            value={cvContent}
            onChange={(e) => setCvContent(e.target.value)}
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !cvContent.trim()}
          className={`w-full px-4 py-2 text-white rounded-md ${isSubmitting || !cvContent.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit CV'}
        </button>
      </form>
      <MessageDisplay message={message} marginTop="20px" />

      <h1 className="text-2xl font-bold mt-8 mb-4">CV List</h1>
      <DataTable
        data={cvs}
        columns={cvColumns}
        onDelete={handleDeleteCv}
        onActionClick={handleViewClick}
        actionLabel="View/Edit"
        emptyMessage="No CVs submitted yet."
      />

      {showModal && selectedCv && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-[90%] max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">CV Details</h2>
            <div className="mb-3">
              <strong>ID:</strong> {selectedCv.id}
            </div>
            <div className="mb-3">
              <strong>Name:</strong> {selectedCv.name}
            </div>
            <div className="mb-3">
              <strong>CV Content:</strong>
              <pre className="bg-gray-100 p-3 rounded mt-1 whitespace-pre-wrap break-word">
                {selectedCv.curriculum_vitae_content}
              </pre>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
