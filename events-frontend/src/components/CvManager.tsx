import React, { useState } from 'react';
import { DataTable } from './DataTable';
import { MessageDisplay } from './MessageDisplay';

interface Cv {
  id: number;
  name: string;
  curriculum_vitae_content: string;
}

interface CvManagerProps {
  cvs: Cv[];
}

export function CvManager({ cvs }: CvManagerProps) {
  const [name, setName] = useState('');
  const [cvContent, setCvContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

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
      } else {
        setMessage('Failed to delete CV');
      }
    } catch (error) {
      setMessage('Error deleting CV');
    }
  };

  const cvColumns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'curriculum_vitae_content', header: 'CV Content' },
  ];

  return (
    <div style={{ marginBottom: '40px' }}>
      <h1>Add CV</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="curriculum_vitae_content">
            Curriculum Vitae Content:
          </label>
          <textarea
            id="curriculum_vitae_content"
            name="curriculum_vitae_content"
            value={cvContent}
            onChange={(e) => setCvContent(e.target.value)}
            required
            rows={5}
            style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
          />
        </div>
        <button type="submit" disabled={isSubmitting || !cvContent.trim()}>
          {isSubmitting ? 'Submitting...' : 'Submit CV'}
        </button>
      </form>
      <MessageDisplay message={message} marginTop="20px" />

      <h1 style={{ marginTop: '40px' }}>CV List</h1>
      <DataTable
        data={cvs}
        columns={cvColumns}
        onDelete={handleDeleteCv}
        emptyMessage="No CVs submitted yet."
      />
    </div>
  );
}
