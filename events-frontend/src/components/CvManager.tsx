import React, { useState, useEffect } from 'react';
import { DataTable } from './DataTable';
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
        onActionClick={handleViewClick}
        actionLabel="View/Edit"
        emptyMessage="No CVs submitted yet."
      />

      {showModal && selectedCv && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <h2>CV Details</h2>
            <div style={{ marginBottom: '15px' }}>
              <strong>ID:</strong> {selectedCv.id}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Name:</strong> {selectedCv.name}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>CV Content:</strong>
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '5px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {selectedCv.curriculum_vitae_content}
              </pre>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{ padding: '10px 20px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
